package com.example.authservice.config;

public class APIURL {
    public static final String[] URL_ANONYMOUS_POST = {
            "/api/account/register",
            "/oauth2/**",
            "/api/account/login",
            "/api/account/refresh",


    };
    public static final String[] URL_ADMIN_GET={
            "/api/account/is-admin",
    };
    public static final String[] URL_ANONYMOUS_GET = {
            "/api/account/role",
            "/api/account/me"
    };
}
