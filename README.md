# Graduation Invitation Terminal

A polished graduation invitation experience built as an interactive terminal-style landing page.

## What it does

- Uses a whitelist stored in `config/guests.json`.
- Maps the URL parameter `?to=<slug>` to a guest record.
- Displays a personalized invitation card with:
  - guest position/title
  - guest category
  - event details
- Runs an animated terminal boot sequence before showing the invitation.

## Why it stands out

- Interactive terminal UI with typing effects and command panel
- Offline-ready font support via local `assets/fonts/`
- Secure guest access using slug-based whitelist validation
- WhatsApp integration for help and RSVP commands

## Try it

1. Open `index.html` in a browser.
2. Add a guest slug in the URL, for example:

```text
index.html?to=zit
```

3. The invitation card appears after the boot sequence if the slug is valid.

## Project structure

- `index.html` — page layout
- `style.css` — visual design and local font setup
- `script/` — app logic and terminal interactions
- `config/` — guest data, commands, and boot config
- `assets/fonts/` — offline font files for the UI

## Run locally

Just open `index.html` in a browser, or use a simple local server:

```bash
npx http-server -p 8080
```

Then visit:

```text
http://localhost:8080/index.html?to=zit
```
