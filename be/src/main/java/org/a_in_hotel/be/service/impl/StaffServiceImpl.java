package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.request.StaffRequest;
import org.a_in_hotel.be.dto.response.StaffResponse;
import org.a_in_hotel.be.entity.Account;
import org.a_in_hotel.be.entity.Staff;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.mapper.AccountMapper;
import org.a_in_hotel.be.mapper.StaffMapper;
import org.a_in_hotel.be.repository.AccountRepository;
import org.a_in_hotel.be.repository.StaffRepository;
import org.a_in_hotel.be.service.StaffService;
import org.a_in_hotel.be.util.GeneralService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {
    private final StaffRepository staffRepository;
    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;
    private final GeneralService generalService;
    private final StaffMapper staffMapper;
    private final SecurityUtils securityUtils;
    private static final List<String> SEARCH_FIELDS =  List.of("staffCode", "fullName");
    @Override
    @Transactional
    public void createStaff(StaffRequest request) {
        log.info("Staff Request: {}", request);
        try {
            Long currentUserId = securityUtils.getCurrentUserId();
            Long hotelId = securityUtils.getHotelId();

            Account account = accountMapper.toEntityStaff(request, currentUserId);
            String randomPassword = generalService.generateRandomPassword(8);
            account.setPassword(randomPassword);

            accountRepository.save(account);

            Staff staff = staffMapper.toEntity(request, currentUserId, hotelId);
            staff.setAccount(account);
            staffRepository.save(staff);

            log.info("Created staff success, id={}", staff.getId());
        } catch (DataIntegrityViolationException ex) {
            // thường do vi phạm unique email
            log.error("Duplicate or data integrity error when creating staff: {}", ex.getMessage(), ex);
            throw new RuntimeException("Email đã tồn tại hoặc dữ liệu không hợp lệ", ex);
        } catch (Exception e) {
            log.error("Failed to create staff. Type: {}, Message: {}",
                    e.getClass().getName(), e.getMessage(), e);
            throw new RuntimeException("Failed to create staff", e);
        }
    }

    @Override
    public Page<StaffResponse> getAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all) {
        try {
            log.info("start get all staff");
            Specification<Staff>sortable = RSQLJPASupport.toSort(sort);
            Specification<Staff>filterable = RSQLJPASupport.toSpecification(filter);
            Specification<Staff>searchable= SearchHelper.buildSearchSpec(searchField, searchValue, SEARCH_FIELDS);
            Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page-1,size);
            return staffRepository.findAll(sortable.and(filterable).and(searchable.and(filterable)),pageable).map(staffMapper::toResponse);
        }catch (Exception e){
            log.error("Failed to get all staff:{}",e.getMessage(),e);
            throw new RuntimeException("Failed to get all staff:",e);
        }
    }

    @Override
    @Transactional
    public void updateStatus(Long id, Boolean status) {
        try {
            log.info("start update staff status");
            Account account = accountRepository.getReferenceById(id);
            account.setIsActive(status);
            account.setUpdatedBy(String.valueOf(securityUtils.getCurrentUserId()));
            accountRepository.save(account);
            Staff staff = staffRepository.findByAccountId(id)
                    .orElseThrow(()-> new EntityNotFoundException("staff not found"));
            staff.setUpdatedBy(String.valueOf(securityUtils.getCurrentUserId()));
            staffRepository.save(staff);
        }catch (EntityNotFoundException e){
            log.warn("⚠️ Room Extra with id {} not found: {}", id, e.getMessage());
            throw new ErrorHandler(HttpStatus.NOT_FOUND, "Không tìm thấy dịch vu có ID: " + id);
        }catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public Staff findByAccountId(Long accountId) {
        return staffRepository.findByAccountId(accountId)
                .orElseThrow(()-> new EntityNotFoundException("staff not found"));
    }
}
