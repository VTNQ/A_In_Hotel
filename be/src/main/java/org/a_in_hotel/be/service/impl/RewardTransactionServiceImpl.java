package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.response.RewardTransactionResponse;
import org.a_in_hotel.be.entity.RewardTransaction;
import org.a_in_hotel.be.mapper.RewardTransactionMapper;
import org.a_in_hotel.be.repository.RewardTransactionRepository;
import org.a_in_hotel.be.service.RewardTransactionService;
import org.a_in_hotel.be.util.SearchHelper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class RewardTransactionServiceImpl implements RewardTransactionService {
    private final RewardTransactionRepository repository;
    private final RewardTransactionMapper mapper;
    private static final List<String> SEARCH_FIELDS = List.of("transactionCode","bookingCode");
    @Override
    public Page<RewardTransactionResponse> getRewardTransaction(
            Integer page,
            Integer size,
            String sort,
            String filter,
            String searchField,
            String searchValue,
            boolean all) {
        try {
            log.info("start to get list reward transaction");
            Specification<RewardTransaction> sortable= RSQLJPASupport.toSort(sort);
            Specification<RewardTransaction>filterable= RSQLJPASupport.toSpecification(filter);
            Specification<RewardTransaction>searchable= SearchHelper.buildSearchSpec(searchField,searchValue,SEARCH_FIELDS);
            Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
            return repository.findAll(
                    sortable
                            .and(filterable)
                            .and(searchable.and(filterable)), pageable
            ).map(mapper::toResponse);
        }catch (Exception e){
            e.printStackTrace();
            log.error(e.getMessage());
            return null;
        }
    }
}
