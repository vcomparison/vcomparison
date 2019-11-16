package com.junction.vcomparison;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.TimeUnit;

/**
 * @author avbelyaev
 */
@SpringBootApplication
public class VCApplication {

    public static void main(String[] args) {
        SpringApplication.run(VCApplication.class, args);
    }

    @Configuration
    protected static class WebConfig implements WebMvcConfigurer {

        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedMethods("HEAD", "GET", "PUT", "POST", "DELETE", "PATCH");
        }

        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
            // static data (for SPA bundle)
            registry.addResourceHandler("/static/**")
                    .addResourceLocations("classpath:public/static/")
                    .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS));
        }

    }
}

