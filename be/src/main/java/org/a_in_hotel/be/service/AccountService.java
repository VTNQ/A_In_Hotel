package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.AccountDTO;
import org.a_in_hotel.be.dto.request.ChangePasswordRequest;
import org.a_in_hotel.be.dto.request.ProfileSystemRequest;
import org.a_in_hotel.be.dto.request.UserDTO;
import org.a_in_hotel.be.dto.response.AccountResponse;
import org.a_in_hotel.be.dto.response.CustomerProfileResponse;
import org.a_in_hotel.be.dto.response.ProfileSystemResponse;
import org.a_in_hotel.be.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

public interface AccountService extends UserDetailsService {
    Account findByEmail(String email);
    void save(AccountDTO accountDTO, MultipartFile file);

    void saveUser(UserDTO userDTO);
    Account getAccountFromToken(String token);

    CustomerProfileResponse getAccountUserProfile();
    Account findById(Long id);
    Page<AccountResponse> findAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);

    ProfileSystemResponse getProfile();

    void updateProfileSystem(ProfileSystemRequest request,MultipartFile image);

    void changePassword(ChangePasswordRequest request);
}
