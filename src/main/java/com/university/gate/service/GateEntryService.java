package com.university.gate.service;

import com.university.gate.model.GateEntry;
import com.university.gate.model.Student;
import com.university.gate.repository.GateEntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GateEntryService {

    private final GateEntryRepository gateEntryRepository;

    public GateEntryService(GateEntryRepository gateEntryRepository) {
        this.gateEntryRepository = gateEntryRepository;
    }

    public GateEntry registerEntry(Student student) {
        GateEntry entry = new GateEntry(student, LocalDateTime.now());
        return gateEntryRepository.save(entry);
    }

    public List<GateEntry> getAllEntries() {
        return gateEntryRepository.findAllByOrderByEntryTimeDesc();
    }
}




