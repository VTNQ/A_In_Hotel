package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.config.JwtService;
import org.a_in_hotel.be.dto.request.AccountDTO;
import org.a_in_hotel.be.dto.request.UserDTO;
import org.a_in_hotel.be.dto.response.AccountResponse;
import org.a_in_hotel.be.dto.response.CustomerProfileResponse;
import org.a_in_hotel.be.dto.response.FileUploadMeta;
import org.a_in_hotel.be.entity.*;
import org.a_in_hotel.be.mapper.AccountMapper;
import org.a_in_hotel.be.mapper.CustomerMapper;
import org.a_in_hotel.be.mapper.ImageMapper;
import org.a_in_hotel.be.mapper.StaffMapper;
import org.a_in_hotel.be.repository.*;
import org.a_in_hotel.be.service.AccountService;
import org.a_in_hotel.be.util.EmailService;
import org.a_in_hotel.be.util.GeneralService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class AccountServiceImpl implements AccountService {
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private GeneralService generalService;
    @Autowired
    private RoleRepository  roleRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private CustomerMapper customerMapper;
    @Autowired
    private StaffMapper staffMapper;
    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private SecurityUtils securityUtils;
    @Autowired
    private ImageMapper imageMapper;
    @Autowired
    private EmailService emailService;
    private static final List<String> SEARCH_FIELDS = List.of("email","fullName","phone");
    @Override
    public Account findByEmail(String email) {
        return accountRepository.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("User not found"));
    }

    @Override
    @Transactional
    public void save(AccountDTO accountDTO, MultipartFile file) {
        try {
            String rawPassword = generalService.generateRandomPassword(8);

            // 1. Save Account
            Account account = accountMapper.toEntity(accountDTO);
            account.setPassword(passwordEncoder.encode(rawPassword));
            accountRepository.save(account);

            // 2. Save Staff (OWNING SIDE)
            Staff staff = staffMapper.toEntity(accountDTO, securityUtils.getCurrentUserId());
            staff.setAccount(account);
            staffRepository.save(staff);

            if (file != null && !file.isEmpty()) {
                try {
                    FileUploadMeta avatar = generalService.saveFile(file, "avatar");
                    Image image = imageMapper.toBannerImage(avatar);
                    image.setEntityType("avatar");
                    image.setEntityId(account.getId());
                    imageRepository.save(image);
                    account.setImage(image);
                } catch (Exception e) {
                    throw new RuntimeException("Lỗi khi lưu hình ảnh: " + e.getMessage(), e);
                }
            }
            emailService.sendRegistrationEmail(accountDTO.getEmail(),accountDTO.getFullName(),accountDTO.getEmail(),rawPassword);
            log.info("save account:{}", account);
        }catch (Exception e){
            log.error("save error:{}",e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    @Transactional
    public void saveUser(UserDTO userDTO) {
        try{

            Account account = accountMapper.toEntityUser(userDTO);
            account.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            Role role = roleRepository.getReferenceById(6L);
            account.setRole(role);
            accountRepository.save(account);
            Customer customer = customerMapper.toEntityUser(userDTO);
            customer.setAccount(account);
            customerRepository.save(customer);
            emailService.sendRegistrationEmail(userDTO.getEmail(),userDTO.getFirstName()+" "+ userDTO.getLastName()
                    ,userDTO.getEmail(),userDTO.getPassword());
        }catch (Exception e){
            log.error("save error:{}",e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public Account getAccountFromToken(String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            String username = jwtService.extractEmail(token);
            return accountRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
        } catch (Exception e) {
            throw new RuntimeException("Invalid token", e);
        }
    }

    @Override
    public CustomerProfileResponse getAccountUserProfile() {
        Account account = accountRepository.getReferenceById(securityUtils.getCurrentUserId());
        return customerMapper.toProfile(account.getCustomer());
    }

    @Override
    public Account findById(Long id) {
        return accountRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    }

    @Override
    public Page<AccountResponse> findAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all) {
        try {
            Specification<Account>sortable= RSQLJPASupport.toSort(sort);
            Specification<Account>filterable= RSQLJPASupport.toSpecification(filter);
            Specification<Account>searchable= SearchHelper.buildSearchSpec(searchField,searchValue,SEARCH_FIELDS);
            Pageable pageable=all? Pageable.unpaged():PageRequest.of(page-1,size);
            Page<Account> accounts =accountRepository.
                    findAll(sortable.and(filterable).and(searchable),pageable);
            accounts.forEach(account ->
                    imageRepository.findFirstByEntityIdAndEntityType(account.getId(), "avatar")
                            .ifPresent(account::setImage)
            );
            return accounts.map(accountMapper::toResponse);
        }catch (Exception e){
            log.error("find country request error:{}",e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Account> account = accountRepository.findByEmail(email);
        return account.orElseThrow(()->new UsernameNotFoundException("User not found"));
    }


}
