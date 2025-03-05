#!/usr/bin/env node
import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";
import prompts, { Options, PromptObject } from "prompts";
import { installNextJs, getNextJsConfiguration } from "./steps/nextjs.js";
import { installShadcn, getShadcnConfiguration } from "./steps/shadcn.js";
import { installNextIntl } from "./steps/next-intl.js";
import { handleError } from "./utils/error-handler.js";
import { validateProjectName } from "./utils/name-validation.js";
import { execa } from "execa";

interface ExtendedOptions extends Options {
  onState?: (state: { aborted: boolean; value?: any }) => void;
  onSubmit?: (prompt: PromptObject, answer: any) => void;
}

async function main() {
  console.log(
    gradient.vice(
      figlet.textSync("HayWan Frontend", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );

  console.log(
    "https://haywan.uz tomonidan ishlab chiqildi: qo'llab quvvatlash uchun: https://haywan.uz/blog/support"
  );

  const promptsOptions: ExtendedOptions = {
    onCancel: () => {
      console.log(chalk.yellow("Loyiha yaratish bekor qilindi."));
      process.exit(0);
    },
    onState: (state) => {
      if (state.aborted) {
        process.nextTick(() => {
          process.exit(0);
        });
      }
    },
  };

  try {
    const { projectName } = await prompts(
      {
        type: "text",
        name: "projectName",
        message: "Loyiha nomini kiriting:",
        validate: validateProjectName,
        initial: "haywan-app",
      },
      promptsOptions
    );

    if (!projectName) {
      console.log(chalk.yellow("Loyiha yaratish bekor qilindi."));
      return;
    }

    const nextJsConfig = await getNextJsConfiguration();
    const nextJsInstallSuccess = await installNextJs(projectName, nextJsConfig);

    if (nextJsInstallSuccess) {
      try {
        console.log(chalk.blue("🧹 Git chopilmoqda..."));
        await execa("rm", ["-rf", `${projectName}/.git`]);
        console.log(chalk.green("✅ Git chopildi..."));
      } catch (error) {
        console.log(
          chalk.yellow(
            "⚠️ Proyektdagi .git chopilmadi, qo'lda chopvorish mumkin."
          )
        );
      }

      try {
        await execa("rm", ["-rf", `${projectName}/public`]);
      } catch (error) {}

      const nextIntlInstallConfirm = await prompts(
        {
          type: "confirm",
          name: "install",
          message: "Next-intl o'rnatishni istaysizmi?",
          initial: true,
        },
        promptsOptions
      );

      if (nextIntlInstallConfirm.install) {
        await installNextIntl(projectName);
      }

      const shadcnInstallConfirm = await prompts(
        {
          type: "confirm",
          name: "install",
          message: "ShadCN UI o'rnatishni istaysizmi?",
          initial: true,
        },
        promptsOptions
      );

      let shadcnConfig = null;
      if (shadcnInstallConfirm.install) {
        shadcnConfig = await getShadcnConfiguration();

        await installShadcn(projectName, shadcnConfig);
      }

      console.log(
        chalk.green(`✨ ${projectName} loyihasi muvaffaqiyatli yaratildi! 🚀`)
      );
      console.log(chalk.blue(`cd ${projectName} && npm run dev`));
    }
  } catch (error) {
    handleError(error);
  }
}

main();
