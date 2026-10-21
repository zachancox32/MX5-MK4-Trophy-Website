// Drafts get no URL and stay out of collections, so toggling `draft: true`
// in the CMS genuinely unpublishes a post rather than just hiding it.
export default {
  layout: "post.njk",
  tags: "news",
  eleventyComputed: {
    permalink: (data) =>
      data.draft ? false : `/news/${data.page.fileSlug}/index.html`,
    eleventyExcludeFromCollections: (data) => !!data.draft,
  },
};
