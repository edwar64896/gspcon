const path = require('path');

module.exports = {
  entry: {
	  main: './websrc/js/main.js',
	  admin: './websrc/js/admin.js'

  },
  watch: true,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './public/js/'),
  },
};
