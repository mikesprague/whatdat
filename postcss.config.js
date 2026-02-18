import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import purgeCSSPlugin from '@fullhuman/postcss-purgecss';

const cssSafelistClassArray = [
  /tippy/,
  /badge/,
  /badge-pill/,
  /bg-white/,
  /text-primary/,
  /primary/,
];

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
