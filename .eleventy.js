module.exports = function (eleventyConfig) {
  return {
    dir: {
      input: "content",
      includes: "_includes",
      output: "posts"
    }
  };
};
