package com.squarescale.backend.controller;

import com.squarescale.backend.entity.EventLog;
import com.squarescale.backend.entity.User;
import com.squarescale.backend.repository.EventLogRepository;
import com.squarescale.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/event-logs")
public class EventLogController {

    private final EventLogRepository eventLogRepo;
    private final UserRepository userRepo;

    public EventLogController(EventLogRepository eventLogRepo, UserRepository userRepo) {
        this.eventLogRepo = eventLogRepo;
        this.userRepo = userRepo;
    }

    @GetMapping
    public List<EventLogResponse> listAll() {
        return eventLogRepo.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    private EventLogResponse toResponse(EventLog e) {
        String username = userRepo.findById(e.getUserId())
                .map(User::getUsername)
                .orElse("—");
        return new EventLogResponse(
                e.getId(),
                e.getEntityType(),
                e.getEntityId(),
                e.getAction(),
                e.getUserId(),
                username,
                e.getCreatedAt()
        );
    }
}
