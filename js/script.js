/* =========================================================
   Sheik Abdul Azeez — Portfolio interactions
   ========================================================= */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Data (from resume) ---------- */
  const PROFILE = {
    name: "Sheik Abdul Azeez",
    title: "L1 Technical Support | IT Support | Service Desk",
    location: "Hyderabad, India",
    email: "azeezsheik7867@gmail.com",
    phone: "+91 7013894186",
    linkedin: "https://linkedin.com/in/sheik-abdul-azeez",
  };

  const SKILLS = [
    { name: "Windows 10/11", cat: "os", icon: "🪟" },
    { name: "macOS", cat: "os", icon: "🍎" },
    { name: "ChromeOS", cat: "os", icon: "🌐" },
    { name: "Basic Linux (Ubuntu)", cat: "os", icon: "🐧" },
    { name: "TCP/IP", cat: "network", icon: "🔌" },
    { name: "DNS", cat: "network", icon: "📡" },
    { name: "DHCP", cat: "network", icon: "🔢" },
    { name: "VPN Troubleshooting", cat: "network", icon: "🔐" },
    { name: "ipconfig / ping / tracert / nslookup", cat: "network", icon: "⌨️" },
    { name: "Jira (1.5 years)", cat: "itsm", icon: "📋" },
    { name: "ServiceNow (5 months)", cat: "itsm", icon: "🎫" },
    { name: "Ticket Escalation", cat: "itsm", icon: "⬆️" },
    { name: "SLA Management", cat: "itsm", icon: "⏱️" },
    { name: "Remote Desktop (RDP)", cat: "itsm", icon: "🖥️" },
    { name: "AnyDesk", cat: "itsm", icon: "🛰️" },
    { name: "Active Directory", cat: "identity", icon: "👥" },
    { name: "Microsoft 365", cat: "identity", icon: "☁️" },
    { name: "MS Excel", cat: "identity", icon: "📊" },
    { name: "Application Support", cat: "other", icon: "🧩" },
    { name: "Root Cause Analysis", cat: "other", icon: "🔍" },
    { name: "MySQL (basic)", cat: "other", icon: "🗄️" },
    { name: "IT Asset Management (basic)", cat: "other", icon: "📦" },
  ];

  const CAT_LABEL = {
    os: "Operating Systems",
    network: "Networking",
    itsm: "ITSM & Remote Tools",
    identity: "Identity & M365",
    other: "Support & Data",
  };

  /* ---------- Year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const storedTheme = (() => { try { return localStorage.getItem("theme"); } catch { return null; } })();
  if (storedTheme) root.dataset.theme = storedTheme;
  else if (window.matchMedia("(prefers-color-scheme: light)").matches) root.dataset.theme = "light";

  const toggleTheme = () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
    return next;
  };
  $("#themeToggle").addEventListener("click", toggleTheme);

  /* ---------- Toast ---------- */
  let toastTimer;
  const toast = (msg) => {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2400);
  };

  /* ---------- Nav: scroll state, progress, back-to-top ---------- */
  const nav = $("#nav");
  const progress = $("#scrollProgress");
  const toTop = $("#toTop");
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    nav.classList.toggle("is-scrolled", y > 20);
    toTop.classList.toggle("is-visible", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Mobile menu ---------- */
  const hamburger = $("#hamburger");
  const menu = $("#navMenu");
  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    hamburger.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
  };
  hamburger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  $$(".nav__link").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Active nav link ---------- */
  const links = $$(".nav__link");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("main section[id]").forEach((s) => sectionObserver.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("is-visible");
        revealObserver.unobserve(el);
        // clear the stagger delay so hover effects stay snappy afterwards
        setTimeout(() => { el.style.transitionDelay = ""; }, 1400);
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el, i) => {
    // stagger siblings slightly
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 80}ms`;
    revealObserver.observe(el);
  });

  /* ---------- Typing effect ---------- */
  const roles = [
    "L1 Technical Support",
    "IT Support Specialist",
    "Service Desk Analyst",
    "Windows · macOS · ChromeOS",
    "Jira & ServiceNow",
    "DNS · DHCP · VPN troubleshooter",
  ];
  const typedEl = $("#typed");
  if (reduceMotion) {
    typedEl.textContent = roles[0];
  } else {
    let r = 0, c = 0, deleting = false;
    const tick = () => {
      const word = roles[r];
      typedEl.textContent = word.slice(0, c);
      if (!deleting && c < word.length) { c++; setTimeout(tick, 70); }
      else if (!deleting && c === word.length) { deleting = true; setTimeout(tick, 1600); }
      else if (deleting && c > 0) { c--; setTimeout(tick, 35); }
      else { deleting = false; r = (r + 1) % roles.length; setTimeout(tick, 300); }
    };
    tick();
  }

  /* ---------- Live ticket simulator ---------- */
  const TICKETS = [
    { title: "VPN not connecting from home", cat: "Network", pri: "P3",
      log: ["Verified credentials & MFA", "Flushed DNS: ipconfig /flushdns", "Re-installed VPN profile", "User connected ✓"] },
    { title: "Password reset: account locked", cat: "Access", pri: "P2",
      log: ["Verified user identity", "Unlocked account in Active Directory", "Issued temporary password", "User signed in ✓"] },
    { title: "Outlook not syncing emails", cat: "Microsoft 365", pri: "P3",
      log: ["Checked M365 service health", "Connected via AnyDesk", "Rebuilt Outlook profile", "Mail syncing ✓"] },
    { title: "Website not loading: DNS error", cat: "Network", pri: "P3",
      log: ["Ran nslookup on the domain", "Found wrong DNS server from DHCP", "Renewed lease: ipconfig /renew", "Site reachable ✓"] },
    { title: "Shared drive access request", cat: "Access", pri: "P4",
      log: ["Validated manager approval", "Added user to AD security group", "Asked user to sign out/in", "Access confirmed ✓"] },
    { title: "Laptop very slow after update", cat: "Windows 11", pri: "P3",
      log: ["Took remote session via RDP", "Checked startup apps & disk", "Cleared temp files, reverted driver", "Performance normal ✓"] },
  ];
  const tEls = {
    id: $("#ticketId"), status: $("#ticketStatus"), title: $("#ticketTitle"),
    cat: $("#ticketCat"), bar: $("#ticketBar"), log: $("#ticketLog"), resolved: $("#resolvedToday"),
  };
  let tIndex = 0, resolvedCount = 27, ticketNo = 10421;
  const setStatus = (state, label) => { tEls.status.dataset.state = state; tEls.status.textContent = label; };
  const addLog = (text) => {
    const li = document.createElement("li");
    li.textContent = text;
    tEls.log.appendChild(li);
    while (tEls.log.children.length > 4) tEls.log.firstChild.remove();
  };
  const runTicket = () => {
    const t = TICKETS[tIndex % TICKETS.length];
    tIndex++;
    ticketNo += Math.floor(Math.random() * 40) + 7;
    tEls.id.textContent = `INC00${ticketNo}`;
    tEls.title.textContent = t.title;
    tEls.cat.textContent = `Category: ${t.cat} · Priority: ${t.pri}`;
    tEls.log.innerHTML = "";
    tEls.bar.style.width = "8%";
    setStatus("new", "New");

    const steps = t.log.length;
    let i = 0;
    const step = () => {
      if (i === 0) setStatus("progress", "In Progress");
      addLog(t.log[i]);
      i++;
      tEls.bar.style.width = `${8 + (i / steps) * 92}%`;
      if (i < steps) {
        setTimeout(step, 1100);
      } else {
        setStatus("resolved", "Resolved");
        resolvedCount++;
        tEls.resolved.textContent = resolvedCount;
        setTimeout(runTicket, 2400);
      }
    };
    setTimeout(step, 1000);
  };
  tEls.resolved.textContent = resolvedCount;
  runTicket();

  /* ---------- 3D tilt ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    $$(".tilt").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });

    // Magnetic buttons
    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------- Counters + rings ---------- */
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = reduceMotion ? 0 : 1800;
    const start = performance.now();
    const frame = (now) => {
      const p = duration ? Math.min((now - start) / duration, 1) : 1;
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  const CIRC = 2 * Math.PI * 52;
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$(".counter", entry.target).forEach(animateCounter);
        $$(".ring__fg", entry.target).forEach((ring) => {
          const pct = parseFloat(ring.dataset.percent);
          ring.style.strokeDashoffset = String(CIRC * (1 - pct / 100));
        });
        statsObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );
  statsObserver.observe($("#stats"));

  /* ---------- Ticket process stepper ---------- */
  const PROCESS = [
    { h: "Log & prioritise", p: "Capture the issue clearly in Jira or ServiceNow, set category and priority, and confirm the user's details so nothing is lost." },
    { h: "Diagnose with structure", p: "Reproduce the issue, check the obvious first, then work through the layers: OS, application, network (ipconfig, ping, tracert, nslookup) and access." },
    { h: "Resolve on first contact", p: "Fix it live whenever possible, over RDP or AnyDesk, with AD and M365 resets, or by reconfiguring settings. That's how I keep first-call resolution at 97%." },
    { h: "Escalate with clear notes", p: "When an issue needs L2, I escalate inside SLA with steps tried, logs and findings, so the next engineer doesn't start from zero." },
    { h: "Prevent the repeat", p: "Spot recurring issues, run root cause analysis and document the solution, which cuts repeat tickets for the whole team." },
  ];
  const detail = $("#processDetail");
  const steps = $$(".process__step");
  let processIdx = 0, processTimer;
  const showStep = (i) => {
    processIdx = i;
    steps.forEach((s, j) => s.classList.toggle("is-active", j === i));
    detail.classList.remove("is-swapping");
    void detail.offsetWidth; // restart animation
    detail.classList.add("is-swapping");
    detail.innerHTML = `<h4>${PROCESS[i].h}</h4><p>${PROCESS[i].p}</p>`;
  };
  const autoplay = () => {
    clearInterval(processTimer);
    if (!reduceMotion) processTimer = setInterval(() => showStep((processIdx + 1) % PROCESS.length), 4500);
  };
  steps.forEach((s) => s.addEventListener("click", () => { showStep(+s.dataset.step); autoplay(); }));
  showStep(0);
  autoplay();

  /* ---------- Skills: render, filter, search ---------- */
  const grid = $("#skillsGrid");
  grid.innerHTML = SKILLS.map(
    (s) => `<div class="skill" data-cat="${s.cat}" data-name="${s.name.toLowerCase()}">
      <span class="skill__icon">${s.icon}</span>
      <div><div class="skill__name">${s.name}</div><div class="skill__cat">${CAT_LABEL[s.cat]}</div></div>
    </div>`
  ).join("");
  const skillEls = $$(".skill", grid);
  let activeFilter = "all";
  const applySkills = () => {
    const q = $("#skillSearch").value.trim().toLowerCase();
    let shown = 0;
    skillEls.forEach((el, i) => {
      const match = (activeFilter === "all" || el.dataset.cat === activeFilter) && (!q || el.dataset.name.includes(q) || CAT_LABEL[el.dataset.cat].toLowerCase().includes(q));
      el.classList.toggle("is-hidden", !match);
      if (match) {
        el.classList.remove("pop-in");
        void el.offsetWidth;
        el.style.animationDelay = `${shown * 35}ms`;
        el.classList.add("pop-in");
        shown++;
      }
    });
    $("#skillsEmpty").hidden = shown !== 0;
  };
  $$(".filter").forEach((btn) =>
    btn.addEventListener("click", () => {
      $$(".filter").forEach((b) => b.classList.toggle("is-active", b === btn));
      activeFilter = btn.dataset.filter;
      applySkills();
    })
  );
  $("#skillSearch").addEventListener("input", applySkills);
  // spotlight hover effect
  grid.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".skill");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });

  /* ---------- Copy buttons ---------- */
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    }
  };
  $$(".copy-btn").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const ok = await copyText(btn.dataset.copy);
      if (!ok) return toast("Couldn't copy, please select it manually");
      btn.textContent = "Copied!";
      btn.classList.add("is-copied");
      toast(`Copied: ${btn.dataset.copy}`);
      setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("is-copied"); }, 1800);
    })
  );

  /* ---------- Contact form (mailto) ---------- */
  const form = $("#contactForm");
  const msg = $("#cfMsg");
  msg.addEventListener("input", () => { $("#cfCount").textContent = `${msg.value.length} / 1000`; });
  const validators = {
    cfName: (v) => v.trim().length > 1,
    cfEmail: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    cfMsg: (v) => v.trim().length > 4,
  };
  Object.keys(validators).forEach((id) => {
    $(`#${id}`).addEventListener("input", (e) => {
      if (validators[id](e.target.value)) e.target.closest(".field").classList.remove("has-error");
    });
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    Object.entries(validators).forEach(([id, fn]) => {
      const ok = fn($(`#${id}`).value);
      $(`#${id}`).closest(".field").classList.toggle("has-error", !ok);
      if (!ok) valid = false;
    });
    if (!valid) return toast("Please fix the highlighted fields");

    const name = $("#cfName").value.trim();
    const email = $("#cfEmail").value.trim();
    const topic = $("#cfTopic").value;
    const subject = `${topic}: from ${name}`;
    const body = `${msg.value.trim()}\n\n${name}\n${email}`;
    window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast("Opening your email app…");
    form.reset();
    $("#cfCount").textContent = "0 / 1000";
  });

  /* ---------- Interactive terminal ---------- */
  const termBody = $("#termBody");
  const termOut = $("#termOutput");
  const termIn = $("#termInput");
  const history = [];
  let hIdx = -1;

  const esc = (s) => s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const print = (html = "") => {
    const div = document.createElement("div");
    div.className = "term-line";
    div.innerHTML = html;
    termOut.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
  };
  const printLines = async (lines, delay = 0) => {
    for (const l of lines) {
      print(l);
      if (delay && !reduceMotion) await new Promise((r) => setTimeout(r, delay));
    }
  };

  const COMMANDS = {
    help: {
      desc: "List available commands",
      run: () => {
        print('<span class="t-accent">Available commands:</span>');
        Object.entries(COMMANDS).forEach(([k, v]) => {
          if (!v.hidden) print(`  <span class="t-blue">${k.padEnd(12)}</span><span class="t-muted">${v.desc}</span>`);
        });
        print('<span class="t-muted">Tip: use ↑/↓ for history and Tab to autocomplete.</span>');
      },
    },
    whoami: {
      desc: "Who is Azeez?",
      run: () => printLines([
        `<span class="t-accent">${PROFILE.name}</span>`,
        `${PROFILE.title}`,
        `📍 ${PROFILE.location} · 2+ years in technical support at Genpact`,
      ]),
    },
    about: {
      desc: "Short profile",
      run: () => print("L1 Technical Support professional supporting end users across voice, chat and email. I troubleshoot Windows 10/11, macOS and ChromeOS, software, basic hardware and network issues, and I'm hands-on with Jira, ServiceNow, Active Directory, Microsoft 365, RDP and AnyDesk."),
    },
    experience: {
      desc: "Work history",
      run: () => printLines([
        '<span class="t-accent">Process Associate, Technical Support Services</span> @ Genpact',
        '<span class="t-muted">Jul 2024 – Present</span>',
        "  • L1 support via voice, chat & email: 30–50+ tickets/day",
        "  • Windows/macOS/ChromeOS, DNS, DHCP & VPN troubleshooting",
        "  • Ticket lifecycle in Jira & ServiceNow; escalations to L2",
        "  • AD password resets & M365 access requests",
        "  • Remote support with RDP & AnyDesk; RCA on recurring issues",
      ]),
    },
    stats: {
      desc: "Performance metrics",
      run: () => {
        const bar = (pct) => {
          const filled = Math.round(pct / 5);
          return `<span class="t-accent">${"█".repeat(filled)}</span><span class="t-muted">${"░".repeat(20 - filled)}</span>`;
        };
        return printLines([
          `SLA compliance       ${bar(98.7)} <span class="t-accent">98.7%</span>`,
          `First-call resolve   ${bar(97)} <span class="t-accent">97%</span>`,
          `Customer sat (CSAT)  ${bar(96)} <span class="t-accent">96%</span>`,
          `Tickets / day        <span class="t-yellow">30–50+</span>`,
        ], 120);
      },
    },
    skills: {
      desc: "Technical skills by category",
      run: () => {
        Object.entries(CAT_LABEL).forEach(([k, label]) => {
          print(`<span class="t-blue">[${label}]</span> ${SKILLS.filter((s) => s.cat === k).map((s) => s.name).join(", ")}`);
        });
      },
    },
    education: {
      desc: "Education",
      run: () => printLines([
        '<span class="t-accent">Bachelor of Computer Applications (BCA)</span>, 2021 – 2024',
        "Aditya Degree College, Amalapuram (Adikavi Nannaya University)",
      ]),
    },
    certs: {
      desc: "Certifications",
      run: () => printLines([
        "🏅 Google IT Support Professional Certificate: Coursera",
        "🏅 Networking Basics: Cisco Networking Academy",
        "🏅 Microsoft Learn (IT Support & Fundamentals): Microsoft",
      ]),
    },
    contact: {
      desc: "How to reach me",
      run: () => printLines([
        `✉️  <a href="mailto:${PROFILE.email}">${PROFILE.email}</a>`,
        `📞 <a href="tel:+917013894186">${PROFILE.phone}</a>`,
        `🔗 <a href="${PROFILE.linkedin}" target="_blank" rel="noopener">linkedin.com/in/sheik-abdul-azeez</a>`,
      ]),
    },
    resume: {
      desc: "Download my resume (PDF)",
      run: () => {
        print('<span class="t-accent">Downloading resume…</span>');
        const a = document.createElement("a");
        a.href = "assets/Sheik_Abdul_Azeez_Resume.pdf";
        a.download = "Sheik_Abdul_Azeez_Resume.pdf";
        document.body.appendChild(a); a.click(); a.remove();
      },
    },
    ping: {
      desc: "ping azeez: check if I'm available",
      run: async (args) => {
        const host = args[0] || "azeez";
        print(`Pinging ${esc(host)}.hire.me [10.0.0.7] with 32 bytes of data:`);
        for (let i = 0; i < 4; i++) {
          await new Promise((r) => setTimeout(r, reduceMotion ? 0 : 450));
          const ms = Math.floor(Math.random() * 8) + 2;
          print(`Reply from 10.0.0.7: bytes=32 time=${ms}ms TTL=64 <span class="t-accent">status=available</span>`);
        }
        print('<span class="t-accent">Packets: Sent = 4, Received = 4, Lost = 0 (0% loss). Ready to join your team ✓</span>');
      },
    },
    ipconfig: {
      desc: "Show 'network' configuration",
      run: () => printLines([
        "Windows IP Configuration",
        "",
        "Ethernet adapter Career:",
        "   Connection-specific DNS Suffix  . : <span class=\"t-blue\">genpact.support</span>",
        "   IPv4 Address. . . . . . . . . . . : <span class=\"t-accent\">2.0.24.7</span>  (2+ yrs, 24x7 mindset)",
        "   Subnet Mask . . . . . . . . . . . : 255.255.255.0",
        "   Default Gateway . . . . . . . . . : <span class=\"t-yellow\">your-team.local</span>",
        "   DHCP Lease Expires. . . . . . . . : 1-month notice",
      ], 60),
    },
    nslookup: {
      desc: "nslookup azeez",
      run: () => printLines([
        "Server:  dns.portfolio.local",
        "Address: 10.0.0.1",
        "",
        "Name:    sheik-abdul-azeez.it-support",
        `Address: <span class="t-accent">${PROFILE.location}</span>`,
      ]),
    },
    tracert: {
      desc: "Trace my career route",
      run: () => printLines([
        "Tracing route to dream-job [L2 / IT Support]",
        "  1    <span class=\"t-muted\">2021</span>   BCA @ Aditya Degree College",
        "  2    <span class=\"t-muted\">2024</span>   Graduated (Adikavi Nannaya University)",
        "  3    <span class=\"t-muted\">2024</span>   Process Associate @ Genpact",
        "  4    <span class=\"t-muted\">2025</span>   Jira + ServiceNow + AD + M365",
        "  5    <span class=\"t-accent\">next</span>   * * *  your company?",
        "Trace complete.",
      ], 220),
    },
    chess: {
      desc: "A little about my other passion",
      run: () => printLines([
        "  ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜",
        "  ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟",
        "  · · · · · · · ·",
        "  · · · · ♙ · · ·",
        "  ♙ ♙ ♙ ♙ · ♙ ♙ ♙",
        "  ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖",
        '<span class="t-accent">1. e4</span>: District-level chess winner. Troubleshooting is just chess with tickets:',
        "read the position, rule out the bad moves, then play the best one.",
      ], 60),
    },
    theme: {
      desc: "Toggle light / dark theme",
      run: () => print(`Theme switched to <span class="t-accent">${toggleTheme()}</span>.`),
    },
    date: {
      desc: "Show date & time",
      run: () => print(new Date().toString()),
    },
    sudo: {
      desc: "",
      hidden: true,
      run: () => print('<span class="t-red">Access denied.</span> Nice try 😄 A ticket has been raised with L2.'),
    },
    hire: {
      desc: "The best command",
      run: () => {
        print('<span class="t-accent">Great choice!</span> Taking you to the contact form…');
        setTimeout(() => $("#contact").scrollIntoView({ behavior: "smooth" }), 600);
      },
    },
    clear: {
      desc: "Clear the terminal",
      run: () => { termOut.innerHTML = ""; },
    },
  };
  COMMANDS.cls = { ...COMMANDS.clear, hidden: true };

  let busy = false;
  const execute = async (raw) => {
    const input = raw.trim();
    print(`<span class="prompt">visitor@azeez:~$</span> <span class="cmd">${esc(input)}</span>`);
    if (!input) return;
    history.unshift(input);
    hIdx = -1;
    const [cmd, ...args] = input.split(/\s+/);
    const entry = COMMANDS[cmd.toLowerCase()];
    if (!entry) {
      print(`<span class="t-red">'${esc(cmd)}' is not recognized as a command.</span> Type <span class="t-blue">help</span> to see what I can do.`);
      return;
    }
    busy = true;
    termIn.disabled = true;
    try { await entry.run(args); } finally {
      busy = false;
      termIn.disabled = false;
      termBody.scrollTop = termBody.scrollHeight;
    }
  };

  termIn.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      if (busy) return;
      const v = termIn.value;
      termIn.value = "";
      await execute(v);
      termIn.focus({ preventScroll: true });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (hIdx < history.length - 1) { hIdx++; termIn.value = history[hIdx]; }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIdx > 0) { hIdx--; termIn.value = history[hIdx]; } else { hIdx = -1; termIn.value = ""; }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const v = termIn.value.trim().toLowerCase();
      if (!v) return;
      const matches = Object.keys(COMMANDS).filter((k) => k.startsWith(v) && !COMMANDS[k].hidden);
      if (matches.length === 1) termIn.value = matches[0] + " ";
      else if (matches.length > 1) print(`<span class="t-muted">${matches.join("  ")}</span>`);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      termOut.innerHTML = "";
    }
  });
  termBody.addEventListener("click", () => { if (!window.getSelection().toString()) termIn.focus({ preventScroll: true }); });
  $$("#termChips button").forEach((b) =>
    b.addEventListener("click", async () => {
      if (busy) return;
      await execute(b.dataset.cmd);
      termIn.focus({ preventScroll: true });
    })
  );

  // Boot message
  printLines([
    '<span class="t-muted">Microsoft Windows [Version 10.0.22631] · azeez-portfolio v1.0</span>',
    `Welcome! I'm <span class="t-accent">${PROFILE.name}</span>, L1 Technical Support.`,
    'Type <span class="t-blue">help</span> to see available commands, or click a shortcut below.',
    "",
  ]);

  /* ---------- Keyboard shortcuts ---------- */
  document.addEventListener("keydown", (e) => {
    const tag = (e.target.tagName || "").toLowerCase();
    if (["input", "textarea", "select"].includes(tag) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "t" || e.key === "T") {
      const t = toggleTheme();
      toast(`${t === "dark" ? "🌙 Dark" : "☀️ Light"} theme`);
    } else if (e.key === "/") {
      e.preventDefault();
      $("#terminal").scrollIntoView({ behavior: "smooth" });
      setTimeout(() => termIn.focus({ preventScroll: true }), 500);
    } else if (e.key === "Escape") {
      setMenu(false);
    }
  });
})();
