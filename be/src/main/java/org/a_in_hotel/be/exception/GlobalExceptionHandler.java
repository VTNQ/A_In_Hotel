package org.a_in_hotel.be.exception;


import jakarta.validation.ConstraintViolationException;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.exception.account.DuplicateEmailException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    /**
     * Handle @Valid validation errors (@ModelAttribute, @RequestBody)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RequestResponse<Void>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .findFirst()
                .orElse("Dữ liệu không hợp lệ");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(RequestResponse.error(errorMessage));
    }

    /**
     * Handle validation errors from @RequiredImage, @RequestPart, @RequestParam
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<RequestResponse<Void>> handleConstraintViolation(ConstraintViolationException ex) {

        String errorMessage = ex.getConstraintViolations()
                .stream()
                .map(violation -> violation.getMessage())
                .findFirst()
                .orElse("Dữ liệu không hợp lệ");

        return ResponseEntity.badRequest()
                .body(RequestResponse.error(errorMessage));
    }

    /**
     * Handle JSON parse error
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<RequestResponse<Void>> handleInvalidJson(HttpMessageNotReadableException ex) {
        return ResponseEntity
                .badRequest()
                .body(RequestResponse.error("Dữ liệu gửi lên không hợp lệ hoặc sai định dạng JSON."));
    }

    /**
     * Duplicated email
     */
    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ExceptionResponse> handleDuplicateEmailException(DuplicateEmailException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ExceptionResponse(e.getMessage()));
    }

    /**
     * Illegal arguments
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ExceptionResponse> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ExceptionResponse(e.getMessage()));
    }

    /**
     * Catch-all fallback
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<RequestResponse<Void>> handleGeneralException(Exception ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(RequestResponse.error(ex.getMessage()));
    }
}
