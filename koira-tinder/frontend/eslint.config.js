import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores(["dist"]),
    {
        files: ["**/*.{js,jsx}"],
        extends: [
            js.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: "latest",
                ecmaFeatures: { jsx: true },
                sourceType: "module",
            },
        },
        rules: {
        // käyttämättömät muuttujat, isoilla kirjoitetut (CONST) sallitaan
            "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],

            // 4 välilyöntiä sisennys
            indent: ["error", 4, { SwitchCase: 1 }], 

            // aina tuplahipsut (sekä JS että JSX)
            quotes: ["error", "double", { avoidEscape: true }], 

            // console.log ja console.warn -> warning (info/error saa jäädä jos haluat)
            "no-console": ["warn", { allow: ["info", "error"] }],
        
            // ei var, vain let/const
            "no-var": "error",
            "prefer-const": ["error", {
                destructuring: "all",
                ignoreReadBeforeAssign: true,
            }],

            // ei turhia ; ja jatkuvasti sama tyyli
            semi: ["error", "always"],

            // objektien avaimet ilman turhia trailing-komia
            "comma-dangle": ["error", "always-multiline"],

            // React-hooks tarkemmaksi (plugin antaa jo recommended, mutta varmistetaan)
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            // react-refresh suositus: vain komponentit default/export
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        },

    },
]);
