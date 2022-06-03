module.exports = {
	'env': {
		'browser': true,
		'node': true,
		'commonjs': true,
		'es2021': true
	},
	extends: [
		'eslint:recommended',
		'prettier'
	  ],
	'parserOptions': {
		'ecmaVersion': 'latest'
	},
	'rules': {
		'max-len': ['error', {'code': 120}],
		'indent': [
			'error',
			'space'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};
