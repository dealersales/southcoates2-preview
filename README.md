# Southcoates2 — pre-launch preview

A static snapshot of the `southcoates2` rebuild for **Southcoates Car Sales** (Hull), taken for review
before it replaces the live site at southcoatescarsales.co.uk.

- **The site:** https://dealersales.github.io/southcoates2-preview/
- **What's left:** https://dealersales.github.io/southcoates2-preview/progress/

## What this is, and what it isn't

The build is PHP. GitHub Pages serves static files, so this is a **crawl of the real build** with its URLs
rewritten to clean static paths — the pages, layout and copy are genuine.

Not connected in this preview, and only for that reason:

- **Enquiry forms** do nothing — the lead endpoint is server-side and stubbed for testing.
- **The finance calculator** on vehicle pages is blank — the CodeWeavers widget validates against its own
  domain, and this isn't it.
- **Stock is a snapshot**, not live. It reflects the feed at the time the snapshot was taken.

The preview is `noindex` with a `robots.txt` that disallows everything, so it can't compete with the real
site in search while it is being reviewed.

## State of play

`progress/` carries one row per finding from the QA audit: reference, owner (Paul / Mike / Jon), state and
what proved it. Nothing in the snapshot is deployed — the work sits in a local copy of the build plus a
reference patch, verified against a running Apache with 45 checks passing.

Regenerate with `tools/build_preview.py` and `tools/build_progress_page.py` in the QA folder.
