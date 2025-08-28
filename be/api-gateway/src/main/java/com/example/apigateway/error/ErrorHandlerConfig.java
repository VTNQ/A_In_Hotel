package com.example.apigateway.error;

import org.springframework.boot.autoconfigure.web.ErrorProperties;
import org.springframework.boot.autoconfigure.web.WebProperties;
import org.springframework.boot.web.reactive.error.ErrorAttributes;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.codec.ServerCodecConfigurer;

@Configuration
public class ErrorHandlerConfig {

    @Bean
    @Order(-2) // ưu tiên cao hơn mặc định
    public JsonErrorWebExceptionHandler jsonErrorWebExceptionHandler(
            ErrorAttributes errorAttributes,
            WebProperties webProperties,
            ErrorProperties errorProperties,
            ApplicationContext applicationContext,
            ServerCodecConfigurer serverCodecConfigurer
    ) {
        var handler = new JsonErrorWebExceptionHandler(
                errorAttributes,
                webProperties.getResources(),
                errorProperties,
                applicationContext
        );
        handler.setMessageWriters(serverCodecConfigurer.getWriters());
        handler.setMessageReaders(serverCodecConfigurer.getReaders());
        return handler;
    }


    @Bean
    public ErrorProperties errorProperties() {
        return new ErrorProperties();
    }


    @Bean
    public WebProperties webProperties() {
        return new WebProperties();
    }
}
