package com.squarescale.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

// Create @Entity @Table, @Id and #GeneratedValue allow for the database to recognize users as entities that it can store
@Entity
@Table(name = "users")


public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
    private Long id;

    private String firstName;
    private String lastName;
    private String username; // should be in the format of regularBrandon, managerBrandon or AdminBrandon
    private String password; // will be encrypted
    
    private String email;
    private String role; // Administrators, Mmanagers and users
    
    // set values for trackign if an account is active or not which will be affected by number of failed attempts
    private boolean active = true;
    private int failedLoginAttempts = 0;

    // keep tally of today's date and use it as a point of reference for when suspension should be lifted
    private LocalDateTime passwordLastSet;
    private LocalDateTime suspendedUntil;



    // CONSTRUCTORS -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    public User() {}

    // create a user with neccesary information
    public User(String firstName, String lastName, String username, String password, String email, String role) {
        
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.passwordLastSet = LocalDateTime.now();
    }


    // GETTERS AND SETTERS -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    public Long getId() { return id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

}//END OF CLASS