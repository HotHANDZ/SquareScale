package com.squarescale.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Chart of accounts row. Monetary fields use 2 decimal places (see {@link java.math.BigDecimal} scale in service layer).
 */
@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "accountId")
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String accountName;

    @Column(nullable = false, unique = true, length = 20)
    private String accountNumber;

    @Column(length = 500)
    private String description;

    /** "Debit" or "Credit" — normal balance side for this account. */
    @Column(nullable = false, length = 10)
    private String normalSide;

    @Column(nullable = false, length = 100)
    private String accountCategory;

    @Column(nullable = false, length = 100)
    private String accountSubcategory;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal initialBalance = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal debit = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal credit = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    /** User (admin) who created this account — FK to users.userID. */
    @Column(nullable = false)
    private Long userId;

    /** Display order within reports (e.g. "01"). */
    @Column(name = "accountOrder", nullable = false, length = 10)
    private String accountOrder;

    /** IS, BS, or RE. */
    @Column(nullable = false, length = 16)
    private String statementType;

    @Column(length = 500)
    private String commentText;

    @Column(nullable = false)
    private boolean active = true;

    public Account() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAccountName() { return accountName; }
    public void setAccountName(String accountName) { this.accountName = accountName; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getNormalSide() { return normalSide; }
    public void setNormalSide(String normalSide) { this.normalSide = normalSide; }

    public String getAccountCategory() { return accountCategory; }
    public void setAccountCategory(String accountCategory) { this.accountCategory = accountCategory; }

    public String getAccountSubcategory() { return accountSubcategory; }
    public void setAccountSubcategory(String accountSubcategory) { this.accountSubcategory = accountSubcategory; }

    public BigDecimal getInitialBalance() { return initialBalance; }
    public void setInitialBalance(BigDecimal initialBalance) { this.initialBalance = initialBalance; }

    public BigDecimal getDebit() { return debit; }
    public void setDebit(BigDecimal debit) { this.debit = debit; }

    public BigDecimal getCredit() { return credit; }
    public void setCredit(BigDecimal credit) { this.credit = credit; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getAccountOrder() { return accountOrder; }
    public void setAccountOrder(String accountOrder) { this.accountOrder = accountOrder; }

    public String getStatementType() { return statementType; }
    public void setStatementType(String statementType) { this.statementType = statementType; }

    public String getCommentText() { return commentText; }
    public void setCommentText(String commentText) { this.commentText = commentText; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
