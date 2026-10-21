// Cache busting.
//
// netlify.toml caches /css and /js hard, which is right for speed but means
// a returning visitor keeps the old file until it expires. Appending a hash
// of the file's contents changes the URL whenever the file changes, so the
// cache is used when nothing moved and bypassed the moment it does.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const stamp = (path) =>
  createHash("sha1").update(readFileSync(path)).digest("hex").slice(0, 8);

export default {
  css: `/css/style.css?v=${stamp("src/css/style.css")}`,
  js: `/js/main.js?v=${stamp("src/js/main.js")}`,
};
