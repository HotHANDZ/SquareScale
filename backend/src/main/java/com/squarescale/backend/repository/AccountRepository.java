package com.squarescale.backend.repository;

import com.squarescale.backend.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    boolean existsByAccountNumber(String accountNumber);

    boolean existsByAccountNameIgnoreCase(String accountName);

    Optional<Account> findByAccountNumber(String accountNumber);

    Optional<Account> findByAccountNameIgnoreCase(String accountName);

    boolean existsByAccountNumberAndIdNot(String accountNumber, Long id);

    boolean existsByAccountNameIgnoreCaseAndIdNot(String accountName, Long id);
}
