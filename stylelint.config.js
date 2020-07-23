module.exports = {
  plugins: [
    'stylelint-scss',
    'stylelint-order'
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'order/properties-alphabetical-order': true,
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['colour']
      }
    ]
  }
}
