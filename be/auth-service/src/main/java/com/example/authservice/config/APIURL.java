package com.example.authservice.config;

public class APIURL {
    public static final String[] URL_ANONYMOUS_POST = {
            "/api/account/register",

            "/api/account/login",
            "/api/account/refresh",


    };
    public static final String[] URL_SUPERADMIN_GET={
            "/api/account/is-Superadmin",
    };
    public static final String[] URL_ANONYMOUS_GET = {
            "/api/account/role",
            "/api/account/me",
            "/oauth2/**",
            "/api/account/getAll"
    };
}
