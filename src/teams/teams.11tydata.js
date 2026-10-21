// Teams are a CMS collection but have no individual pages: the index page
// renders them all, so each file just carries data.
export default {
  eleventyComputed: {
    permalink: () => false,
    eleventyExcludeFromCollections: (data) => !!data.draft,
  },
  tags: "teams",
};
