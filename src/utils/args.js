// args.js
// Minimal parser for flags like: --customer "Jane" --phone "0712345678"
// Kept dependency-free on purpose so anyone can clone and run this
// without npm install issues on the day of the demo.

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = argv[i + 1];
      // If the next token is another flag or missing, treat this as a boolean flag
      if (!next || next.startsWith("--")) {
        result[key] = true;
      } else {
        result[key] = next;
        i++; // skip the value we just consumed
      }
    }
  }
  return result;
}

module.exports = { parseArgs };
