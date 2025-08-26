package com.example.bannerservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class BannerServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(BannerServiceApplication.class, args);
	}

}
