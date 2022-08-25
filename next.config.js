const withPlugins = require('next-compose-plugins');
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');
const withCSS = require('@zeit/next-css')
const withFonts = require('next-fonts');

const nextConfig = {
  exportPathMap: function() {
    return {
      '/': { page: '/' },
    };
  },
};

module.exports = withPlugins([withFonts,withCSS, withSass, withImages ], nextConfig);
