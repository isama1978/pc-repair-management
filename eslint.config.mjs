// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // --- REGALAS RELAJADAS ---
      '@typescript-eslint/no-explicit-any': 'off', // Permite usar 'any' cuando sea necesario
      '@typescript-eslint/no-unsafe-assignment': 'off', // No molesta al asignar variables
      '@typescript-eslint/no-unsafe-member-access': 'off', // No molesta al acceder a propiedades de un 'any'
      '@typescript-eslint/no-unsafe-call': 'off', // No molesta al llamar funciones de un 'any'
      '@typescript-eslint/no-floating-promises': 'off', // Útil si a veces olvidas el await en logs o cosas no críticas
      
      // --- LIMPIEZA PERO SIN ERRORES ---
      '@typescript-eslint/no-unused-vars': ['warn', { 
        'argsIgnorePattern': '^_', 
        'varsIgnorePattern': '^_' 
      }], // Solo avisa (no corta la ejecución) y permite variables que empiecen con _
      
      // --- PRETTIER ---
      "prettier/prettier": ["error", { 
        "endOfLine": "auto",
        "singleQuote": true,
        "trailingComma": "all"
      }],
    },
  },
);
