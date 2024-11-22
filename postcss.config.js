const cssSafelistClassArray = [
  /tippy/,
  /badge/,
  /badge-pill/,
  /bg-white/,
  /text-primary/,
  /primary/,
];

import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default {
  plugins: [
    autoprefixer,
    cssnano({
      preset: 'default',
    }),
    purgeCSSPlugin({
      content: ['./src/*.html', './src/js/**/*.js'],
      fontFace: false,
      safelist: cssSafelistClassArray,
    }),
  ],
};
