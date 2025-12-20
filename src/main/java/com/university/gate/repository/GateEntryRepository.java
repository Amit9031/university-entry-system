package com.university.gate.repository;

import com.university.gate.model.GateEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GateEntryRepository extends JpaRepository<GateEntry, Long> {

    List<GateEntry> findAllByOrderByEntryTimeDesc();
}



