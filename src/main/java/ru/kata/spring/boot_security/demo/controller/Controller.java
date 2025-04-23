package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.dto.Mapper;
import ru.kata.spring.boot_security.demo.dto.UserDto;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class Controller {

    private final UserService userService;
    private final Mapper mapper;

    public Controller(UserService userService, Mapper mapper) {
        this.userService = userService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseBody
    public List<UserDto> getUsers() {
        return userService.getUserDtos();
    }

    @GetMapping("/current")
    public UserDto getUser(@AuthenticationPrincipal UserDetails user) {
        return userService.getUserDtoByUsername(user.getUsername());
    }

    @GetMapping("/{userId}")
    @ResponseBody
    public UserDto getUser(@PathVariable long userId) {
        return mapper.toDto(userService.getUserById(userId).get());
    }

    @PutMapping
    public ResponseEntity<Void> updateUser(@RequestBody UserDto userDto) {
        userService.saveOrUpdate(userDto);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<Void> createUser(@RequestBody UserDto userDto) {
        userService.saveOrUpdate(userDto);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable long userId) {
        userService.deleteUserById(userId);
        return ResponseEntity.noContent().build();
    }
}
