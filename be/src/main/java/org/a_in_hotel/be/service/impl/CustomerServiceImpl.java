package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Expression;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.Enum.BookingStatus;
import org.a_in_hotel.be.dto.response.BookingSummaryResponse;
import org.a_in_hotel.be.dto.response.CustomerAggregateDTO;
import org.a_in_hotel.be.dto.response.CustomerResponse;
import org.a_in_hotel.be.dto.response.DetailCustomerResponse;
import org.a_in_hotel.be.entity.Customer;
import org.a_in_hotel.be.entity.CustomerStats;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.exception.NotFoundException;
import org.a_in_hotel.be.mapper.CustomerDetailMapper;
import org.a_in_hotel.be.mapper.CustomerMapper;
import org.a_in_hotel.be.repository.BookingRepository;
import org.a_in_hotel.be.repository.CustomerRepository;
import org.a_in_hotel.be.repository.CustomerStatsRepository;
import org.a_in_hotel.be.repository.RewardTransactionRepository;
import org.a_in_hotel.be.service.CustomerService;
import org.a_in_hotel.be.util.SearchHelper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository repository;
    private final CustomerStatsRepository customerStatsRepository;
    private final BookingRepository bookingRepository;
    private final RewardTransactionRepository rewardTransactionRepository;
    private final CustomerDetailMapper customerDetailMapper;
    private final CustomerMapper mapper;
    private static final List<String> SEARCH_FIELDS =
            List.of("customerCode", "firstName", "lastName", "phoneNumber", "account.email");

    @Override
    public Page<CustomerResponse> getListCustomer(
            Integer page,
            Integer size,
            String sort,
            String filter,
            String searchField,
            String searchValue,
            boolean all) {
        try {
            Specification<Customer> sortable = RSQLJPASupport.toSort(sort);
            Specification<Customer> filterable = RSQLJPASupport.toSpecification(filter);
            Specification<Customer> searchable =
                    SearchHelper.buildSearchSpec(searchField, searchValue, SEARCH_FIELDS);
            if (StringUtils.isNotBlank(searchValue) && searchValue.trim().contains(" ")) {

                String likeValue = "%" + searchValue.trim().toLowerCase() + "%";

                Specification<Customer> fullNameSpec = (root, query, cb) -> {
                    Expression<String> firstLast = cb.concat(
                            cb.concat(cb.lower(root.get("firstName")), " "),
                            cb.lower(root.get("lastName"))
                    );

                    Expression<String> lastFirst = cb.concat(
                            cb.concat(cb.lower(root.get("lastName")), " "),
                            cb.lower(root.get("firstName"))
                    );

                    return cb.or(
                            cb.like(firstLast, likeValue),
                            cb.like(lastFirst, likeValue)
                    );
                };
                searchable = searchable.or(fullNameSpec);
            }
            Pageable pageable = all
                    ? Pageable.unpaged()
                    : PageRequest.of(page - 1, size);

            Page<Customer> customerPage =
                    repository.findAll(
                            sortable.and(filterable).and(searchable),
                            pageable
                    );
            List<Long> customerIds = customerPage.getContent()
                    .stream()
                    .map(Customer::getId)
                    .toList();
            Map<Long, CustomerStats> statsMap =
                    customerStatsRepository.findByCustomerIdIn(customerIds)
                            .stream()
                            .collect(Collectors.toMap(
                                    CustomerStats::getCustomerId,
                                    s -> s
                            ));

            return customerPage.map(customer -> {

                CustomerStats stats = statsMap.get(customer.getId());

                CustomerAggregateDTO aggregate = new CustomerAggregateDTO(
                        customer.getId(),
                        customer.getCustomerCode(),
                        customer.getAccount() != null
                                ? customer.getAccount().getEmail()
                                : null,
                        customer.getFirstName(),
                        customer.getLastName(),
                        customer.getPhoneNumber(),
                        stats != null ? stats.getTotalCompletedBookings() : 0,
                        stats != null ? stats.getRewardBalance() : BigDecimal.ZERO,
                        customer.getBlocked(),
                        stats != null ? stats.getLastBookingAt() : null
                );

                return mapper.toResponse(aggregate);
            });
        } catch (Exception e) {
            log.error("get list customer error", e);
            return Page.empty();
        }
    }

    @Override
    public void updateStatus(Long id, Boolean blocked) {
        try {
            log.info("start update customer status");
            Customer customer = repository.getReferenceById(id);
            customer.setBlocked(blocked);
            repository.save(customer);
        }catch (EntityNotFoundException e){
            log.warn(" customer with id {} not found: {}", id, e.getMessage());
            throw new ErrorHandler(HttpStatus.NOT_FOUND, "Không tìm thấy customer có ID: " + id);
        } catch (Exception e){
            log.error(e.getMessage(), e);
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public DetailCustomerResponse getCustomerDetail(Long customerId) {
        Customer customer = repository.findById(customerId)
                .orElseThrow(() -> new NotFoundException("Customer not found"));

        Integer usedPoint =
                rewardTransactionRepository.sumUsedPointsByCustomer(customerId);

        return customerDetailMapper.toDetailResponse(customer, usedPoint);
    }

    @Override
    public BookingSummaryResponse getCustomerBookingSummary(Long customerId) {
        List<Object[]> result = bookingRepository.getBookingSummaryRaw(
                customerId,
                BookingStatus.CHECKOUT.getCode()
        );

        if (result == null || result.isEmpty()) {
            return new BookingSummaryResponse(0L, 0L, 0.0);
        }

        Object[] row = result.get(0);

        Long totalBookings = ((Number) row[0]).longValue();
        Long nightsStayed = ((Number) row[1]).longValue();
        Double totalRevenue = ((Number) row[2]).doubleValue();

        return new BookingSummaryResponse(
                totalBookings,
                nightsStayed,
                totalRevenue
        );
    }
}
