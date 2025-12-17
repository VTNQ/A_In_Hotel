package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {
    Optional<Category> findByName(String name);

    @Query("SELECT distinct c "
           + "FROM  Category c"
           + " join c.rooms r"
           + " where c.type =1 "
           + "and r.hotel.id = :hotelId "
           + "and c.isActive =true")
    List<Category> findRoomTypeByHotel(@Param("hotelId")Long hotelId);

}
