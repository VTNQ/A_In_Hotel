package com.example.bannerservice.config;

public class APIURL {
    public static final String[]URL_ANONYMOUS_GET={
            "/banners/getAll",
            "/banner-categories/getAll",
            "/docs",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };
    public static final String[]URL_SUPERADMIN_POST={
            "/banners/create",
            "/banner-categories/create",
    };
    public static final String[]URL_SUPERADMIN_PUT={
            "/banners/update/**",
            "/banner-categories/update/**",
    };
}
