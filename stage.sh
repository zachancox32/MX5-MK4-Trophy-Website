#!/usr/bin/env bash
# Builds ./_staging: a copy of the site that search engines will not index.
# Drag that folder onto https://app.netlify.com/drop to get a private-ish
# link you can send to partners. Production files are never touched.
set -euo pipefail
cd "$(dirname "$0")"

rm -rf _staging
mkdir -p _staging

npx eleventy --quiet
rsync -a --exclude '.DS_Store' _site/ _staging/

# block every crawler, and drop the sitemap so nothing advertises the staging URL
printf 'User-agent: *\nDisallow: /\n' > _staging/robots.txt
rm -f _staging/sitemap.xml

python3 - <<'PY'
import pathlib, re

for f in pathlib.Path('_staging').rglob('*.html'):
    s = f.read_text(encoding='utf-8')

    # belt and braces: a meta noindex as well as the robots.txt
    if 'name="robots"' in s:
        s = re.sub(r'<meta name="robots"[^>]*>',
                   '<meta name="robots" content="noindex,nofollow">', s)
    else:
        s = s.replace('<meta charset="utf-8">',
                      '<meta charset="utf-8">\n<meta name="robots" content="noindex,nofollow">', 1)

    # these all point at a domain that does not exist yet, so on staging they
    # produce a bad canonical and a broken link preview
    s = re.sub(r'\s*<link rel="canonical"[^>]*>', '', s)
    s = re.sub(r'\s*<meta property="og:url"[^>]*>', '', s)
    s = re.sub(r'\s*<meta property="og:image"[^>]*>', '', s)
    s = re.sub(r'\s*<meta name="twitter:card"[^>]*>', '', s)

    f.write_text(s, encoding='utf-8')
    print(f'  noindexed {f}')
PY

echo
echo "Staging build ready: $(pwd)/_staging"
echo "Drag that folder onto https://app.netlify.com/drop"
