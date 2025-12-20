package com.university.gate.controller;

import com.university.gate.model.Student;
import com.university.gate.repository.StudentRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class StudentController {

    private final StudentRepository studentRepository;

    @Value("${app.base-url:}")
    private String configuredBaseUrl;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping("/students")
    public String listStudents(Model model, HttpServletRequest request) {
        List<Student> students = studentRepository.findAll();
        
        // Auto-detect base URL from request if not configured
        String baseUrl = configuredBaseUrl;
        if (baseUrl == null || baseUrl.isEmpty()) {
            String scheme = request.getScheme();
            String serverName = request.getServerName();
            int serverPort = request.getServerPort();
            String contextPath = request.getContextPath();
            
            if (serverPort == 80 || serverPort == 443) {
                baseUrl = scheme + "://" + serverName + contextPath;
            } else {
                baseUrl = scheme + "://" + serverName + ":" + serverPort + contextPath;
            }
        }
        
        model.addAttribute("students", students);
        model.addAttribute("baseUrl", baseUrl);
        return "students";
    }

    @PostMapping("/students")
    public String createStudent(@RequestParam("name") String name,
                                @RequestParam("registrationNumber") String registrationNumber,
                                @RequestParam("phoneNumber") String phoneNumber) {
        Student student = new Student(name, registrationNumber, phoneNumber);
        studentRepository.save(student);
        return "redirect:/students";
    }
}



