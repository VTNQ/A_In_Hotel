package org.a_in_hotel.be.exception;

public class BlogNotFoundException extends RuntimeException {
    public BlogNotFoundException(Long id) {
        super("Blog với id " + id + " không tồn tại");
    }
    public BlogNotFoundException(String message) {
        super(message);
    }
}
