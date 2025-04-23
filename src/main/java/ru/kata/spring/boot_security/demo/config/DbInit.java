package ru.kata.spring.boot_security.demo.config;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.dto.UserDto;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.Set;

@Component
public class DbInit {

    private final UserService userService;

    public DbInit(UserService userService) {
        this.userService = userService;
    }

    @PostConstruct
    public void init() {
        UserDto user = new UserDto();
        user.setUsername("user");
        user.setFirstName("user");
        user.setLastName("user");
        user.setEmail("user@user.com");
        user.setPhoneNumber("123456789");
        user.setPassword("123");
        user.setRoles(Set.of("ROLE_USER"));
        userService.saveOrUpdate(user);

        UserDto admin = new UserDto();
        admin.setUsername("admin");
        admin.setFirstName("admin");
        admin.setLastName("admin");
        admin.setEmail("admin@admin.com");
        admin.setPhoneNumber("123456789");
        admin.setPassword("123");
        admin.setRoles(Set.of("ROLE_ADMIN"));
        userService.saveOrUpdate(admin);

        UserDto adminAndUser = new UserDto();
        adminAndUser.setUsername("admin-user");
        adminAndUser.setFirstName("admin-user");
        adminAndUser.setLastName("admin-user");
        adminAndUser.setEmail("admin-user@admin.com");
        adminAndUser.setPhoneNumber("123456789");
        adminAndUser.setPassword("123");
        adminAndUser.setRoles(Set.of("ROLE_ADMIN", "ROLE_USER"));
        userService.saveOrUpdate(adminAndUser);
    }
}
