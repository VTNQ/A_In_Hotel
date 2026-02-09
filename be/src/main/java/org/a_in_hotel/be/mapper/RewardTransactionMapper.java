package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.response.RewardTransactionResponse;
import org.a_in_hotel.be.entity.RewardTransaction;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RewardTransactionMapper {
    RewardTransactionResponse toResponse(RewardTransaction rewardTransaction);
}
