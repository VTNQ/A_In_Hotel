package org.a_in_hotel.be.config;

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
            "/docs",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/me",
            "/oauth2/**",
            "/getAll"
    };
}
