package com.example.apigateway.error;

import com.example.commonutils.api.RequestResponse;
import com.example.commonutils.exception.ErrorCode;
import org.springframework.boot.autoconfigure.web.reactive.error.DefaultErrorWebExceptionHandler;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.reactive.error.ErrorAttributes;
import org.springframework.context.ApplicationContext;
import org.springframework.boot.autoconfigure.web.ErrorProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserter;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import static org.springframework.web.reactive.function.server.RouterFunctions.route;
import static org.springframework.web.reactive.function.server.RequestPredicates.accept;

import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.util.Map;
import java.util.concurrent.TimeoutException;

public class JsonErrorWebExceptionHandler extends DefaultErrorWebExceptionHandler {
    public JsonErrorWebExceptionHandler(
            ErrorAttributes errorAttributes,
            org.springframework.boot.autoconfigure.web.WebProperties.Resources resources,
            ErrorProperties errorProperties,
            ApplicationContext applicationContext) {
        super(errorAttributes, resources, errorProperties, applicationContext);
    }

    @Override
    protected Map<String, Object> getErrorAttributes(ServerRequest request, ErrorAttributeOptions options) {
        return super.getErrorAttributes(
                request,
                options.including(
                        ErrorAttributeOptions.Include.MESSAGE
                )
        );
    }

    @Override
    protected Mono<ServerResponse> renderErrorResponse(ServerRequest request) {
        Map<String, Object> attrs = getErrorAttributes(request, ErrorAttributeOptions.defaults());
        HttpStatus status = HttpStatus.valueOf(getHttpStatus(attrs));
        if(status==HttpStatus.SERVICE_UNAVAILABLE){
            var body= RequestResponse.error(
                    ErrorCode.SERVICE_UNAVAILABLE.getCode(),
                    ErrorCode.SERVICE_UNAVAILABLE.getDescription()
            );
            return ServerResponse.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(BodyInserters.fromValue(body));
        }
        var body=RequestResponse.error(status.value(),status.getReasonPhrase());
        return ServerResponse.status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(body));
    }

    @Override
    protected RouterFunction<ServerResponse> getRoutingFunction(ErrorAttributes errorAttributes) {
        return route(accept(MediaType.ALL),this::renderErrorResponse);
    }
    private boolean isDownstreamUnavailable(Throwable ex) {
        if(ex==null)return false;
        if(ex instanceof ConnectException)return true;
        if(ex instanceof TimeoutException)return true;
        if(ex instanceof SocketTimeoutException)return true;
        String msg=ex.getMessage();

        if(msg != null){
            String m=msg.toLowerCase();
            if (m.contains("connection refused") || m.contains("connection reset") || m.contains("timed out")) {
                return true;
            }
        }
        Throwable cause = ex.getCause();
        if (cause != null && cause != ex) {
            return isDownstreamUnavailable(cause);
        }
        return false;
    }
}
