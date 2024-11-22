// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import db from '@astrojs/db';

import auth from 'auth-astro';

import icon from 'astro-icon';

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), db(), auth(), icon(), react()],
  output: 'server',
  adapter: cloudflare(),
});