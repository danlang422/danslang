module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("shot", function (src, alt, crop = false) {
    const cropClass = crop ? " post-img-wrap--crop" : "";
    const expand = crop ? '<span class="post-img-expand">view full ↗</span>' : "";
    return `<div class="post-img-wrap${cropClass}"><img src="${src}" alt="${alt}">${expand}</div>`;
  });

  eleventyConfig.addPairedShortcode("figrow", function (content, caption) {
    return `<figure class="post-img-fig post-img-fig--row"><div class="post-img-row">${content}</div><figcaption>${caption}</figcaption></figure>`;
  });

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("script.js");

  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "content",
      includes: "_includes",
      output: "_site"
    }
  };
};
