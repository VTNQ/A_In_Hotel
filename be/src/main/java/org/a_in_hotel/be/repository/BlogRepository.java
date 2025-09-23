package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BlogRepository extends JpaRepository<Blog, Long> {}
