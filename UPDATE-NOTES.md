# KR4BJN responsive refresh

Based on repository commit f433cf8 (add article for 1st 30m dipole deployment).

## Install

Back up your current site, then copy the contents of this folder into your repository, preserving the folder structure. Commit and deploy through your normal process. No build step, npm install, or additional runtime dependency is needed. CNAME and existing images are included unchanged. Nothing has been pushed or published.

The changed site files are all six index.html files, all three stylesheets, and scripts/main.js, about.js, keyer.js, cw-legend.js, and pota.js. Other files are included for convenience.

## Changes

- Preserved the navy/charcoal palette, serif headings, station identity, photographs, articles, existing resources and page structure.
- Added consistent spacing, restrained cards, responsive photographs, flexible video embeds, readable article widths, and a responsive footer.
- Added a mobile menu with current-page indication, Escape support, and navigation that stays available when JavaScript is disabled.
- Added skip links, focus indicators, named navigation landmarks, labeled iframe embeds, native buttons for dialogs, and reduced-motion support.
- Made CW paddles and character playback usable by keyboard and touch. Replaced unsupported custom range inputs with native labeled sliders and displayed values. Native waveform choices retain saved settings. Resumed suspended audio on interaction and prevented a zero-volume audio exception.
- Replaced automatically changing Scripture with a visitor-controlled Another passage button.
- Made entire equipment/interest/club names clickable instead of tiny icons. Added visible, named social links that work without icon downloads.
- Fixed shared JavaScript errors caused by absent dialogs and added POTA empty/error states.
- Added direct links beside third-party statistics and log embeds.

## Validation

- Browser checks across all six pages at 320, 390, 768, and 1440px: no horizontal page overflow and no uncaught JavaScript errors.
- Checked mobile menu toggle/Escape, condition dialog open/Escape, keyboard CW input, zero-volume playback, waveform selection, all 46 character buttons, and POTA success/error states.
- Automated axe-core WCAG 2 A/AA and 2.1 AA scan of all six host pages: zero violations.
- JavaScript syntax and git whitespace checks passed.
- Reviewed desktop and mobile homepage screenshots.

Third-party iframe contents are controlled by their providers and were not accessibility-audited. External live data availability, videos and production hosting should be checked after deployment. QRZ/POTA embedded pages may have their own fixed layouts; the direct links provide an alternative. These checks do not establish complete WCAG conformance or replace testing with assistive technology and real devices.
