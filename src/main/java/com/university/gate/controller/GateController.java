package com.university.gate.controller;

import com.university.gate.model.GateEntry;
import com.university.gate.model.Student;
import com.university.gate.repository.StudentRepository;
import com.university.gate.service.GateEntryService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

@Controller
public class GateController {

    private final StudentRepository studentRepository;
    private final GateEntryService gateEntryService;

    public GateController(StudentRepository studentRepository, GateEntryService gateEntryService) {
        this.studentRepository = studentRepository;
        this.gateEntryService = gateEntryService;
    }

    /**
     * Landing page for security / laptop screen to see live entries.
     */
    @GetMapping("/")
    public String laptopView(Model model) {
        List<GateEntry> entries = gateEntryService.getAllEntries();
        model.addAttribute("entries", entries);
        return "laptop";
    }

    /**
     * Simulate QR scan URL on student's phone.
     * Example QR content: http://localhost:8080/qr/1
     */
    @GetMapping("/qr/{studentId}")
    public String qrScanPage(@PathVariable("studentId") Long studentId, Model model) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) {
            model.addAttribute("error", "Student not found for QR code.");
            return "phone-error";
        }

        model.addAttribute("student", studentOpt.get());
        return "phone-confirm";
    }

    /**
     * Handle Yes/No from phone confirmation page.
     */
    @PostMapping("/confirm-entry")
    public String confirmEntry(@RequestParam("studentId") Long studentId,
                               @RequestParam("decision") String decision,
                               Model model) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) {
            model.addAttribute("error", "Student not found for QR code.");
            return "phone-error";
        }

        Student student = studentOpt.get();

        if ("yes".equalsIgnoreCase(decision)) {
            GateEntry entry = gateEntryService.registerEntry(student);
            model.addAttribute("entry", entry);
            return "phone-success";
        } else {
            model.addAttribute("student", student);
            return "phone-denied";
        }
    }
}


