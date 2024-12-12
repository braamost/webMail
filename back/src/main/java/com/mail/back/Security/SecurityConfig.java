package com.mail.back.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF protection (enable and configure it properly in production)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/users/**").permitAll() // Allow public access to specific endpoints (e.g., registration)
                        .anyRequest().authenticated() // Require authentication for all other endpoints
                )
                .formLogin(formLogin -> formLogin // Configure form login
                        .loginPage("http://localhost:5173/") // Specify custom login page URL (optional)
                        .permitAll() // Allow everyone to access the login page
                )
                .httpBasic(AbstractHttpConfigurer::disable); // Disable HTTP Basic if not needed

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}