module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: [
        "ie >= 9",
        "ff >= 10",
        "chrome >= 10",
        "safari >= 7",
        "opera >= 10"
      ]
    })
  ]
}