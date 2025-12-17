package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.response.FacilityResponse;

import java.util.List;

public interface FacilityService {

    List<FacilityResponse>getFacilitiesAndServices();
}
