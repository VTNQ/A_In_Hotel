package com.example.brandservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.example.brandservice.client")
public class BrandServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(BrandServiceApplication.class, args);
	}

}
