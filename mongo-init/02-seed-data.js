/**
 * ============================================================================
 * University Gate Entry System - Seed Data Script (mongosh)
 * ============================================================================
 * Database : university_gate_db
 * Purpose  : Populates collections with realistic campus data for CA
 *            testing, demonstrations, and viva queries.
 * ============================================================================
 */

print("\n==================================================================");
print("🌱 Seeding Sample Data for University Gate Entry System...");
print("==================================================================");

db = db.getSiblingDB("university_gate_db");

const now = new Date();
const hoursAgo = (h) => new Date(now.getTime() - h * 60 * 60 * 1000);
const daysAgo = (d, h = 0) => new Date(now.getTime() - (d * 24 + h) * 60 * 60 * 1000);

// ----------------------------------------------------------------------------
// 1. Seed Gates
// ----------------------------------------------------------------------------
print("🚪 1. Seeding Campus Gates...");
db.gates.deleteMany({});

const sampleGates = [
  {
    gateId: "GATE-01",
    gateName: "Main University Entrance Gate",
    location: "North Perimeter Boulevard",
    gateType: "MAIN_PEDESTRIAN",
    status: "OPERATIONAL",
    securityGuardInCharge: "Officer Rajesh Kumar (ID: SEC-101)"
  },
  {
    gateId: "GATE-02",
    gateName: "Engineering & Technology Block Gate",
    location: "East Academic Wing",
    gateType: "MAIN_PEDESTRIAN",
    status: "OPERATIONAL",
    securityGuardInCharge: "Officer Vikram Singh (ID: SEC-104)"
  },
  {
    gateId: "GATE-03",
    gateName: "Central Library & Research Gate",
    location: "Central Campus Quad",
    gateType: "LIBRARY",
    status: "OPERATIONAL",
    securityGuardInCharge: "Officer Sunita Devi (ID: SEC-108)"
  },
  {
    gateId: "GATE-04",
    gateName: "University Hostels South Gate",
    location: "South Residential Zone",
    gateType: "HOSTEL",
    status: "OPERATIONAL",
    securityGuardInCharge: "Officer Manoj Sharma (ID: SEC-112)"
  },
  {
    gateId: "GATE-05",
    gateName: "North Campus Vehicular Entry",
    location: "Outer Ring Road Entrance",
    gateType: "VEHICULAR",
    status: "MAINTENANCE",
    securityGuardInCharge: "Officer Pradeep Verma (ID: SEC-115)"
  }
];

const gatesResult = db.gates.insertMany(sampleGates);
print(`✅ Inserted ${gatesResult.insertedCount} gates.`);

// ----------------------------------------------------------------------------
// 2. Seed Students
// ----------------------------------------------------------------------------
print("\n🎓 2. Seeding Student Directory...");
db.students.deleteMany({});

