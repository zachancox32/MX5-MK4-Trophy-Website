# MX-5 Mk4 Trophy

Built with [Eleventy](https://www.11ty.dev). Content is edited through
Sveltia CMS and committed to this repo, then Netlify rebuilds.

## Preview it locally

```bash
npm install
npm run serve
```

Then open http://localhost:4600. That rebuilds as you edit.

`npm run build` writes the finished site to `_site/`. `python3 server.py`
serves that folder if you would rather not run the watcher.

Node is installed at `~/.local/node` and added to PATH in `~/.zshrc`.
To remove it, delete that folder and that line.

## Files

```
src/index.njk           the homepage
src/news.njk            news index, with search and category filters
src/teams.njk           teams directory
src/thanks.njk          where both enquiry forms land
src/_includes/base.njk  the HTML shell every page uses
src/_includes/nav.njk   header, shared
src/_includes/foot.njk  footer, shared
src/_includes/post.njk  layout for a single article
src/news/*.md           articles, written by the CMS
src/teams/*.md          teams, written by the CMS
src/css/style.css       design system at the top, sections in page order
src/js/main.js          season state, mobile nav, news filtering, reveals
src/assets/             brand, partner logos, photography
admin/                  Sveltia CMS
.eleventy.js            build config
netlify.toml            build command, publish dir, headers
_site/                  build output, not in git
```

## Editing content

The CMS lives at `/admin`. It writes markdown into `src/news/` and
`src/teams/`, commits to GitHub, and Netlify rebuilds.

### Turning sign-in on, once

Sign-in runs through this site's own `/auth` and `/callback` functions
(`netlify/functions/`). No third party holds your tokens. Two steps, both
in accounts only you can reach:

**1. Create a GitHub OAuth app.** GitHub → Settings → Developer settings →
OAuth Apps → New OAuth App.

- Homepage URL: your site, e.g. `https://mazda-mx5-trophy.netlify.app`
- Authorization callback URL: that same address plus `/callback`

Generate a client secret and keep the page open.

**2. Put the two values into Netlify.** Site configuration → Environment
variables → Add:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

Deploy. `/admin` will then sign people in.

**Never put these in the repo.** The functions read them from the
environment at runtime, which is why they are safe to deploy publicly.

### Giving the team the ability to publish

We use **one shared GitHub account** for publishing rather than an account
each. Nobody on the team needs their own GitHub login, and because the
repo only ever sees one contributor, it can stay private on Netlify's
free plan.

**Setting it up**

1. Create a GitHub account for the championship, e.g.
   `mx5mk4trophy-media`, on an address the team controls rather than any
   one person's inbox.
2. Add it to the repo as a collaborator with **Write** access.
3. Use that account when creating the OAuth app above.
4. Put the login in your password manager and share it with whoever
   publishes.

**What this costs you.** Git history will show every post as that one
account, so there is no record of who wrote what, and if someone leaves
you change the password rather than revoking one person. For a team of
two or three publishing race reports that is usually a fair trade. If
attribution starts to matter, switch to an account each and make the repo
public, which lifts the contributor limit for nothing.

**The sign-in screen** at `/admin` is branded in `admin/index.html`:
the badge, the championship name and the site's colours, rather than the
CMS's own. Sveltia renders into the normal DOM with no shadow root, so
its styles can be overridden. The version is pinned in the script tag so
a surprise update cannot shift the selectors underneath it.

**Contributor limit.** Every CMS editor becomes a Git contributor, and
Netlify's free plan allows one on a *private* repo. Either keep the repo
public, which costs nothing and is safe here since there are no secrets,
or budget for Pro at $19 per editor per month.

**Drafts.** Both collections have a draft toggle. A draft is excluded
from the build entirely, so it has no URL at all rather than being a
hidden page someone could stumble on.

**Categories** on news are Race report, News, Drivers and Partners.
These drive the filter chips on the news index, so adding a new one
means adding a chip in `src/news.njk` too.

## Updating the season

The calendar drives everything. Each round is one row in `src/index.njk`
under `<div class="cal" data-calendar>`:

```html
<div class="cal__row" data-round="6" data-start="2026-09-12" data-end="2026-09-13">
```

`main.js` reads those dates on page load and works out the rest on its own:

- which rounds are finished (they dim, pill reads "Results")
- which round is next (highlighted yellow, pill reads "Next up", or
  "Racing now" during the weekend itself)
- the hero card: circuit, dates, round number and the days countdown
- the standings sub-heading, "After 5 of 7 rounds"
- the ticker copy

So at the end of the season you change the seven rows once and nothing
else needs touching all year. A single day meeting just uses the same
date for `data-start` and `data-end`.

There is no 2027 BRSCC calendar published as at 3 September 2026. When
it lands, replace the seven rows and the `2026 calendar` heading, and
everything else follows.

## Updating standings

Hand edit the table in the `#standings` section of `src/index.njk`. Five rows is the right
number for the homepage; a full table belongs on its own page later.

## Forms

Both forms use Netlify Forms: no backend, no keys. They work as soon as
the site is deployed to Netlify, and submissions appear under
**Forms** in the Netlify dashboard. Set up an email notification there
so enquiries reach an inbox rather than sitting in a panel.

Locally the forms will not submit. That is expected.

## Placeholders still to fill

Everything in square brackets is deliberately unfinished. Search the
project for `[` to find them all:

- **Standings**: `[Driver name]`, `[Team]` and the points. Currently
  placeholder values so the table has shape.
- **The car**: `[Capacity]`, `[000] bhp`, `[Control tyre]`,
  `[Cage and seat spec]`. Needs the technical regulations.
- **Costs**: `[£0,000] a weekend` in the Race with us steps.
- **Entries**: `[00]` in the hero next round card.
- **Partner packages**: `[n]` cars. The four package rows are a guess at
  a standard club racing offer, not your actual commercial deal.
- **Response time**: `[two working days]` on both forms and the thanks page.
- **Contact**: `[email address]`, `[phone number]`, `[Operating company]`,
  `[registered address]` in the footer.

## Brand

Renamed from MX-5 Cup Great Britain to the **MX-5 Mk4 Trophy**.

The palette is sampled off the logo artwork rather than guessed:

| Token | Value | Role |
|---|---|---|
| `--yellow` | `#FFD400` | action: buttons, links, next round, ticker |
| `--red` | `#E8253D` | emphasis on dark, as MK4 is in the logo |
| `--red-ink` | `#C9102E` | the artwork's own darker red, for light bands |
| `--tarmac` | `#0D0C0F` | the badge black |
| `--cream` | `#F6F1E7` | the logo off-white |
| `--grit` / `--grit-2` | `#A7A49A` / `#6B6860` | the logo greys, dark and light |

The split follows the logo itself: yellow does the work, red does the
shouting. The amber from the old identity is gone.

Logo files in `assets/brand/`:

```
lockup-on-dark.webp    nav and footer, cream MX-5 with red MK4
lockup-on-light.webp   for the concrete bands
lockup-mono.webp       single line, dark artwork, light grounds only
lockup-stacked.webp    TROPHY set large
badge-dark.png         pennant badge, dark body
badge-light.png        pennant badge, light body
```

## Assets still needed

- **Better partner artwork.** `assets/brand/partners/` currently holds
  `thermal-road-repairs.png` (1749x630) and `ad-modular.png` (300x147)
  were pulled from each partner's own website. They render well, but ask
  both for their brand pack: a vector beats a scraped web PNG. Each tile
  links out to the partner's site.

  **Goodyear is the championship tyre partner**, replacing Michelin.
  There are two Goodyear files and they are not interchangeable:

  - `goodyear-blue.png` is the official yellow-on-blue lockup. It carries
    its own ground, so it is the one to use anywhere light. Both the
    partner bar and the homepage wall use it.
  - `goodyear.svg` is the plain wordmark, their official 2025 vector.
    Goodyear's current identity is a single yellow with no dark variant,
    so this one only works on a dark ground. Currently unused, kept for
    when something dark needs it.

  **The BRSCC is not in the partner bar.** They sanction the championship
  rather than sponsor it, and their only published artwork is reversed
  white, which cannot sit on the white bar. They already appear in the
  footer and under the hero, both on dark.
  Tile sizing is optical, not mechanical: the default cap is 52px tall,
  `.is-wide` drops a wide mark to 44px and `.is-tall` lifts a squarer one
  to 62px, so every logo carries the same visual weight rather than the
  same measurement.
- Photography into `assets/img/`, then replace the three `.imgph`
  blocks in `#media` and the one in `#car`. Each has a comment above it
  with the markup to use.
- A 1200x630 `assets/brand/og-image.png` for link previews.
- **BRSCC logo permission.** `assets/brand/brscc-logo.png` was taken from
  brscc.co.uk. It is the reversed (white) version, which is why it only
  appears on the dark hero and footer, never on the concrete bands. Ask
  the BRSCC for their media pack: they will have a vector and usage
  rules, and you want their nod before this goes live. It is placed as a
  sanctioning credential, deliberately kept out of the partner wall,
  since the BRSCC is the club you race under rather than a commercial
  partner.
- **A reversed single-line lockup.** The nav and footer use
  `lockup-on-dark.webp`, which is roughly 2.5:1. In a nav bar that
  squeezes the TROPHY sub-line down to a few pixels, so the bar had to
  grow from 70px to 82px to keep it legible. `lockup-mono.webp` has the
  right proportions for a nav at about 5.5:1, but it is dark artwork and
  cannot sit on the dark bar. A reversed version of that horizontal
  lockup would let the nav shrink back and read better. Vectors of all
  of them would be better again.

## Domain

`mx5cupgb.co.uk` is a placeholder in the canonical tag, the Open Graph
tags, `robots.txt`, `sitemap.xml` and the JSON-LD, 11 references in all.

It is now doubly wrong: the championship is the **MX-5 Mk4 Trophy**, so
the old Cup GB name no longer matches. Decide the real domain before
launch and all 11 can be swapped in one pass.

## Deploying

Netlify, connected to a Git repo. Publish directory is the repo root
and there is no build command, so `netlify.toml` is already correct.
