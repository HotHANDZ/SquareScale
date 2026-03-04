package com.squarescale.backend.repository;

import com.squarescale.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;


// This interface extends JpaRepository, which provides basic CRUD operations for the User entity.  
// We also define custom query methods to find users by username and to find users whose password was last set before a certain date.
public interface UserRepository extends JpaRepository<User, Long> {

    // find a user by looking for their username.  "Optional<User>" is used to handle if the username doesn't exist
    Optional<User> findByUsername(String username);

    // find all users whose password was last set before a certain date, which will be used to identify accounts that need to be suspended
    List<User> findByPasswordLastSetBefore(java.time.LocalDateTime dateTime);
}