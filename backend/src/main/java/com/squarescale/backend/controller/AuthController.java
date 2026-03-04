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
    public record ForgotUserRequest(String email, String userID) {}
    public record ResetPasswordRequest(String email, String userID, String newPassword) {}

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

    /**
     * Forgot password step 1: verify that email + userID (we treat this as username) exist and match.
     */
    @PostMapping("/forgot/verify-user")
    public ResponseEntity<String> verifyForgotUser(@RequestBody ForgotUserRequest req) {
        if (req == null || req.email() == null || req.userID() == null) {
            return ResponseEntity.badRequest().body("Email and User ID are required.");
        }

        Optional<User> u = userRepo.findByUsername(req.userID());
        if (u.isEmpty() || !req.email().equalsIgnoreCase(u.get().getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email or User ID is incorrect.");
        }

        return ResponseEntity.ok("User verified.");
    }

    /**
     * Forgot password step 3: after security question passes on the frontend,
     * actually change the password in the database (simple version).
     */
    @PostMapping("/forgot/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest req) {
        if (req == null || req.email() == null || req.userID() == null || req.newPassword() == null) {
            return ResponseEntity.badRequest().body("Email, User ID and new password are required.");
        }

        Optional<User> u = userRepo.findByUsername(req.userID());
        if (u.isEmpty() || !req.email().equalsIgnoreCase(u.get().getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email or User ID is incorrect.");
        }

        User user = u.get();

        String pwdErr = validatePassword(req.newPassword());
        if (pwdErr != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(pwdErr);
        }

        // Simple password reuse check: don't allow same as current.
        if (req.newPassword().equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("New password cannot be the same as the old password.");
        }

        // For this project we store the password as plain text.
        user.setPassword(req.newPassword());
        user.setPasswordLastSet(LocalDateTime.now());
        user.setFailedLoginAttempts(0);

        userRepo.save(user);

        return ResponseEntity.ok("Password reset successfully. You can now log in with your new password.");
    }

    /**
     * Simple password rules (requirement 10) in the backend to match the frontend checks.
     */
    private String validatePassword(String password) {
        if (password == null || password.length() < 8) {
            return "Password must be at least 8 characters.";
        }
        if (!Character.isLetter(password.charAt(0))) {
            return "Password must start with a letter.";
        }
        boolean hasLetter = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;
        for (char c : password.toCharArray()) {
            if (Character.isLetter(c)) hasLetter = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else hasSpecial = true;
        }
        if (!hasLetter) {
            return "Password must contain at least one letter.";
        }
        if (!hasDigit) {
            return "Password must contain at least one number.";
        }
        if (!hasSpecial) {
            return "Password must contain at least one special character.";
        }
        return null;
    }
}

