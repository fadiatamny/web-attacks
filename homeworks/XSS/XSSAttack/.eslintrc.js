module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    plugins: ['prettier'],
    extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
    rules: {
        'prettier/prettier': ['warn', {
            "semi": false,
            "trailingComma": "none",
            "singleQuote": true,
            "printWidth": 120,
            "tabWidth": 4,
            "arrowPerins": "always",
            "bracketSpacing": true,
            "endOfLine": "crlf"
        }],
        '@typescript-eslint/explicit-function-return-type': 'off',
        'prefer-const': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
}
