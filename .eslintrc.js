module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "mocha": true,
        "node": true
    },
    "extends": "airbnb-base",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "linebreak-style": 0,
        "consistent-return": 0,
        "import/prefer-default-export": 0,
    }
};