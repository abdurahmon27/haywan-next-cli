import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { execSync } from "child_process";

interface NextIntlConfig {
  locales: string[];
  defaultLocale: string;
  useAppRouter: boolean;
}

export async function installNextIntl(
  projectName: string,
  config?: Partial<NextIntlConfig>
) {
  const projectPath = path.resolve(process.cwd(), projectName);

  const defaultConfig: NextIntlConfig = {
    locales: ["uz", "en", "ru"],
    defaultLocale: "uz",
    useAppRouter: true,
  };

  const finalConfig = { ...defaultConfig, ...config };

  try {
    console.log(chalk.blue("Next intl o'rnatilmoqda..."));

    execSync("npm install next-intl", {
      stdio: "inherit",
      cwd: projectPath,
    });

    const isTypeScript = fs.existsSync(path.join(projectPath, "tsconfig.json"));
    const hasSrcDir = fs.existsSync(path.join(projectPath, "src"));
    const rootDir = hasSrcDir ? path.join(projectPath, "src") : projectPath;

    const localesPath = path.join(projectPath, "locales");
    fs.mkdirpSync(localesPath);

    createLocaleFiles(localesPath, finalConfig.locales);

    if (finalConfig.useAppRouter) {
      await configureAppRouter(rootDir, isTypeScript, finalConfig);
    } else {
      await configurePagesRouter(rootDir, isTypeScript, finalConfig);
    }

    updateNextConfig(projectPath, finalConfig);

    console.log(chalk.green("✅ next-intl muvaffaqiyatli o'rnatildi."));
    return true;
  } catch (error) {
    console.error(chalk.red("next-intl o'rnatish muvaffaqiyatsiz yakunlandi."));
    console.error(error);
    throw error;
  }
}

async function configureAppRouter(
  rootDir: string,
  isTypeScript: boolean,
  config: NextIntlConfig
) {
  const fileExt = isTypeScript ? "tsx" : "jsx";
  const appDir = path.join(rootDir, "app");
  fs.mkdirpSync(appDir);

  await createMiddlewareFile(rootDir, fileExt, config);

  await createLayoutFile(appDir, fileExt, config);

  await createSamplePage(appDir, fileExt);
}

async function configurePagesRouter(
  rootDir: string,
  isTypeScript: boolean,
  config: NextIntlConfig
) {
  const fileExt = isTypeScript ? "tsx" : "jsx";
  const pagesDir = path.join(rootDir, "pages");
  fs.mkdirpSync(pagesDir);

  await createAppFile(pagesDir, fileExt, config);

  await createInternationalizedPage(pagesDir, fileExt, config);
}

async function createMiddlewareFile(
  rootDir: string,
  fileExt: string,
  config: NextIntlConfig
) {
  const middlewareContent = `
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(${config.locales.join("|")})/:path*']
};
`;

  fs.writeFileSync(
    path.join(rootDir, `middleware.${fileExt}`),
    middlewareContent
  );
}

async function createLayoutFile(
  appDir: string,
  fileExt: string,
  config: NextIntlConfig
) {
  const localeDir = path.join(appDir, "[locale]");
  fs.mkdirpSync(localeDir);

  const layoutContent = `
import { routing } from '@/i18n/routing';
import { redirect } from 'next/navigation';
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "@/app/globals.css";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    redirect(routing.defaultLocale);
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={\`\${openSans.variable} \${openSans.className} antialiased\`}>
        {children}
      </body>
    </html>
  );
}

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haywan-Frontend",
  description: "Custom next.js installer package for haywan.uz",
};
`;

  fs.writeFileSync(path.join(localeDir, `layout.${fileExt}`), layoutContent);

  const rootLayoutContent = `
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
`;

  fs.writeFileSync(path.join(appDir, `layout.${fileExt}`), rootLayoutContent);
}

