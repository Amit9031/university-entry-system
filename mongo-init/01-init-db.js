/**
 * ============================================================================
 * University Gate Entry System - MongoDB Initialization Script (mongosh)
 * ============================================================================
 * Database : university_gate_db
 * Purpose  : CA (Continuous Assessment) Database Setup, Collections,
 *            Schema Validation ($jsonSchema), and Index Optimization.
 *
 * Compatible with MongoDB 6.0+, 7.0+, and mongosh.
 * ============================================================================
 */

print("==================================================================");
print("🚀 Initializing University Gate Entry System Database in mongosh...");
print("==================================================================");

// Switch to university_gate_db database
db = db.getSiblingDB("university_gate_db");

// ----------------------------------------------------------------------------
// 1. Create Application Database User (RBAC)
// ----------------------------------------------------------------------------
print("\n🔐 1. Configuring Database Application User...");
try {
  db.createUser({
    user: "gate_app_user",
    pwd: "GateAppSecurePassword123!",
    roles: [
      { role: "readWrite", db: "university_gate_db" },
      { role: "dbAdmin", db: "university_gate_db" }
    ]
  });
  print("✅ Created application user: 'gate_app_user'");
} catch (e) {
  if (e.code === 51003 || e.message.includes("already exists")) {
    print("ℹ️ User 'gate_app_user' already exists. Skipping creation.");
  } else {
    print("⚠️ User creation note: " + e.message);
  }
}

// ----------------------------------------------------------------------------
// 2. Collection Creation with JSON Schema Validation ($jsonSchema)
// ----------------------------------------------------------------------------
print("\n📋 2. Creating Collections with Strict Schema Validation...");

// Helper function to safely create collection with validator
function createOrUpdateCollection(name, validatorRule) {
  const existingCollections = db.getCollectionNames();
  if (existingCollections.includes(name)) {
    print(`ℹ️ Updating validator for existing collection '${name}'...`);
    db.runCommand({
      collMod: name,
      validator: validatorRule,
      validationLevel: "moderate",
      validationAction: "error"
    });
  } else {
    print(`✨ Creating collection '${name}' with $jsonSchema validation...`);
    db.createCollection(name, {
      validator: validatorRule,
      validationLevel: "strict",
      validationAction: "error"
    });
  }
}

// ----------------------------------------------------------------------------
// 2.1 Collection: students
// ----------------------------------------------------------------------------
const studentValidator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "registrationNumber", "phoneNumber", "department", "status"],
    properties: {
      name: {
        bsonType: "string",
        minLength: 2,
        maxLength: 100,
        description: "Student's full name (required, 2-100 characters)"
      },
      registrationNumber: {
        bsonType: "string",
        pattern: "^[A-Z0-9]{6,15}$",
        description: "Unique University Registration / Roll Number (required, 6-15 alphanumeric)"
      },
      phoneNumber: {
        bsonType: "string",
        pattern: "^[0-9+ -]{10,15}$",
        description: "Contact phone number (required, 10-15 digits/symbols)"
      },
      department: {
        bsonType: "string",
        enum: [
          "Computer Science & Engineering",
          "Information Technology",
          "Electronics & Communication",
          "Mechanical Engineering",
          "Civil Engineering",
          "Biotechnology",
          "Management Studies (MBA)",
          "Applied Mathematics",
          "Physics",
          "Law"
        ],
        description: "Academic department of enrollment (required, predefined enum)"
      },
      email: {
        bsonType: "string",
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        description: "University/personal email address (valid email format)"
      },
      cardId: {
        bsonType: "string",
        description: "RFID / NFC Student Smart ID card identifier"
      },
      bloodGroup: {
        bsonType: "string",
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "UNKNOWN"],
        description: "Emergency medical blood group"
      },
      status: {
        bsonType: "string",
        enum: ["ACTIVE", "SUSPENDED", "ALUMNI", "LEAVE_OF_ABSENCE"],
        description: "Current university enrollment standing (required)"
      },
      hostelResident: {
        bsonType: "bool",
        description: "True if living in campus hostel, false for day scholars"
      },
      createdAt: {
        bsonType: "date",
        description: "Timestamp when record was registered"
      },
      updatedAt: {
        bsonType: "date",
        description: "Timestamp when record was last updated"
      }
    }
  }
};
createOrUpdateCollection("students", studentValidator);

// ----------------------------------------------------------------------------
// 2.2 Collection: gates
// ----------------------------------------------------------------------------
const gateValidator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["gateId", "gateName", "location", "status"],
    properties: {
      gateId: {
        bsonType: "string",
        pattern: "^GATE-[0-9]{2}$",
        description: "Standard Gate identifier (e.g. GATE-01, GATE-02)"
      },
      gateName: {
        bsonType: "string",
        minLength: 3,
        maxLength: 80,
        description: "Human-readable Gate name"
      },
      location: {
        bsonType: "string",
        description: "Physical location within campus perimeter"
      },
      gateType: {
        bsonType: "string",
        enum: ["MAIN_PEDESTRIAN", "VEHICULAR", "HOSTEL", "LIBRARY", "SERVICE"],
        description: "Operational category of gate"
      },
      status: {
        bsonType: "string",
        enum: ["OPERATIONAL", "MAINTENANCE", "CLOSED", "EMERGENCY_ONLY"],
        description: "Current status of gate barrier"
      },
      securityGuardInCharge: {
        bsonType: "string",
        description: "Name or Officer ID of on-duty security guard"
      }
    }
  }
};
createOrUpdateCollection("gates", gateValidator);

