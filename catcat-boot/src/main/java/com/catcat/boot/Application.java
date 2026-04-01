package com.catcat.boot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * CatCat 应用启动类
 */
@SpringBootApplication
@ComponentScan(basePackages = "com.catcat")
@MapperScan("com.catcat.boot.mapper")
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
