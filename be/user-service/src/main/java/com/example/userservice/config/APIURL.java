package com.example.userservice.config;

public class APIURL {
    public static final String[] URL_ANONYMOUS_POST = {
            "/users/register",
    };
    public static final String[] URL_ANONYMOUS_GET = {
            "/users/getAll",
            "/docs",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };
}
