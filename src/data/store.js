// store.js
// Handles reading and writing delivery records to a local JSON file.
// This acts as our simple "database" for the sprint.

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "deliveries.json");
const META_FILE = path.join(__dirname, "meta.json");

// Small key/value side-file for things like the last sync timestamp.
function readMeta() {
  if (!fs.existsSync(META_FILE)) return {};
  return JSON.parse(fs.readFileSync(META_FILE, "utf-8"));
}

function writeMeta(meta) {
  fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2));
}

// Make sure the data file exists before we try to read it
function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

function readAll() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeAll(deliveries) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(deliveries, null, 2));
}

function getNextId(deliveries) {
  if (deliveries.length === 0) return 1;
  const maxId = Math.max(...deliveries.map((d) => d.id));
  return maxId + 1;
}

module.exports = {
  readAll,
  writeAll,
  getNextId,
  readMeta,
  writeMeta,
};
