const markdownIt = require("markdown-it");
const md = markdownIt({ html: true });

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("shot", function (src, alt, crop = false) {
    const cropClass = crop ? " post-img-wrap--crop" : "";
    const expand = crop ? '<span class="post-img-expand">view full ↗</span>' : "";
    return `<div class="post-img-wrap${cropClass}"><img src="${src}" alt="${alt}">${expand}</div>`;
  });

  eleventyConfig.addPairedShortcode("figrow", function (content, caption) {
    return `<figure class="post-img-fig post-img-fig--row"><div class="post-img-row">${content}</div><figcaption>${caption}</figcaption></figure>`;
  });

  // {% book "Title", "Author", "ISBN", "https://goodreads.com/..." %}commentary (markdown){% endbook %}
  // Cover comes from Open Library by ISBN; the card links out to Goodreads.
  eleventyConfig.addPairedShortcode("book", function (content, title, author, isbn, url) {
    const cover = isbn
      ? `<img class="book-cover" src="https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg" alt="Cover of ${title}" loading="lazy">`
      : "";
    const note = md.render(content).replace(/\n/g, "");
    return `<section class="book-card"><a class="book-cover-link" href="${url}" target="_blank" rel="noopener">${cover}</a><div class="book-info"><h2 class="book-title">${title}</h2><p class="book-author">${author}</p><div class="book-note">${note}</div><a class="book-link" href="${url}" target="_blank" rel="noopener">view on goodreads ↗</a></div></section>`;
  });

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy({ "bootcamp": "portfolio/bootcamp" });
  eleventyConfig.addPassthroughCopy({ "keeper-app": "portfolio/keeper" });

  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "content",
      includes: "_includes",
      output: "_site"
    }
  };
};
