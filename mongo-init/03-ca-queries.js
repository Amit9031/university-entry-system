/**
 * ============================================================================
 * University Gate Entry System - CA Demonstration & Analytical Queries
 * ============================================================================
 * Database : university_gate_db
 * Purpose  : 10 comprehensive queries demonstrating CRUD, indexing,
 *            aggregation pipelines, multi-collection $lookup, and schema
 *            validation for Continuous Assessment (CA) evaluation & viva.
 *
 * Execution: mongosh "mongodb://localhost:27017/university_gate_db" 03-ca-queries.js
 * ============================================================================
 */

db = db.getSiblingDB("university_gate_db");

print("\n==================================================================");
print("📊 EXECUTING CA DEMONSTRATION & ANALYTICAL QUERIES (mongosh)");
print("==================================================================");

// ----------------------------------------------------------------------------
// QUERY 1: Basic Read & Projection with Sorting
// Purpose: List all active registered students sorted by Department and Name.
// ----------------------------------------------------------------------------
print("\n--- [Query 1] All Active Students (Sorted by Department, Name) ---");
const q1 = db.students.find(
  { status: "ACTIVE" },
  { _id: 0, registrationNumber: 1, name: 1, department: 1, phoneNumber: 1, hostelResident: 1 }
).sort({ department: 1, name: 1 }).toArray();

printjson(q1);

// ----------------------------------------------------------------------------
// QUERY 2: Exact Match Search with Index Utilization (Student Profile)
// Purpose: Fetch full student record by unique Registration Number.
// ----------------------------------------------------------------------------
print("\n--- [Query 2] Find Student Record by Registration Number (Indexed) ---");
const targetRegNo = "12104501";
const q2 = db.students.findOne({ registrationNumber: targetRegNo });
print(`Student Details for Reg No: ${targetRegNo}`);
printjson(q2);

// ----------------------------------------------------------------------------
// QUERY 3: Live Security Gate Dashboard Feed
// Purpose: Replicates the Security Guard PC Dashboard - latest 5 gate entries.
// ----------------------------------------------------------------------------
print("\n--- [Query 3] Real-Time Live Security Dashboard (Latest 5 Gate Events) ---");
const q3 = db.gate_entries.find(
  {},
  { _id: 0, registrationNumber: 1, studentName: 1, gateName: 1, direction: 1, status: 1, entryTime: 1 }
).sort({ entryTime: -1 }).limit(5).toArray();

printjson(q3);

// ----------------------------------------------------------------------------
// QUERY 4: Aggregation Pipeline - Gate Traffic Distribution
// Purpose: Count total entries/exits processed at each campus gate.
// Demonstrates: $group, $sort, $project
// ----------------------------------------------------------------------------
print("\n--- [Query 4] Aggregation: Traffic Volume by Gate ---");
const q4 = db.gate_entries.aggregate([
  {
    $group: {
      _id: { gateId: "$gateId", gateName: "$gateName" },
      totalTraffic: { $sum: 1 },
      grantedEntries: {
        $sum: { $cond: [{ $eq: ["$status", "GRANTED"] }, 1, 0] }
      },
      deniedAttempts: {
        $sum: { $cond: [{ $eq: ["$status", "DENIED"] }, 1, 0] }
      }
    }
  },
  {
    $project: {
      _id: 0,
      gateId: "$_id.gateId",
      gateName: "$_id.gateName",
      totalTraffic: 1,
      grantedEntries: 1,
      deniedAttempts: 1
    }
  },
  { $sort: { totalTraffic: -1 } }
]).toArray();

printjson(q4);

// ----------------------------------------------------------------------------
// QUERY 5: Aggregation Pipeline - Peak Gate Traffic Hours
// Purpose: Analyze busiest times of day to allocate security personnel.
// Demonstrates: Date extraction ($hour), $group, $sort
// ----------------------------------------------------------------------------
print("\n--- [Query 5] Aggregation: Hourly Traffic Analysis ---");
const q5 = db.gate_entries.aggregate([
  {
    $project: {
      hourOfDay: { $hour: "$entryTime" },
      direction: 1
    }
  },
  {
    $group: {
      _id: "$hourOfDay",
      eventCount: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      hour: { $concat: [{ $toString: "$_id" }, ":00 hrs"] },
      totalEvents: "$eventCount"
    }
  },
  { $sort: { totalEvents: -1 } }
]).toArray();

