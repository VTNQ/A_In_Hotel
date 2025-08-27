package com.example.systemconfigservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
        scanBasePackages = {"com.example.systemconfigservice", "com.example.commonsecurity"}
)
public class SystemConfigServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SystemConfigServiceApplication.class, args);
    }

}