// ----------------------------------------------------------------------------
// 2.3 Collection: gate_entries
// ----------------------------------------------------------------------------
const gateEntryValidator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["registrationNumber", "studentName", "gateId", "direction", "status", "entryTime"],
    properties: {
      studentId: {
        bsonType: ["objectId", "null"],
        description: "Reference to students._id document (optional)"
      },
      registrationNumber: {
        bsonType: "string",
        description: "Student's Registration Number at scan time (required)"
      },
      studentName: {
        bsonType: "string",
        description: "Snapshot of student name (required)"
      },
      phoneNumber: {
        bsonType: "string",
        description: "Snapshot of student phone number"
      },
      department: {
        bsonType: "string",
        description: "Snapshot of department"
      },
      gateId: {
        bsonType: "string",
        description: "ID of gate scanned at (required)"
      },
      gateName: {
        bsonType: "string",
        description: "Friendly name of the gate"
      },
      direction: {
        bsonType: "string",
        enum: ["IN", "OUT"],
        description: "Movement direction: campus entry (IN) or exit (OUT) (required)"
      },
      status: {
        bsonType: "string",
        enum: ["GRANTED", "DENIED", "FLAGGED"],
        description: "Gate access decision result (required)"
      },
      entryTime: {
        bsonType: "date",
        description: "Exact timestamp of gate scan/event (required)"
      },
      verificationMethod: {
        bsonType: "string",
        enum: ["QR_SCAN", "RFID_CARD", "MANUAL_SECURITY", "FACIAL_RECOGNITION"],
        description: "Method used to verify identity"
      },
      verifiedBy: {
        bsonType: "string",
        description: "System token or guard ID who approved entry"
      },
      notes: {
        bsonType: "string",
        description: "Reason if denied or optional guard comment"
      }
    }
  }
};
createOrUpdateCollection("gate_entries", gateEntryValidator);

// ----------------------------------------------------------------------------
// 2.4 Collection: security_alerts
// ----------------------------------------------------------------------------
const alertValidator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["alertType", "severity", "timestamp", "description", "resolved"],
    properties: {
      alertType: {
        bsonType: "string",
        enum: [
          "UNAUTHORIZED_ATTEMPT",
          "SUSPENDED_STUDENT_ENTRY",
          "AFTER_HOURS_HOSTEL_EXIT",
          "DUPLICATE_CONCURRENT_ENTRY",
          "DEVICE_TAMPERING"
        ],
        description: "Category of triggered security rule"
      },
      severity: {
        bsonType: "string",
        enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
        description: "Threat level of the event"
      },
      registrationNumber: {
        bsonType: "string",
        description: "Associated student registration number if applicable"
      },
      gateId: {
        bsonType: "string",
        description: "Gate where incident occurred"
      },
      timestamp: {
        bsonType: "date",
        description: "Event occurrence timestamp"
      },
      description: {
        bsonType: "string",
        description: "Detailed report of trigger"
      },
      resolved: {
        bsonType: "bool",
        description: "True if security staff resolved this alert"
      },
      resolvedBy: {
        bsonType: "string",
        description: "Officer ID who resolved alert"
      }
    }
  }
};
createOrUpdateCollection("security_alerts", alertValidator);

// ----------------------------------------------------------------------------
// 3. Index Creation for High Performance & Query Optimization
// ----------------------------------------------------------------------------
print("\n⚡ 3. Building Indexes...");

// Students Indexes
db.students.createIndex(
  { registrationNumber: 1 },
  { unique: true, name: "idx_unique_registration_number" }
);
db.students.createIndex(
  { name: "text", department: "text" },
  { name: "idx_text_student_search" }
);
db.students.createIndex(
  { department: 1, status: 1 },
  { name: "idx_department_status" }
);
db.students.createIndex(
  { phoneNumber: 1 },
  { name: "idx_phone_number" }
);

// Gates Indexes
db.gates.createIndex(
  { gateId: 1 },
  { unique: true, name: "idx_unique_gate_id" }
);

// Gate Entries Indexes (Optimized for Real-time Dashboard & Historical Analytics)
db.gate_entries.createIndex(
  { entryTime: -1 },
  { name: "idx_recent_entries_desc" }
);
db.gate_entries.createIndex(
  { registrationNumber: 1, entryTime: -1 },
  { name: "idx_student_entry_history" }
);
db.gate_entries.createIndex(
  { gateId: 1, entryTime: -1 },
  { name: "idx_gate_entry_timeline" }
);
db.gate_entries.createIndex(
  { status: 1, entryTime: -1 },
  { name: "idx_status_timeline" }
);

// Security Alerts Indexes (with 90-day TTL index for automated data retention)
db.security_alerts.createIndex(
  { timestamp: -1 },
  { name: "idx_alert_timeline" }
);
db.security_alerts.createIndex(
  { severity: 1, resolved: 1 },
  { name: "idx_unresolved_severity" }
);
db.security_alerts.createIndex(
  { timestamp: 1 },
  { expireAfterSeconds: 7776000, name: "idx_ttl_90_days" } // 90 days = 90*24*3600s
);

print("✅ All collections, schema validators, and indexes created successfully!");