printjson(q5);

// ----------------------------------------------------------------------------
// QUERY 6: Multi-Collection Join with $lookup
// Purpose: Join gate_entries with students collection to determine
//          entry frequency broken down by Student Department.
// Demonstrates: $lookup, $unwind, $group, $sort
// ----------------------------------------------------------------------------
print("\n--- [Query 6] Aggregation with $lookup: Department-wise Entry Breakdown ---");
const q6 = db.gate_entries.aggregate([
  {
    $lookup: {
      from: "students",
      localField: "registrationNumber",
      foreignField: "registrationNumber",
      as: "studentInfo"
    }
  },
  { $unwind: "$studentInfo" },
  {
    $group: {
      _id: "$studentInfo.department",
      totalGatePasses: { $sum: 1 },
      uniqueStudents: { $addToSet: "$registrationNumber" }
    }
  },
  {
    $project: {
      _id: 0,
      department: "$_id",
      totalGatePasses: 1,
      uniqueStudentCount: { $size: "$uniqueStudents" }
    }
  },
  { $sort: { totalGatePasses: -1 } }
]).toArray();

printjson(q6);

// ----------------------------------------------------------------------------
// QUERY 7: Security Audit - Denied & Flagged Entry Logs
// Purpose: Generate a compliance report of all suspicious or blocked events.
// ----------------------------------------------------------------------------
print("\n--- [Query 7] Security Audit: Blocked / Flagged Incidents ---");
const q7 = db.gate_entries.find(
  { status: { $in: ["DENIED", "FLAGGED"] } },
  {
    _id: 0,
    entryTime: 1,
    registrationNumber: 1,
    studentName: 1,
    gateName: 1,
    status: 1,
    notes: 1,
    verifiedBy: 1
  }
).sort({ entryTime: -1 }).toArray();

printjson(q7);

// ----------------------------------------------------------------------------
// QUERY 8: Text Search Index Query
// Purpose: Full-text search for students by keywords in name or department.
// Demonstrates: $text, $search
// ----------------------------------------------------------------------------
print("\n--- [Query 8] Text Search: Find Engineering Students matching 'Computer' ---");
const q8 = db.students.find(
  { $text: { $search: "Computer" } },
  { score: { $meta: "textScore" }, name: 1, department: 1, registrationNumber: 1, _id: 0 }
).sort({ score: { $meta: "textScore" } }).toArray();

printjson(q8);

// ----------------------------------------------------------------------------
// QUERY 9: Update Operation - Resolve Security Alert
// Purpose: Demonstrates updateOne with atomic operators ($set, $currentDate).
// ----------------------------------------------------------------------------
print("\n--- [Query 9] Update Operation: Mark Security Alert Resolved ---");
const updateResult = db.security_alerts.updateOne(
  { resolved: false, alertType: "SUSPENDED_STUDENT_ENTRY" },
  {
    $set: {
      resolved: true,
      resolvedBy: "CHIEF-SECURITY-OFFICER",
      resolutionNotes: "Disciplinary committee notified. Physical escort provided."
    },
    $currentDate: { resolvedAt: true }
  }
);
print(`Matched: ${updateResult.matchedCount}, Modified: ${updateResult.modifiedCount}`);

// ----------------------------------------------------------------------------
// QUERY 10: Schema Validation Enforcement Demonstration ($jsonSchema)
// Purpose: Intentional failure test proving MongoDB rejects invalid documents
//          that do not conform to the collection's JSON schema validator.
// ----------------------------------------------------------------------------
print("\n--- [Query 10] Schema Validation Test: Attempting Invalid Student Insert ---");
try {
  db.students.insertOne({
    name: "X", // Error: minLength is 2
    registrationNumber: "invalid_format!", // Error: must match ^[A-Z0-9]{6,15}$
    phoneNumber: "123", // Error: invalid phone pattern
    department: "Invalid Department Not In Enum", // Error: not in enum list
    status: "UNKNOWN_STATUS" // Error: not in enum list
  });
  print("❌ ERROR: Invalid document was unexpectedly accepted!");
} catch (err) {
  print("✅ SUCCESS: MongoDB Schema Validator rejected invalid document as expected!");
  print(`Error Details Code: ${err.code} (${err.codeName || 'DocumentValidationFailure'})`);
}

print("\n==================================================================");
print("🎉 All 10 CA Demonstration Queries Executed Successfully!");
print("==================================================================\n");
