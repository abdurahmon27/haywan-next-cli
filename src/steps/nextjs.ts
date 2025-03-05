import chalk from "chalk";
import { execSync } from "child_process";
import prompts from "prompts";
import { NextJsConfig } from "../interface/next-config.js";

export async function installNextJs(projectName: string, config: NextJsConfig) {
  console.log(chalk.blue(`Yangi next.js loyiha: ${projectName}`));

  try {
    const createNextAppCommand = buildNextJsCommand(projectName, config);

    console.log(chalk.blue("Loyiha konfiguratsiyasini tayyorlash..."));
    // console.log(chalk.yellow("Tanlangan konfiguratsiya:"));
    // console.log(JSON.stringify(config, null, 2));

    // const confirmInstallation = await prompts({
    //   type: "confirm",
    //   name: "proceed",
    //   message: "Ushbu konfiguratsiya bilan davom etishni xohlaysizmi?",
    //   initial: true,
    // });

    // if (!confirmInstallation.proceed) {
    //   console.log(chalk.yellow("Loyiha yaratish bekor qilindi."));
    //   return false;
    // }

    console.log(chalk.blue("Loyiha yaratilmoqda..."));

    execSync(createNextAppCommand, {
      stdio: "inherit",
    });

    console.log(chalk.green("✅ Next.js loyiha muvaffaqiyatli yaratildi."));
    return true;
  } catch (error) {
    console.error(
      chalk.red("Next.js loyiha yaratish muvaffaqiyatsiz yakunlandi.")
    );
    console.error(error);
    throw new Error("Next.js loyiha yaratish muvaffaqiyatsiz yakunlandi.");
  }
}

export async function getNextJsConfiguration(): Promise<NextJsConfig> {
  const responses = await prompts([
    {
      type: "confirm",
      name: "typescript",
      message: "TypeScript dan foydalanishni xohlaysizmi?",
      initial: true,
    },
    {
      type: "confirm",
      name: "eslint",
      message: "ESLint dan foydalanishni xohlaysizmi?",
      initial: true,
    },
    {
      type: "confirm",
      name: "tailwindcss",
      message: "Tailwind CSS dan foydalanishni xohlaysizmi?",
      initial: true,
    },
    {
      type: "confirm",
      name: "srcDirectory",
      message: "Kodlarni `src/` papkasiga joylashtirishni xohlaysizmi?",
      initial: true,
    },
    {
      type: "confirm",
      name: "appRouter",
      message: "App Router dan foydalanishni xohlaysizmi? (tavsiya etiladi)",
      initial: true,
    },
    {
      type: "confirm",
      name: "turbopack",
      message: "`next dev` uchun Turbopack dan foydalanishni xohlaysizmi?",
      initial: false,
    },
    {
      type: "text",
      name: "importAlias",
      message:
        "Import alias ni sozlashni xohlaysizmi? (standart '@/*' bo'ladi)",
      initial: "@/*",
    },
  ]);

  return responses as NextJsConfig;
}

function buildNextJsCommand(projectName: string, config: NextJsConfig): string {
  const commandParts = [
    "npx create-next-app@latest",
    projectName,
    "--no-interactive",
    config.typescript ? "--typescript" : "--no-typescript",
    config.eslint ? "--eslint" : "--no-eslint",
    config.tailwindcss ? "--tailwind" : "--no-tailwind",
    config.srcDirectory ? "--src-dir" : "--no-src-dir",
    config.appRouter ? "--app" : "--no-app",
    config.turbopack ? "--turbopack" : "--no-turbopack",
    config.importAlias !== "@/*"
      ? `--import-alias ${config.importAlias}`
      : "--no-import-alias",
  ];

  const finalCommand = commandParts
    .filter((part) => part.trim() !== "")
    .join(" ");
  // console.log(chalk.yellow("Final Kommanda: ", finalCommand));
  return finalCommand;
}