async function createSamplePage(appDir: string, fileExt: string) {
  const pageContent = `
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations('home');

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-gray-600 mb-6">{t('description')}</p>
        <Link
          href={'https://haywan.uz'}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          haywan.uz
        </Link>
      </div>
    </main>
  );
}

`;

  const localeDir = path.join(appDir, "[locale]");
  fs.mkdirpSync(localeDir);

  fs.writeFileSync(path.join(localeDir, `page.${fileExt}`), pageContent);

  const rootPageContent = `
import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default function RootPage() {
  redirect('/' + routing.defaultLocale);
}
`;

  fs.writeFileSync(path.join(appDir, `page.${fileExt}`), rootPageContent);
}

async function createAppFile(
  pagesDir: string,
  fileExt: string,
  config: NextIntlConfig
) {
  const appContent = `
import { NextIntlClientProvider } from 'next-intl';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextIntlClientProvider 
      locale={pageProps.locale || '${config.defaultLocale}'} 
      messages={pageProps.messages}
    >
      <Component {...pageProps} />
    </NextIntlClientProvider>
  );
}
`;

  fs.writeFileSync(path.join(pagesDir, `_app.${fileExt}`), appContent);
}

async function createInternationalizedPage(
  pagesDir: string,
  fileExt: string,
  config: NextIntlConfig
) {
  const pageContent = `
import { useTranslations } from 'next-intl';
import { GetStaticPropsContext } from 'next';

export default function Home() {
  const t = useTranslations('home');
  
  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </main>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      locale,
      messages: (await import(\`../../locales/\${locale}.json\`)).default
    }
  };
}

export function getStaticPaths() {
  return {
    paths: ${JSON.stringify(
      config.locales.map((locale) => ({ params: { locale } }))
    )},
    fallback: false
  };
}
`;

  fs.writeFileSync(path.join(pagesDir, `index.${fileExt}`), pageContent);
}

function updateNextConfig(projectPath: string, config: NextIntlConfig) {
  const jsConfigPath = path.join(projectPath, "next.config.js");
  const tsConfigPath = path.join(projectPath, "next.config.ts");
  const isTypeScript = fs.existsSync(path.join(projectPath, "tsconfig.json"));

  let configPath: string;
  let configFileExt: string;

  if (fs.existsSync(tsConfigPath)) {
    configPath = tsConfigPath;
    configFileExt = "ts";
  } else if (fs.existsSync(jsConfigPath)) {
    configPath = jsConfigPath;
    configFileExt = "js";
  } else {
    configFileExt = isTypeScript ? "ts" : "js";
    configPath = path.join(projectPath, `next.config.${configFileExt}`);
  }

  const nextConfigContent = `
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/requests.${configFileExt}');

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withNextIntl(nextConfig);
`;

  fs.writeFileSync(configPath, nextConfigContent);

  const i18nDir = path.join(projectPath, "src", "i18n");
  fs.mkdirpSync(i18nDir);

  // routing
  fs.writeFileSync(
    path.join(i18nDir, `routing.${configFileExt}`),
    `import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // localelar ro'yxatchasi
  locales: ${JSON.stringify(config.locales)},
 
  // agar locale to'g'ri kelmasa shundan ishlating
  defaultLocale: '${config.defaultLocale}'
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
`
  );

  //  requests.ts
  fs.writeFileSync(
    path.join(i18nDir, `requests.${configFileExt}`),
    `import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
 
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
 
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
 
  return {
    locale,
    messages: (await import(\`../../locales/\${locale}.json\`)).default
  };
});
`
  );
}

function createLocaleFiles(localesPath: string, locales: string[]) {
  const sampleLocales = {
    home: {
      title: "",
      description: "",
    },
  };

  locales.forEach((locale) => {
    const translations = { ...sampleLocales };

    switch (locale) {
      case "uz":
        translations.home.title = "Salom, Dunyo!";
        translations.home.description = "Bu haywan-frontend loyihasi";
        break;
      case "en":
        translations.home.title = "Hello, World!";
        translations.home.description = "This is haywan-frontend project";
        break;
      case "ru":
        translations.home.title = "Привет, Мир!";
        translations.home.description = "Это проект haywan-frontend";
        break;
    }

    fs.writeFileSync(
      path.join(localesPath, `${locale}.json`),
      JSON.stringify(translations, null, 2)
    );
  });
}

export default installNextIntl;
