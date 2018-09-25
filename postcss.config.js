module.exports = {
  plugins: [
    require('autoprefixer')({
    	browsers: ['last 100 Chrome versions', 'last 100 Firefox versions', 'last 100 opera versions']
    })
  ]
}