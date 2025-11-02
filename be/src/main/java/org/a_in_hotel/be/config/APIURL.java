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
    public static final String[] URL_SUPERADMIN_POST={
            "/api/hotels/create",

    };
    public static final String[] URL_ADMIN_POST={
            "/api/extra-room-service/create",
            "/api/rooms/create",
            "/api/room-types/create"
    };
    public static final String[] URL_ADMIN_PUT={
            "/api/room-types/update/**",
            "/api/extra-room-service/update/**",
            "/api/room-types/updateStatus/**",
            "/api/rooms/updateStatus/**",
            "/api/extra-room-service/updateStatus/**"
    };
}