const sampleStudents = [
  {
    name: "Amit Ranjan",
    registrationNumber: "12104501",
    phoneNumber: "+91 9876543210",
    department: "Computer Science & Engineering",
    email: "amit.ranjan@univ.ac.in",
    cardId: "RFID-CS-001",
    bloodGroup: "O+",
    status: "ACTIVE",
    hostelResident: true,
    createdAt: daysAgo(120),
    updatedAt: daysAgo(5)
  },
  {
    name: "Priya Sharma",
    registrationNumber: "12104502",
    phoneNumber: "+91 9876543211",
    department: "Computer Science & Engineering",
    email: "priya.sharma@univ.ac.in",
    cardId: "RFID-CS-002",
    bloodGroup: "B+",
    status: "ACTIVE",
    hostelResident: false,
    createdAt: daysAgo(120),
    updatedAt: daysAgo(12)
  },
  {
    name: "Rahul Verma",
    registrationNumber: "12104503",
    phoneNumber: "+91 9876543212",
    department: "Information Technology",
    email: "rahul.verma@univ.ac.in",
    cardId: "RFID-IT-003",
    bloodGroup: "A+",
    status: "ACTIVE",
    hostelResident: true,
    createdAt: daysAgo(115),
    updatedAt: daysAgo(2)
  },
  {
    name: "Sneha Patel",
    registrationNumber: "12104504",
    phoneNumber: "+91 9876543213",
    department: "Electronics & Communication",
    email: "sneha.patel@univ.ac.in",
    cardId: "RFID-EC-004",
    bloodGroup: "AB+",
    status: "ACTIVE",
    hostelResident: false,
    createdAt: daysAgo(100),
    updatedAt: daysAgo(20)
  },
  {
    name: "Aman Gupta",
    registrationNumber: "12104505",
    phoneNumber: "+91 9876543214",
    department: "Mechanical Engineering",
    email: "aman.gupta@univ.ac.in",
    cardId: "RFID-ME-005",
    bloodGroup: "O-",
    status: "SUSPENDED", // For testing security alert rules
    hostelResident: false,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(1)
  },
  {
    name: "Ananya Iyer",
    registrationNumber: "12104506",
    phoneNumber: "+91 9876543215",
    department: "Biotechnology",
    email: "ananya.iyer@univ.ac.in",
    cardId: "RFID-BT-006",
    bloodGroup: "B-",
    status: "ACTIVE",
    hostelResident: true,
    createdAt: daysAgo(85),
    updatedAt: daysAgo(10)
  },
  {
    name: "Rohan Deshmukh",
    registrationNumber: "12104507",
    phoneNumber: "+91 9876543216",
    department: "Civil Engineering",
    email: "rohan.deshmukh@univ.ac.in",
    cardId: "RFID-CE-007",
    bloodGroup: "A-",
    status: "ACTIVE",
    hostelResident: false,
    createdAt: daysAgo(75),
    updatedAt: daysAgo(15)
  },
  {
    name: "Deepika Nair",
    registrationNumber: "12104508",
    phoneNumber: "+91 9876543217",
    department: "Management Studies (MBA)",
    email: "deepika.nair@univ.ac.in",
    cardId: "RFID-MBA-008",
    bloodGroup: "O+",
    status: "ACTIVE",
    hostelResident: true,
    createdAt: daysAgo(60),
    updatedAt: daysAgo(3)
  },
  {
    name: "Karan Malhotra",
    registrationNumber: "12104509",
    phoneNumber: "+91 9876543218",
    department: "Computer Science & Engineering",
    email: "karan.malhotra@univ.ac.in",
    cardId: "RFID-CS-009",
    bloodGroup: "AB-",
    status: "ACTIVE",
    hostelResident: false,
    createdAt: daysAgo(50),
    updatedAt: daysAgo(1)
  },
  {
    name: "Meera Sen",
    registrationNumber: "12104510",
    phoneNumber: "+91 9876543219",
    department: "Physics",
    email: "meera.sen@univ.ac.in",
    cardId: "RFID-PH-010",
    bloodGroup: "B+",
    status: "ALUMNI",
    hostelResident: false,
    createdAt: daysAgo(400),
    updatedAt: daysAgo(100)
  }
];

const studentsResult = db.students.insertMany(sampleStudents);
print(`✅ Inserted ${studentsResult.insertedCount} student records.`);

// Create lookup map for student IDs
const studentMap = {};
db.students.find().forEach(s => {
  studentMap[s.registrationNumber] = s;
});

// ----------------------------------------------------------------------------
// 3. Seed Gate Entries (Realistic Entry / Exit Activity)
// ----------------------------------------------------------------------------
print("\n📝 3. Seeding Gate Entry Logs...");
db.gate_entries.deleteMany({});

