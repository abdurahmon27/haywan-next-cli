import fs from "fs";
import path from "path";

const INVALID_PROJECT_NAME_CHARS = /[<>:"/\\|?*\u0000-\u001F]/;
const RESERVED_NAMES = [
  "CON",
  "PRN",
  "AUX",
  "NUL",
  "COM1",
  "COM2",
  "COM3",
  "COM4",
  "COM5",
  "COM6",
  "COM7",
  "COM8",
  "COM9",
  "LPT1",
  "LPT2",
  "LPT3",
  "LPT4",
  "LPT5",
  "LPT6",
  "LPT7",
  "LPT8",
  "LPT9",
];

export function validateProjectName(projectName: string): string | true {
  if (!projectName || projectName.trim() === "") {
    return "Loyiha nomi bo'sh bo'lishi mumkin emas, iltimos uni qayta kiriting:";
  }

  projectName = projectName.trim();

  if (projectName.length < 2) {
    return "Loyiha nomi kamida 2 belgidan iborat bo'lishi kerak:";
  }

  if (INVALID_PROJECT_NAME_CHARS.test(projectName)) {
    return "Loyiha nomida ruxsat etilmagan belgilar mavjud. Faqat harflar, raqamlar, tire (-) va pastki chiziq (_) ishlatilishi mumkin:";
  }

  if (RESERVED_NAMES.includes(projectName.toUpperCase())) {
    return "Ushbu loyiha nomi tizim tomonidan foydalanilishi mumkin bo'lgan nom hisoblanadi:";
  }

  if (
    projectName.startsWith(".") ||
    projectName.endsWith(".") ||
    projectName.startsWith(" ") ||
    projectName.endsWith(" ")
  ) {
    return "Loyiha nomi nuqta yoki bo'sh joy bilan boshlanishi yoki tugashi mumkin emas:";
  }

  const projectPath = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    return `${projectName} nomli katalog allaqachon mavjud. Boshqa nom kiriting:`;
  }

  if (projectName.length > 214) {
    return "Loyiha nomi 214 belgidan oshmasligi kerak:";
  }

  const npmPackageNameRegex =
    /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
  if (!npmPackageNameRegex.test(projectName)) {
    return "Loyiha nomi npm paket nomlanish qoidalariga mos kelmaydi:";
  }

  return true;
}
