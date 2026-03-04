package com.squarescale.backend.controller;

import com.squarescale.backend.entity.User;
import com.squarescale.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepo;

    public AuthController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public record LoginRequest(String username, String password) {}
    public record LoginResponse(Long userId, String username, String role, String email) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (req == null || req.username() == null || req.password() == null) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        Optional<User> u = userRepo.findByUsername(req.username());
        if (u.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        User user = u.get();

        if (!user.isActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Account is inactive");
        }

        if (user.getSuspendedUntil() != null && user.getSuspendedUntil().isAfter(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Account is suspended until " + user.getSuspendedUntil());
        }

        // Simple password check for a college project (upgrade to hashed passwords later).
        if (user.getPassword() == null || !user.getPassword().equals(req.password())) {
            int attempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(attempts);

            // Requirement: max 3 wrong attempts, then suspend.
            if (attempts >= 3) {
                user.setActive(false);
                user.setSuspendedUntil(LocalDateTime.now().plusDays(1));
            }

            userRepo.save(user);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        // Successful login resets failed attempts.
        user.setFailedLoginAttempts(0);
        userRepo.save(user);

        return ResponseEntity.ok(new LoginResponse(user.getId(), user.getUsername(), user.getRole(), user.getEmail()));
    }
}

