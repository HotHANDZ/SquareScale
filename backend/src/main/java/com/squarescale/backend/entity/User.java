package com.squarescale.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// Create @Entity @Table, @Id and #GeneratedValue allow for the database to recognize users as entities that it can store
@Entity
@Table(name = "users")


public class User {

    @Id
    @Column(name = "userID")
    private Long id;

    @Column(name = "firstName")
    private String firstName;

    @Column(name = "lastName")
    private String lastName;
    @Column(length = 16)
    private String username;

    @Column(name = "passwordHash")
    private String password; // for now this maps to passwordHash in MySQL
    
    private String email;

    @Column(name = "roleID")
    private Integer roleId; // 1=USER, 2=MANAGER, 3=ADMIN (matches your MySQL dump)

    @Column(name = "isActive")
    // set values for trackign if an account is active or not which will be affected by number of failed attempts
    private boolean active = true;
    @Column(name = "failed_login_attempts")
    private int failedLoginAttempts = 0;

    // keep tally of today's date and use it as a point of reference for when suspension should be lifted
    private LocalDateTime passwordLastSet;
    private LocalDateTime suspendedUntil;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;



    // CONSTRUCTORS -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    public User() {}

    // create a user with neccesary information
    public User(String firstName, String lastName, String username, String password, String email, String role) {
        
        this.firstName = firstName;
        this.lastName = lastName;

        this.username = username;
        this.password = password;

        this.email = email;

        setRole(role);

        
        this.passwordLastSet = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }


    // GETTERS AND SETTERS -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    
    //Identification number
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    //Username
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    //Password
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    //Role
    public Integer getRoleId() { return roleId; }
    public void setRoleId(Integer roleId) { this.roleId = roleId; }

    public String getRole() {
        if (roleId == null) return null;
        return switch (roleId) {
            case 3 -> "ADMIN";
            case 2 -> "MANAGER";
            case 1 -> "USER";
            default -> "USER";
        };
    }

    public void setRole(String role) {
        if (role == null) {
            this.roleId = null;
            return;
        }
        String r = role.trim().toUpperCase();
        this.roleId = switch (r) {
            case "ADMIN" -> 3;
            case "MANAGER" -> 2;
            case "USER" -> 1;
            default -> 1;
        };
    }
    
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

    public LocalDateTime getPasswordLastSet() { return passwordLastSet; }
    public void setPasswordLastSet(LocalDateTime passwordLastSet) { this.passwordLastSet = passwordLastSet; }

    public int getFailedLoginAttempts() { return failedLoginAttempts; }
    public void setFailedLoginAttempts(int failedLoginAttempts) { this.failedLoginAttempts = failedLoginAttempts; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

}//END OF CLASS