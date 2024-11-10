// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import db from '@astrojs/db';

import auth from 'auth-astro';

import netlify from '@astrojs/netlify';

import icon from 'astro-icon';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), db(), auth(), icon(), react()],
  output: 'server',
  adapter: netlify()
});