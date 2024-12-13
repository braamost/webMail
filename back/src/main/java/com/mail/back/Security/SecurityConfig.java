package com.mail.back.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF protection (enable and configure it properly in production)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/users/**").permitAll()
                        .requestMatchers("/api/emails/**").permitAll()// Allow public access to /api/users/** endpoints
                        .anyRequest().authenticated() // Require authentication for all other endpoints
                )
                .formLogin(formLogin -> formLogin // Configure form login
                        .loginPage("http://localhost:5173/") // Specify custom login page URL (optional)
                        .permitAll() // Allow everyone to access the login page
                )
                .httpBasic(AbstractHttpConfigurer::disable) // Disable HTTP Basic if not needed
                .addFilterBefore(corsFilter(), CorsFilter.class); // Add the CORS filter

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:5173"); // Allow the frontend origin (React app)
        config.addAllowedMethod("*"); // Allow all HTTP methods (GET, POST, etc.)
        config.addAllowedHeader("*"); // Allow all headers
        config.setAllowCredentials(true); // Allow cookies to be sent with requests

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config); // Apply CORS configuration to all endpoints under /api/**

        return new CorsFilter(source);
    }
}
