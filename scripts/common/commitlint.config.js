const Configuration = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: './parser-preset',
  formatter: '@commitlint/format',
  rules: {
    'type-enum': [2, 'always', ['FIX', 'FEATURE', 'TEST', 'REFACTOR']],
    'type-case': [2, 'always', 'upper-case'],
    'subject-case': [2, 'always', 'sentence-case'],
    'header-max-length': [2, 'always', 150]
  }
};

module.exports = Configuration;