const sampleEntries = [
  // Today's Activity - Morning
  {
    studentId: studentMap["12104501"]._id,
    registrationNumber: "12104501",
    studentName: "Amit Ranjan",
    phoneNumber: "+91 9876543210",
    department: "Computer Science & Engineering",
    gateId: "GATE-01",
    gateName: "Main University Entrance Gate",
    direction: "IN",
    status: "GRANTED",
    entryTime: hoursAgo(1),
    verificationMethod: "QR_SCAN",
    verifiedBy: "QR_AUTO_GATE01",
    notes: "Normal entry verified via mobile QR scan"
  },
  {
    studentId: studentMap["12104502"]._id,
    registrationNumber: "12104502",
    studentName: "Priya Sharma",
    phoneNumber: "+91 9876543211",
    department: "Computer Science & Engineering",
    gateId: "GATE-01",
    gateName: "Main University Entrance Gate",
    direction: "IN",
    status: "GRANTED",
    entryTime: hoursAgo(2),
    verificationMethod: "QR_SCAN",
    verifiedBy: "QR_AUTO_GATE01",
    notes: "Morning class entry"
  },
  {
    studentId: studentMap["12104503"]._id,
    registrationNumber: "12104503",
    studentName: "Rahul Verma",
    phoneNumber: "+91 9876543212",
    department: "Information Technology",
    gateId: "GATE-02",
    gateName: "Engineering & Technology Block Gate",
    direction: "IN",
    status: "GRANTED",
    entryTime: hoursAgo(3),
    verificationMethod: "RFID_CARD",
    verifiedBy: "SEC-104",
    notes: "RFID tap at engineering gate"
  },
  {
    studentId: studentMap["12104504"]._id,
    registrationNumber: "12104504",
    studentName: "Sneha Patel",
    phoneNumber: "+91 9876543213",
    department: "Electronics & Communication",
    gateId: "GATE-01",
    gateName: "Main University Entrance Gate",
    direction: "IN",
    status: "GRANTED",
    entryTime: hoursAgo(3.5),
    verificationMethod: "QR_SCAN",
    verifiedBy: "QR_AUTO_GATE01",
    notes: "Regular entry"
  },
  // Suspended student attempt (DENIED)
  {
    studentId: studentMap["12104505"]._id,
    registrationNumber: "12104505",
    studentName: "Aman Gupta",
    phoneNumber: "+91 9876543214",
    department: "Mechanical Engineering",
    gateId: "GATE-01",
    gateName: "Main University Entrance Gate",
    direction: "IN",
    status: "DENIED",
    entryTime: hoursAgo(4),
    verificationMethod: "QR_SCAN",
    verifiedBy: "SEC-101",
    notes: "Entry blocked: Student account status is SUSPENDED pending disciplinary review"
  },
  {
    studentId: studentMap["12104506"]._id,
    registrationNumber: "12104506",
    studentName: "Ananya Iyer",
    phoneNumber: "+91 9876543215",
    department: "Biotechnology",
    gateId: "GATE-03",
    gateName: "Central Library & Research Gate",
    direction: "IN",
    status: "GRANTED",
    entryTime: hoursAgo(4.5),
    verificationMethod: "QR_SCAN",
    verifiedBy: "QR_AUTO_GATE03",
    notes: "Library research visit"
  },
  {
    studentId: studentMap["12104508"]._id,
    registrationNumber: "12104508",
    studentName: "Deepika Nair",
    phoneNumber: "+91 9876543217",
    department: "Management Studies (MBA)",
    gateId: "GATE-01",
    gateName: "Main University Entrance Gate",
    direction: "IN",
    status: "GRANTED",
    entryTime: hoursAgo(5),
    verificationMethod: "QR_SCAN",
    verifiedBy: "QR_AUTO_GATE01",
    notes: "Guest lecture attendance"
  },

  // Yesterday's Activity
  {
    studentId: studentMap["12104501"]._id,
    registrationNumber: "12104501",
    studentName: "Amit Ranjan",
    phoneNumber: "+91 9876543210",
    department: "Computer Science & Engineering",
    gateId: "GATE-04",
    gateName: "University Hostels South Gate",
    direction: "OUT",
    status: "GRANTED",
    entryTime: daysAgo(1, 4),
    verificationMethod: "QR_SCAN",
    verifiedBy: "SEC-112",
    notes: "Hostel day outing pass"
  },
  {
    studentId: studentMap["12104501"]._id,
    registrationNumber: "12104501",
    studentName: "Amit Ranjan",
    phoneNumber: "+91 9876543210",
    department: "Computer Science & Engineering",
    gateId: "GATE-04",
    gateName: "University Hostels South Gate",
    direction: "IN",
    status: "GRANTED",
    entryTime: daysAgo(1, 1),
    verificationMethod: "QR_SCAN",
    verifiedBy: "SEC-112",
    notes: "Hostel evening return before curfew"
  },
  {
    studentId: studentMap["12104507"]._id,
    registrationNumber: "12104507",
    studentName: "Rohan Deshmukh",
    phoneNumber: "+91 9876543216",
    department: "Civil Engineering",
    gateId: "GATE-02",
    gateName: "Engineering & Technology Block Gate",
    direction: "IN",
    status: "GRANTED",
    entryTime: daysAgo(1, 6),
    verificationMethod: "RFID_CARD",
    verifiedBy: "SEC-104",
    notes: "Survey lab session"
  },
  {
    studentId: studentMap["12104509"]._id,
    registrationNumber: "12104509",
    studentName: "Karan Malhotra",
    phoneNumber: "+91 9876543218",
    department: "Computer Science & Engineering",
    gateId: "GATE-01",
    gateName: "Main University Entrance Gate",
    direction: "IN",
    status: "GRANTED",
    entryTime: daysAgo(1, 7),
    verificationMethod: "QR_SCAN",
    verifiedBy: "QR_AUTO_GATE01",
    notes: "Regular entry"
  },
  {
    studentId: studentMap["12104509"]._id,
    registrationNumber: "12104509",
    studentName: "Karan Malhotra",
    phoneNumber: "+91 9876543218",
    department: "Computer Science & Engineering",
    gateId: "GATE-01",
    gateName: "Main University Entrance Gate",
    direction: "OUT",
    status: "GRANTED",
    entryTime: daysAgo(1, 2),
    verificationMethod: "QR_SCAN",
    verifiedBy: "QR_AUTO_GATE01",
    notes: "Campus exit after lab"
  },

  // 2 Days Ago Activity
  {
    studentId: studentMap["12104502"]._id,
    registrationNumber: "12104502",
    studentName: "Priya Sharma",
    phoneNumber: "+91 9876543211",
    department: "Computer Science & Engineering",
    gateId: "GATE-03",
    gateName: "Central Library & Research Gate",
    direction: "IN",
    status: "GRANTED",
    entryTime: daysAgo(2, 5),
    verificationMethod: "QR_SCAN",
    verifiedBy: "QR_AUTO_GATE03",
    notes: "Exam revision"
  },
  {
    studentId: studentMap["12104503"]._id,
    registrationNumber: "12104503",
    studentName: "Rahul Verma",
    phoneNumber: "+91 9876543212",
    department: "Information Technology",
    gateId: "GATE-01",
    gateName: "Main University Entrance Gate",
    direction: "IN",
    status: "GRANTED",
    entryTime: daysAgo(2, 6),
    verificationMethod: "QR_SCAN",
    verifiedBy: "QR_AUTO_GATE01",
    notes: "Regular entry"
  },
  {
    studentId: studentMap["12104506"]._id,
    registrationNumber: "12104506",
    studentName: "Ananya Iyer",
    phoneNumber: "+91 9876543215",
    department: "Biotechnology",
    gateId: "GATE-02",
    gateName: "Engineering & Technology Block Gate",
    direction: "IN",
    status: "GRANTED",
    entryTime: daysAgo(2, 8),
    verificationMethod: "RFID_CARD",
    verifiedBy: "SEC-104",
    notes: "Biotech laboratory access"
  },
  // Suspended attempt 2 days ago (FLAGGED)
  {
    studentId: studentMap["12104505"]._id,
    registrationNumber: "12104505",
    studentName: "Aman Gupta",
    phoneNumber: "+91 9876543214",
    department: "Mechanical Engineering",
    gateId: "GATE-02",
    gateName: "Engineering & Technology Block Gate",
    direction: "IN",
    status: "FLAGGED",
    entryTime: daysAgo(2, 3),
    verificationMethod: "RFID_CARD",
    verifiedBy: "SEC-104",
    notes: "Suspicious attempt: Expired ID card used at secondary gate"
  }
];

