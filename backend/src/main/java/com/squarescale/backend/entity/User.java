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
    
    //Identification number
    public Long getId() { return id; }

    //Username
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    //Password
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    //Role
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    //Active status
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    //First Name
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    //Last Name
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    //Email
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    //Date
    public LocalDateTime getSuspendedUntil() { return suspendedUntil; }
    public void setSuspendedUntil(LocalDateTime suspendedUntil) { this.suspendedUntil = suspendedUntil; }

}//END OF CLASS