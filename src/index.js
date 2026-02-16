#!/usr/bin/env node

const pkg = require("../package.json");

function printHelp() {
  console.log(`
${pkg.name} v${pkg.version}

Usage:
  iq <command> [options]

Commands:
  greet [name]   Print a greeting

Options:
  -h, --help     Show help
  -v, --version  Show version
`);
}

function run(argv) {
  const args = argv.slice(2);

  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    printHelp();
    return 0;
  }

  if (args.includes("-v") || args.includes("--version")) {
    console.log(pkg.version);
    return 0;
  }

  const [command, ...rest] = args;

  if (command === "greet") {
    const name = rest[0] || "there";
    console.log(`Hello, ${name}!`);
    return 0;
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  return 1;
}

const code = run(process.argv);
process.exit(code);
