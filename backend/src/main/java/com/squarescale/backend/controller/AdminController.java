// Controller for admin-only operations (create/update users, activate/deactivate, suspend, reports).
package com.squarescale.backend.controller;

import com.squarescale.backend.entity.User;
import com.squarescale.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/** Exposes REST endpoints under /admin for user management. */
@RestController
@RequestMapping("/admin")
public class AdminController {

    // Only these three roles are allowed when creating or updating a user.
    private static final Set<String> ALLOWED_ROLES = Set.of("ADMIN", "MANAGER", "USER");

    // Injected by Spring; used to read and write users in the database.
    private final UserRepository userRepo;

    public AdminController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    // ----- Endpoints -----

    /** GET /admin/users – Return all users (e.g. for the admin report). */
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    /** POST /admin/users – Create a new user; username is auto-generated from first name, last name, and current month/year. */
    @PostMapping("/users")
    public ResponseEntity<String> createUser(@RequestBody User user) {
        // Require first and last name so we can generate the username.
        if (user.getFirstName() == null || user.getLastName() == null) {
            return ResponseEntity.badRequest().body("First name and last name are required");
        }

        // Role must be one of ADMIN, MANAGER, USER.
        if (!isValidRole(user.getRole())) {
            return ResponseEntity.badRequest().body("Invalid role. Allowed roles: ADMIN, MANAGER, USER");
        }

        // Format: first initial + last name + MMyy (e.g. jdoe0326).
        String generatedUsername = generateUsername(user);

        // Usernames must be unique.
        if (userRepo.findByUsername(generatedUsername).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists: " + generatedUsername);
        }

        user.setUsername(generatedUsername);
        userRepo.save(user);
        return ResponseEntity.ok("User created with username: " + generatedUsername);
    }

    /** PUT /admin/users/{id} – Update an existing user's name, email, and role. */
    @PutMapping("/users/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> u = userRepo.findById(id);
        if (u.isEmpty()) return ResponseEntity.notFound().build();
        User user = u.get();

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());

        if (!isValidRole(updatedUser.getRole())) {
            return ResponseEntity.badRequest().body("Invalid role. Allowed roles: ADMIN, MANAGER, USER");
        }
        user.setRole(updatedUser.getRole());

        userRepo.save(user);
        return ResponseEntity.ok("User updated");
    }

    /** POST /admin/users/{id}/activate – Set user as active so they can log in. */
    @PostMapping("/users/{id}/activate")
    public ResponseEntity<String> activateUser(@PathVariable Long id) {
        Optional<User> u = userRepo.findById(id);
        if (u.isEmpty()) return ResponseEntity.notFound().build();
        User user = u.get();
        user.setActive(true);
        userRepo.save(user);
        return ResponseEntity.ok("User activated");
    }

    /** POST /admin/users/{id}/deactivate – Set user as inactive (cannot log in). */
    @PostMapping("/users/{id}/deactivate")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id) {
        Optional<User> u = userRepo.findById(id);
        if (u.isEmpty()) return ResponseEntity.notFound().build();
        User user = u.get();
        user.setActive(false);
        userRepo.save(user);
        return ResponseEntity.ok("User deactivated");
    }

    /** POST /admin/users/{id}/suspend – Suspend user from startDateTime until untilDateTime (e.g. extended leave). */
    @PostMapping("/users/{id}/suspend")
    public ResponseEntity<String> suspendUser(@PathVariable Long id,
                                              @RequestParam String startDateTime,
                                              @RequestParam String untilDateTime) {
        Optional<User> u = userRepo.findById(id);
        if (u.isEmpty()) return ResponseEntity.notFound().build();
        User user = u.get();

        LocalDateTime start = LocalDateTime.parse(startDateTime);
        LocalDateTime suspendUntil = LocalDateTime.parse(untilDateTime);

        user.setSuspendedUntil(suspendUntil);
        user.setActive(false);
        userRepo.save(user);

        return ResponseEntity.ok("User suspended from " + start + " until " + suspendUntil);
    }

    /** GET /admin/users/expired-passwords – List users whose password was last set more than 3 months ago. */
    @GetMapping("/users/expired-passwords")
    public List<User> expiredPasswords() {
        LocalDateTime threeMonthsAgo = LocalDateTime.now().minusMonths(3);
        return userRepo.findByPasswordLastSetBefore(threeMonthsAgo);
    }

    /** POST /admin/users/{id}/send-email – Send a message to the user's email (currently simulated with console output). */
    @PostMapping("/users/{id}/send-email")
    public ResponseEntity<String> sendEmail(@PathVariable Long id, @RequestParam String message) {
        Optional<User> u = userRepo.findById(id);
        if (u.isEmpty()) return ResponseEntity.notFound().build();
        User user = u.get();

        // Simulate sending email (replace with real mail service when needed).
        System.out.println("Email sent to " + user.getEmail() + ": " + message);
        return ResponseEntity.ok("Email sent to " + user.getEmail());
    }

    // ----- Helpers -----

    /** Returns true only if role is ADMIN, MANAGER, or USER (case-insensitive). */
    private boolean isValidRole(String role) {
        if (role == null) {
            return false;
        }
        return ALLOWED_ROLES.contains(role.toUpperCase());
    }

    /** Builds username as: first initial + full last name + MMyy (e.g. jdoe0326 for Jane Doe created in Mar 2026). */
    private String generateUsername(User user) {
        String firstName = user.getFirstName().trim();
        String lastName = user.getLastName().trim();

        String firstInitial = firstName.substring(0, 1).toLowerCase();
        String last = lastName.toLowerCase();

        // MySQL column is varchar(16) in your dump; keep username within that limit.
        int maxLastNameLen = 16 - 1 - 4; // 1 initial + 4 date digits
        if (last.length() > maxLastNameLen) {
            last = last.substring(0, maxLastNameLen);
        }

        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("MMyy"));
        return firstInitial + last + datePart;
    }
}