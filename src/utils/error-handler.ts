import chalk from "chalk";

export function handleError(error: unknown) {
  console.error(chalk.red("❌ An error occurred:"));

  if (error instanceof Error) {
    console.error(chalk.red(error.message));
  } else {
    console.error(chalk.red(String(error)));
  }

  process.exit(1);
}
