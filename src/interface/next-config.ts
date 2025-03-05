export interface NextJsConfig {
  typescript: boolean;
  eslint: boolean;
  tailwindcss: boolean;
  srcDirectory: boolean;
  appRouter: boolean;
  turbopack: boolean;
  importAlias: string;
  useNextIntl: boolean;
  nextIntlLocales?: string[];
  nextIntlDefaultLocale?: string;
}
