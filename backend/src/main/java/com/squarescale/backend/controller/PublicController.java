package com.squarescale.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public (unauthenticated) endpoints: e.g. first-time access request from the "Create new user" flow.
 */
@RestController
@RequestMapping("/public")
public class PublicController {

    /** Body for the request-access form (first name, last name, address, DOB, email). */
    public record RegistrationRequest(
            String firstName,
            String lastName,
            String address,
            String dob,
            String email
    ) {}

    /**
     * Used by new users accessing the system for the first time.
     * This simple version just logs the request and simulates emailing the administrator.
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegistrationRequest req) {
        if (req == null ||
                req.firstName() == null ||
                req.lastName() == null ||
                req.address() == null ||
                req.dob() == null ||
                req.email() == null) {
            return ResponseEntity.badRequest().body("All fields are required.");
        }

        // Simulate sending an email to the administrator with the registration request.
        System.out.println("New access request:");
        System.out.println("Name: " + req.firstName() + " " + req.lastName());
        System.out.println("Address: " + req.address());
        System.out.println("DOB: " + req.dob());
        System.out.println("Email: " + req.email());

        String message = "Your request has been submitted. An administrator will review it and send you a login link if approved.";
        return ResponseEntity.ok(message);
    }
}

