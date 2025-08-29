package com.example.commonsecurity.config;

public class APIURL {

    public static final String[] URL_SUPERADMIN_POST = {
            "/system-configs/create",
            "/hotels/create",
            "/banners/create",
            "/banner-categories/create",
            "/blogs"
    };
    public static final String[] URL_SUPERADMIN_PUT = {
            "/system-configs/update/{id}",
            "/hotels/update/{id}",
            "/hotels/updateStatus/{id}",
            "/banners/update/{id}",
            "/banner-categories/update/{id}",
            "/blogs/update/{id}",

    };
    public static final String[] URL_SUPERADMIN_GET = {
            "/system-configs/getAll",
            "/hotels/getAll",

    };
    public static final String[] URL_SUPERADMIN_DELETE = {
            "/system-configs/delete/{id}",
            "/blogs/delete/{id}",
    };
//    public static final String[]URL_ADMIN_POST={
//    };
//    public static final String[]URL_ADMIN_PUT={
//    };
//    public static final String[]URL_ADMIN_GET={
//
//    };
//    public static final String[]URL_ADMIN_DELETE={
//
//    };

}
