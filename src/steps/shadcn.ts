import chalk from "chalk";
import { execSync } from "child_process";
import prompts from "prompts";

interface ShadcnConfig {
  components: string[];
}

export async function installShadcn(projectName: string, config: ShadcnConfig) {
  console.log(chalk.blue(`ShadCN UI ni o'rnatish: ${projectName}`));

  try {
    console.log(chalk.blue("ShadCN UI konfiguratsiyasini tayyorlash..."));
    console.log(chalk.yellow("Tanlangan komponentlar:"));
    console.log(config.components.join(", "));

    const confirmInstallation = await prompts({
      type: "confirm",
      name: "proceed",
      message: "Ushbu konfiguratsiya bilan davom etishni xohlaysizmi?",
      initial: true,
    });

    if (!confirmInstallation.proceed) {
      console.log(chalk.yellow("ShadCN UI o'rnatish bekor qilindi."));
      return false;
    }

    console.log(chalk.blue("ShadCN UI o'rnatilmoqda..."));

    process.chdir(projectName);

    execSync("npx shadcn@latest init", { stdio: "inherit" });

    if (config.components.length > 0) {
      const componentsCommand = `npx shadcn@latest add ${config.components.join(" ")}`;
      execSync(componentsCommand, { stdio: "inherit" });
    }

    console.log(chalk.green("✅ ShadCN UI muvaffaqiyatli o'rnatildi."));
    return true;
  } catch (error) {
    console.error(chalk.red("ShadCN UI o'rnatish muvaffaqiyatsiz yakunlandi."));
    console.error(error);
    throw new Error("ShadCN UI o'rnatish muvaffaqiyatsiz yakunlandi.");
  }
}

export async function getShadcnConfiguration(): Promise<ShadcnConfig> {
  const responses = await prompts([
    {
      type: "multiselect",
      name: "components",
      message: "Qaysi komponentlarni o'rnatishni xohlaysiz?",
      choices: [
        { title: "Button", value: "button" },
        { title: "Input", value: "input" },
        { title: "Card", value: "card" },
        { title: "Dropdown", value: "dropdown" },
        { title: "Alert", value: "alert" },
        { title: "Avatar", value: "avatar" },
        { title: "Badge", value: "badge" },
        { title: "Checkbox", value: "checkbox" },
        { title: "Dialog", value: "dialog" },
        { title: "Form", value: "form" },
        { title: "Label", value: "label" },
        { title: "Select", value: "select" },
        { title: "Table", value: "table" },
        { title: "Tooltip", value: "tooltip" },
      ],
      instructions: false,
      hint: "- Spase to select. Return to submit",
    },
  ]);

  return responses as ShadcnConfig;
}
