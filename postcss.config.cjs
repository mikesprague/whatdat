const cssSafelistClassArray = [
  /tippy/,
  /badge/,
  /badge-pill/,
  /bg-white/,
  /text-primary/,
  /primary/,
];

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default',
    }),
    require('@fullhuman/postcss-purgecss')({
      content: ['./src/*.html', './src/js/**/*.js'],
      safelist: cssSafelistClassArray,
    }),
  ],
};
