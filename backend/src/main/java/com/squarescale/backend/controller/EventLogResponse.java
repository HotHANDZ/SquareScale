package com.squarescale.backend.controller;

import java.time.LocalDateTime;

/**
 * Event log row for API: who performed the action (logged-in user), no before/after payloads.
 */
public record EventLogResponse(
        Long id,
        String entityType,
        Long entityId,
        String action,
        Long performedByUserId,
        String performedByUsername,
        LocalDateTime createdAt
) {}
