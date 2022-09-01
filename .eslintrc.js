module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: ['airbnb-base', 'prettier'],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        'no-underscore-dangle': 0,
        'no-param-reassign': 0,
        'max-len': [1, { code: 80 }],
        'global-require': 0,
        'no-await-in-loop': 0,
        'no-plusplus': 0,
        'no-unused-expressions': 'off',
        'no-continue': 0,
        'no-use-before-define': 0,
        camelcase: 0,
        'no-console': 'off',
        'no-restricted-syntax': [
            'error',
            {
                selector:
                    "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
                message: 'Unexpected property on console object was called',
            },
        ],
    },
    ignorePatterns: ['test/*', 'tests/*', '*/test/*'],
}
