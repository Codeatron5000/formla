module.exports = {
    plugins: [
        '@babel/plugin-proposal-class-properties',
    ],
    presets: [
        [
            '@babel/preset-env',
            {
                targets: '> 1%, not dead',
            },
        ],
        '@babel/preset-flow',
    ],
};