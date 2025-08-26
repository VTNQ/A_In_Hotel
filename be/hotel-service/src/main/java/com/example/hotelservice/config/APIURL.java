package com.example.hotelservice.config;

public class APIURL {
    public static final String[] URL_ANONYMOUS_POST = {
            "/api/hotel/create"
    };
    public static final String[]URL_SUPERADMIN_GET={
        "/api/hotel/getAll"
    };
    public static final String[]URL_SUPERADMIN_PUT={
            "/api/hotel/updateStatus/**",
            "/api/hotel/update/**",
    };
    public static final String[]URL_ANONYMOUS_GET={
            "/docs",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };
}
