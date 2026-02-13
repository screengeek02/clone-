# Auto Repair Marketing Site Template

This project is a mobile-first, responsive website template for a local auto repair shop.

## Project structure

```text
/site
  index.html
  /pages
    location.html
    services.html
    contact.html
    appointment-request.html
  /assets
    /css/styles.css
    /js/main.js
    /img
```

## Run locally

Because this is plain HTML/CSS/JS, you can open `site/index.html` directly, but using a local server is recommended.

### Option 1: Python

```bash
cd site
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

### Option 2: VS Code Live Server

1. Open this folder in VS Code.
2. Right-click `site/index.html`.
3. Choose **Open with Live Server**.

## Notes

- Forms use front-end validation only (no backend).
- Replace placeholder text, branding, and contact details with real business data.
