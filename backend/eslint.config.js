// backend/eslint.config.cjs

const js = require("@eslint/js");
const globals = require("globals");

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
    // Mitä polkuja EI lintsata
    {
        ignores: ["dist", "node_modules"],
    },

    // Pääkonffi kaikille .js-tiedostoille
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "script",          // backendissä käytät require/module.exports
            globals: {
                ...globals.node,             // Node-globaalit: require, module, process jne.
            },
        },
        // Tämä korvaa "extends: [js.configs.recommended]"
        ...js.configs.recommended,
        rules: {
            // Voit overrideaa/rajoittaa js.configs.recommendedin sääntöjä tässä
            "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
            indent: ["error", 4, { SwitchCase: 1 }],
            quotes: ["error", "double", { avoidEscape: true }],
            semi: ["error", "always"],
            "comma-dangle": ["error", "always-multiline"],
            eqeqeq: ["error", "always"],
            "no-var": "error",
            "prefer-const": ["error", {
                destructuring: "all",
                ignoreReadBeforeAssign: true,
            }],
            "no-console": ["warn", { allow: ["info", "error"] }],
        },
    },
];
