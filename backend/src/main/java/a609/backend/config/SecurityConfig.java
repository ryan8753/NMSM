package a609.backend.config;

import a609.backend.handler.OAuth2AuthenticationSuccessHandler;
import a609.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;

@EnableWebSecurity // Spring Security 설정 활성화
@Configuration
public class SecurityConfig {
    @Autowired
    UserService userService;

    @Autowired
    OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http.cors().configurationSource(request -> {
            CorsConfiguration cors = new CorsConfiguration();
            cors.setAllowedOrigins(Arrays.asList("http://localhost:5000","http://localhost:3000", "http://i7a609.p.ssafy.io", "https://i7a609.p.ssafy.io"));
            cors.setAllowedMethods(Arrays.asList("GET","POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
            cors.setAllowedHeaders(Arrays.asList("*"));
            return cors;
        })
                .and().csrf().disable().headers().frameOptions().disable()
                .and().authorizeRequests()
                .antMatchers("/**").permitAll()
                .antMatchers("/api/v1/**").hasAuthority("USER").anyRequest().authenticated()
                .and().logout().logoutSuccessUrl("/")
                .and().oauth2Login().successHandler(oAuth2AuthenticationSuccessHandler).userInfoEndpoint().userService(userService).and()
                .and().build();
    }
}
