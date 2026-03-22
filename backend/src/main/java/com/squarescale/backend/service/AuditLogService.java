package com.squarescale.backend.service;

import com.squarescale.backend.entity.Account;
import com.squarescale.backend.entity.EventLog;
import com.squarescale.backend.repository.EventLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Persists event_log rows: which logged-in user performed each account action.
 */
@Service
public class AuditLogService {

    public static final String ENTITY_ACCOUNT = "ACCOUNT";
    public static final String ACTION_CREATE = "CREATE";
    public static final String ACTION_UPDATE = "UPDATE";
    public static final String ACTION_DEACTIVATE = "DEACTIVATE";

    private final EventLogRepository eventLogRepo;

    public AuditLogService(EventLogRepository eventLogRepo) {
        this.eventLogRepo = eventLogRepo;
    }

    public void logAccountCreate(Long actingUserId, Account account) {
        persist(ENTITY_ACCOUNT, account.getId(), ACTION_CREATE, actingUserId);
    }

    public void logAccountUpdate(Long actingUserId, Account account) {
        persist(ENTITY_ACCOUNT, account.getId(), ACTION_UPDATE, actingUserId);
    }

    public void logAccountDeactivate(Long actingUserId, Account account) {
        persist(ENTITY_ACCOUNT, account.getId(), ACTION_DEACTIVATE, actingUserId);
    }

    private void persist(String entityType, Long entityId, String action, Long userId) {
        if (userId == null) {
            return;
        }
        EventLog e = new EventLog();
        e.setEntityType(entityType);
        e.setEntityId(entityId);
        e.setAction(action);
        e.setUserId(userId);
        e.setCreatedAt(LocalDateTime.now());
        e.setBeforeImage(null);
        e.setAfterImage(null);
        eventLogRepo.save(e);
    }
}
