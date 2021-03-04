module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    project: ['./tsconfig.json']
  },
  plugins: ['react', 'prettier', 'sonarjs', '@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'prettier/@typescript-eslint',
    'prettier/react',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // Base rules
    curly: 1,
    'eol-last': 1,
    eqeqeq: 1,
    'no-bitwise': 1,
    'no-console': 0, //TODO fix
    'no-caller': 1,
    'no-eval': 1,
    'no-multiple-empty-lines': 1,
    'no-new-func': 1,
    'no-new-wrappers': 1,
    'no-shadow': 1,
    radix: 0,
    'no-case-declarations': 0,
    'spaced-comment': 1,
    'valid-jsdoc': 1,
    'import/order': [
      1,
      {
        'newlines-between': 'never',
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        pathGroups: [
          {
            pattern: 'app/**',
            group: 'parent'
          },
          {
            pattern: 'common/**',
            group: 'internal'
          },
          {
            pattern: 'entities/**',
            group: 'sibling'
          }
        ]
      }
    ],
    "no-restricted-imports": ["error", {
      "patterns": ["./*", "../*"]
    }],

    // React rules
    'react/display-name': 0,
    'react/prop-types': 0,
    'react/jsx-no-target-blank': 1,
    'react/jsx-curly-brace-presence': [1, { props: 'never', children: 'ignore' }],
    'react/jsx-fragments': [1, 'syntax'],
    'react/jsx-no-useless-fragment': 1,
    'react/jsx-pascal-case': 1,
    'react/no-array-index-key': 0, //TODO fix
    'react/no-children-prop': 0,
    'react/no-danger': 1,
    'react/no-did-mount-set-state': 0, // TODO fix
    'react/no-did-update-set-state': 1,
    'react/no-multi-comp': 1,
    'react/no-redundant-should-component-update': 1,
    'react/no-this-in-sfc': 1,
    'react/no-typos': 1,
    'react/no-unused-state': 1,
    'react/no-will-update-set-state': 1,
    'react/prefer-es6-class': [1, 'always'],
    'react/style-prop-object': 1,

    // TypeScript rules
    '@typescript-eslint/ban-ts-ignore': 0, //TODO fix
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/consistent-type-definitions': 1,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/interface-name-prefix': [1, { prefixWithI: 'always' }],
    '@typescript-eslint/no-var-requires': 1,
    '@typescript-eslint/no-dynamic-delete': 1,
    '@typescript-eslint/no-empty-function': 1,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-extra-non-null-assertion': 1,
    '@typescript-eslint/no-for-in-array': 1,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-inferrable-types': 0,
    '@typescript-eslint/no-namespace': 1,
    '@typescript-eslint/no-require-imports': 1,
    '@typescript-eslint/no-this-alias': 1,
    '@typescript-eslint/no-unused-vars-experimental': 0,
    '@typescript-eslint/no-useless-constructor': 1,
    '@typescript-eslint/prefer-regexp-exec': 0,
    '@typescript-eslint/prefer-string-starts-ends-with': 1,
    '@typescript-eslint/require-array-sort-compare': 1,
    '@typescript-eslint/restrict-plus-operands': 1,
    '@typescript-eslint/unbound-method': 0,
    '@typescript-eslint/no-non-null-assertion': 1,
    '@typescript-eslint/no-explicit-any': 0, //TODO fix

    'sonarjs/cognitive-complexity': 0 //TODO fix
  }
};