const entriesResult = db.gate_entries.insertMany(sampleEntries);
print(`✅ Inserted ${entriesResult.insertedCount} gate entry records.`);

// ----------------------------------------------------------------------------
// 4. Seed Security Alerts
// ----------------------------------------------------------------------------
print("\n🚨 4. Seeding Security Audit Alerts...");
db.security_alerts.deleteMany({});

const sampleAlerts = [
  {
    alertType: "SUSPENDED_STUDENT_ENTRY",
    severity: "HIGH",
    registrationNumber: "12104505",
    gateId: "GATE-01",
    timestamp: hoursAgo(4),
    description: "Suspended student Aman Gupta attempted entry at Main University Entrance Gate. Access blocked.",
    resolved: false
  },
  {
    alertType: "UNAUTHORIZED_ATTEMPT",
    severity: "MEDIUM",
    registrationNumber: "12104505",
    gateId: "GATE-02",
    timestamp: daysAgo(2, 3),
    description: "Repeated scan attempt with deactivated RFID card at East Wing Gate.",
    resolved: true,
    resolvedBy: "SEC-OFFICER-LEAD"
  }
];

const alertsResult = db.security_alerts.insertMany(sampleAlerts);
print(`✅ Inserted ${alertsResult.insertedCount} security alerts.`);

print("\n🎉 Sample data seeding completed successfully!");
