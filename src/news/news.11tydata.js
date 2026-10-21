// Drafts get no URL and stay out of collections, so toggling `draft: true`
// in the CMS genuinely unpublishes a post rather than just hiding it.
export default {
  layout: "post.njk",
  tags: "news",
  eleventyComputed: {
    permalink: (data) =>
      data.draft ? false : `/news/${data.page.fileSlug}/index.html`,
    eleventyExcludeFromCollections: (data) => !!data.draft,

    // <title> carries the brand; the h1 stays the bare headline
    // set `shortTitle` in a post to keep the <title> under ~60 chars
    pageTitle: (data) => `${data.shortTitle || data.title} | MX-5 Mk4 Trophy`,
    // posts had no meta description at all, so the standfirst becomes one
    description: (data) => data.excerpt || data.site.description,
    ogTitle: (data) => data.title,
    ogDescription: (data) => data.excerpt,
  },
};
