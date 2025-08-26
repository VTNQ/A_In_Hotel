package com.example.systemconfigservice.config;

public class APIURL {
    public static final String[]URL_SUPERADMIN_POST={
            "/system-configs/create"
    };
    public static final String[]URL_SUPERADMIN_GET={
            "/system-configs/getAll"
    };
    public static final String[]URL_SUPERADMIN_DELETE={
            "/system-configs/delete/{id}"
    };
    public static final String[]URL_SUPERADMIN_PUT={
            "/system-configs/update/{id}"
    };
    public static final String[] URL_ANONYMOUS_GET = {
            "/docs",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };
}
