// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "marpme";
export const SITE_DESCRIPTION =
  "Welcome to my awesome blog, talking about web technologies and various related topics";
export const TWITTER_HANDLE = "@marpme_";
export const MY_NAME = "marpme";

// setup in astro.config.mjs
const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;
