// ishlatilgani yo'q
// keyinchalik foydalanilishi mumkin

import fs from "fs";
import path from "path";
import { ShadcnConfig } from "../interface/shadcn.js";
import chalk from "chalk";

export async function createComponentsJson(config: ShadcnConfig) {
  const componentsJson = {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: true,
    tsx: true,
    tailwind: {
      config: "",
      css: "src/app/globals.css",
      baseColor: "neutral",
      cssVariables: config.useCssVariables,
      prefix: "",
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
    iconLibrary: "lucide",
  };

  const filePath = path.resolve(process.cwd(), "components.json");
  fs.writeFileSync(filePath, JSON.stringify(componentsJson, null, 2));
  console.log(chalk.blue("components.json fayli yaratildi."));
}
