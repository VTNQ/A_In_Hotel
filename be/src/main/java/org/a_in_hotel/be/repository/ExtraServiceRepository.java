package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.ExtraService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ExtraServiceRepository extends JpaRepository<ExtraService,Long>, JpaSpecificationExecutor<ExtraService> {
}
