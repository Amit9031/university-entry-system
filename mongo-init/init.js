/**
 * ============================================================================
 * University Gate Entry System - Master mongosh Init Script
 * ============================================================================
 * Database : university_gate_db
 * Purpose  : Runs full initialization pipeline:
 *            1. Schema & Indexes (01-init-db.js)
 *            2. Sample Data Seeding (02-seed-data.js)
 *            3. Verification & Diagnostic Status Summary
 *
 * Usage:
 *   mongosh "mongodb://localhost:27017/university_gate_db" mongo-init/init.js
 * ============================================================================
 */

print("\n##################################################################");
print("#   UNIVERSITY GATE ENTRY SYSTEM - MONGODB INITIALIZATION        #");
print("##################################################################\n");

// Execute Schema & Index Setup
load("mongo-init/01-init-db.js");

// Execute Data Seeding
load("mongo-init/02-seed-data.js");

// Verification & Status Summary
print("\n==================================================================");
print("📊 DATABASE SUMMARY & DIAGNOSTICS");
print("==================================================================");

db = db.getSiblingDB("university_gate_db");

const collections = ["students", "gates", "gate_entries", "security_alerts"];

collections.forEach(collName => {
  const count = db[collName].countDocuments();
  const indexes = db[collName].getIndexes().map(idx => idx.name).join(", ");
  print(`📁 Collection: ${collName.padEnd(16)} | Documents: ${count.toString().padEnd(4)} | Indexes: [${indexes}]`);
});

print("\n✅ Initialization complete! The database is ready for CA demo & use.");
print("==================================================================\n");
