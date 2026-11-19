# Ajju's Portfolio — Sheik Abdul Azeez

Personal portfolio website built from my resume using plain HTML, CSS and JavaScript (no build tools needed).

## How to open it
- Double-click `index.html` to open it in your browser, **or**
- In VS Code, install the **Live Server** extension → right-click `index.html` → **Open with Live Server** (auto-reloads as you edit).

## Folder structure
```
Ajju's Portfolio/
├── index.html          → page content (edit text here)
├── css/style.css       → colours, fonts, layout
├── js/script.js        → interactions + skills / terminal data
├── assets/Sheik_Abdul_Azeez_Resume.pdf
└── README.md
```

## Features
- Dark / light theme toggle (remembers your choice) — shortcut: **T**
- Typing animation of job titles in the hero
- Live "service desk" ticket simulator (New → In Progress → Resolved)
- Animated counters and progress rings for SLA 98.7%, FCR 97%, CSAT 96%
- Interactive "How I handle a ticket" stepper (auto-plays, clickable)
- Experience & education timeline
- Skills grid with category filters and live search
- 3D tilt cards and magnetic buttons
- Interactive terminal — try `help`, `whoami`, `stats`, `ping azeez`, `ipconfig`, `tracert`, `chess`, `hire` (shortcut: **/**)
- Contact form with validation (opens your email app pre-filled), copy-to-clipboard for email/phone, WhatsApp link
- Resume download button, scroll progress bar, active-section nav, back-to-top button
- Fully responsive (mobile menu) and respects "reduce motion" settings

## Easy edits
- **Change accent colour:** `css/style.css` → `--accent` under `[data-theme="dark"]` and `[data-theme="light"]`
- **Add/remove skills:** `js/script.js` → `SKILLS` list
- **Add terminal commands:** `js/script.js` → `COMMANDS`
- **Add a photo:** put it in `assets/` and add an `<img>` in the hero section of `index.html`

## Publishing (free)
Upload the folder to GitHub and enable **GitHub Pages**, or drag the folder onto **Netlify Drop** (app.netlify.com/drop).
