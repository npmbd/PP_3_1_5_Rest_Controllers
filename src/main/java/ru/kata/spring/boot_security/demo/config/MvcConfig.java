package ru.kata.spring.boot_security.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/html/index.html");
        registry.addViewController("/login").setViewName("forward:/html/login.html");
        registry.addViewController("/registration").setViewName("forward:/html/registration.html");
        registry.addViewController("/admin").setViewName("forward:/html/adminPage.html");
        registry.addViewController("/user").setViewName("forward:/html/user.html");
    }
}
