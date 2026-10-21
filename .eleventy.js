export default function (eleventyConfig) {
  // static assets pass straight through, unprocessed
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "admin": "admin" });

  eleventyConfig.addFilter("dateUK", (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
  eleventyConfig.addFilter("dateISO", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));
  // model names must not break across lines at their hyphen; applied where a
  // title renders as visible html, never where it goes into a meta tag
  eleventyConfig.addFilter("keepModel", (s) =>
    String(s).replace(/MX-5/g, '<span class="nb">MX-5</span>'));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
