package com.example.hotelservice.config;

public class APIURL {
    public static final String[] URL_SUPERADMIN_POST = {
            "/api/hotel/create"
    };
    public static final String[]URL_SUPERADMIN_GET={
        "/api/hotel/getAll"
    };
    public static final String[]URL_SUPERADMIN_PUT={
            "/api/hotel/updateStatus/**",
            "/api/hotel/update/**",
    };
}
