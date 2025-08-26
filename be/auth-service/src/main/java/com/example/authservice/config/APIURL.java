package com.example.authservice.config;

public class APIURL {
    public static final String[] URL_ANONYMOUS_POST = {
            "/register",

            "/login",
            "/refresh",


    };
    public static final String[] URL_SUPERADMIN_GET={
            "/is-Superadmin",
    };
    public static final String[] URL_ANONYMOUS_GET = {
            "/role",
            "/docs",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/me",
            "/oauth2/**",
            "/getAll"
    };
}
