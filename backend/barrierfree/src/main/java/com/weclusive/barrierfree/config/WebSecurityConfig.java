package com.weclusive.barrierfree.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.weclusive.barrierfree.util.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	// 비밀번호 암호화
	// BCryptPasswordEncoder
	// : BCrypt라는 해시 함수를 이용하여 패스워드를 암호화하는 구현체

	// authenticationManager를 Bean 등록합니다.
//	@Bean
//	@Override
//	public AuthenticationManager authenticationManagerBean() throws Exception {
//		return super.authenticationManagerBean();
//	}

	@Bean
	public PasswordEncoder getPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.httpBasic().disable() // rest api이므로 기본설정 미사용
				.csrf().disable() // rest api이므로 csrf 보안 미사용
				.formLogin().disable().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);// jwt로
																													// 인증하므로
																													// 세션

	}
}