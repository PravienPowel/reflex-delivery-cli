#!/usr/bin/env node

// index.js
// Entry point for the Reflex CLI.
// Run with: node index.js <command> [--flags]
// e.g. node index.js log --customer "Jane" --phone "0712345678" --address "Thika Rd" --item "Printer"

const { parseArgs } = require("./src/utils/args");

const commands = {
  log: require("./src/commands/log"),
  list: require("./src/commands/list"),
  assign: require("./src/commands/assign"),
  mydeliveries: require("./src/commands/mydeliveries"),
  status: require("./src/commands/status"),
  sync: require("./src/commands/sync"),
  confirm: require("./src/commands/confirm"),
};

function printHelp() {
  console.log("Reflex CLI - delivery coordination for small retailers\n");
  console.log("Usage: node index.js <command> [--flags]\n");
  console.log("Available commands:");
  console.log('  log            --customer --phone --address --item');
  console.log('  list           [--status]');
  console.log('  assign         --id --rider');
  console.log('  mydeliveries   --rider [--status]');
  console.log('  status         --id --update');
  console.log('  sync');
  console.log('  confirm        --id --code');
}

function main() {
  const [, , commandName, ...rest] = process.argv;

  if (!commandName || commandName === "--help" || commandName === "-h") {
    printHelp();
    return;
  }

  const command = commands[commandName];

  if (!command) {
    console.log(`Unknown command: "${commandName}"`);
    printHelp();
    return;
  }

  const args = parseArgs(rest);
  command.run(args);
}

main();
