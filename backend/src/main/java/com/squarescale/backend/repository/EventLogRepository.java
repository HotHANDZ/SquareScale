package com.squarescale.backend.repository;

import com.squarescale.backend.entity.EventLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventLogRepository extends JpaRepository<EventLog, Long> {

    List<EventLog> findAllByOrderByCreatedAtDesc();
}
