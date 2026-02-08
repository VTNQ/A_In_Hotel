package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.response.RewardTransactionResponse;
import org.springframework.data.domain.Page;

public interface RewardTransactionService {
    Page<RewardTransactionResponse> getRewardTransaction(
            Integer page,
            Integer size,
            String sort,
            String filter,
            String searchField,
            String searchValue,
            boolean all
    );
}
