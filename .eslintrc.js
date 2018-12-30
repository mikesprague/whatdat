module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
  },
  "extends": "airbnb-base",
  "plugins": [ "import", "html", "markdown" ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "res|next|^err"
      }
    ],
  },
};
