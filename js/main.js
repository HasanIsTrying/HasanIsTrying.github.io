(() => {
  "use strict";

  const SITE = window.SITE;
  const PROJECTS = window.PROJECTS;
  // No prototype, so a link like #p/constructor can't match a built-in property.
  const byId = Object.assign(Object.create(null), Object.fromEntries(PROJECTS.map((p) => [p.id, p])));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobileQuery = window.matchMedia("(max-width: 820px)");

  /* ---------------- Icons for drawn covers ---------------- */
  const ICONS = {
    porthole: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><path d="M12 3v1.6M12 19.4V21M3 12h1.6M19.4 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M5.6 18.4l1.1-1.1M17.3 6.7l1.1-1.1"/><path d="M9.6 10.4 12 8l2.4 2.4M12 8v7.5"/>',
    shield: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><circle cx="12" cy="10" r="2"/><path d="M8.6 16c.8-1.8 2-2.7 3.4-2.7s2.6.9 3.4 2.7"/>',
    camera: '<rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6l1.5-2h5L16 6"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/><path d="M15 7h4v4"/>',
    doc: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
  };
  const PAUSE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>';
  const PLAY_SVG ='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>';
  const EXTERNAL_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const DOWNLOAD_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const MAIL_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const GITHUB_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>';
  const LINKEDIN_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.9c0-1.17-.02-2.68-1.63-2.68-1.64 0-1.89 1.28-1.89 2.6V21h-4V9.75Z"/></svg>';

  /* ---------------- Small helpers ---------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const host = (url) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  /** Only allow web, email, phone and relative links, never `javascript:` or `data:`. */
  function safeUrl(url) {
    const u = String(url || "").trim();
    if (!u) return "";
    if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
    if (!/^[a-z][a-z0-9+.-]*:/i.test(u) && !u.startsWith("//")) return u; // relative path like "resume.pdf"
    return "";
  }
  const safeColor = (c, fallback) => (/^#[0-9a-f]{3,8}$/i.test(c || "") ? c : fallback);

  function posterHTML(p) {
    const a = p.art || {};
    const icon = Object.hasOwn(ICONS, a.icon) ? ICONS[a.icon] : ICONS.code;
    return `<span class="poster" style="--c1:${safeColor(a.c1, "#222")};--c2:${safeColor(a.c2, "#888")}">
      <span class="poster-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">${icon}</svg></span>
    </span>`;
  }

  function mediaHTML(p) {
    const src = safeUrl(p.image);
    return src ? `<img src="${esc(src)}" alt="" loading="lazy" decoding="async" />` : posterHTML(p);
  }

  /** A project card. `isStatic` cards are decorative copies (no button, hidden from screen readers). */
  function cardEl(p, { clone = false, isStatic = false } = {}) {
    const el = document.createElement(isStatic ? "div" : "button");
    el.className = "card";
    el.dataset.id = p.id;
    if (!isStatic) {
      el.type = "button";
      el.setAttribute("aria-label", `${p.title}: ${p.tagline}`);
    }
    if (clone || isStatic) {
      el.setAttribute("aria-hidden", "true");
      el.tabIndex = -1;
    }
    const isLive = /live/i.test(p.badge || "");
    el.innerHTML = `
      <span class="card-media">${mediaHTML(p)}</span>
      <span class="card-shade"></span>
      ${p.badge ? `<span class="card-badge${isLive ? " live" : ""}">${esc(p.badge)}</span>` : ""}
      <span class="card-play">${PLAY_SVG}</span>
      <span class="card-info">
        <span class="card-title">${esc(p.title)}</span>
        <span class="card-tagline">${esc(p.tagline)}</span>
      </span>`;
    return el;
  }

  /* ---------------- About me ---------------- */
  document.querySelectorAll("[data-site]").forEach((el) => {
    el.textContent = SITE[el.dataset.site] || "";
  });
  document.querySelectorAll("[data-site-link]").forEach((el) => {
    const url = safeUrl(SITE[el.dataset.siteLink]);
    if (url) el.href = url;
    else el.remove();
  });
  // Clean every link/photo setting once, so unsafe values are simply hidden.
  for (const key of ["photo", "resume", "github", "linkedin"]) SITE[key] = safeUrl(SITE[key]);
  for (const p of PROJECTS) { p.live = safeUrl(p.live); p.code = safeUrl(p.code); }
  $("#year").textContent = new Date().getFullYear();
  document.title = `${SITE.name} · Portfolio`;

  $("#about-role").textContent = [SITE.role, SITE.location].filter(Boolean).join(" · ");
  $("#about-text").innerHTML = (SITE.about || []).map((t) => `<p>${esc(t)}</p>`).join("");

  if (SITE.photo) {
    const photo = $("#about-photo");
    photo.src = SITE.photo;
    photo.alt = `Photo of ${SITE.name}`;
    photo.hidden = false;
  }

  const actions = [];
  if (SITE.resume) actions.push(`<a class="btn btn-accent" href="${esc(SITE.resume)}" download>${DOWNLOAD_SVG} Download resume</a>`);
  if (SITE.email) actions.push(`<a class="btn btn-primary" href="mailto:${esc(SITE.email)}">${MAIL_SVG} Email me</a>`);
  actions.push(`<a class="btn btn-ghost" href="#projects">See my projects</a>`);
  $("#about-actions").innerHTML = actions.join("");

  function fillList(listId, cardId, items, render) {
    const list = items || [];
    if (!list.length) { $(cardId).remove(); return; }
    $(listId).innerHTML = list.map(render).join("");
  }
  fillList("#skills", "#skills-card", SITE.skills, (s) => `<li>${esc(s)}</li>`);
  const timelineItem = (e) => `
    <li>
      <span class="tl-when">${esc(e.when || "")}</span>
      <div>
        <strong>${esc(e.title || "")}</strong>
        ${e.place ? `<span class="tl-place">${esc(e.place)}</span>` : ""}
        ${e.text ? `<p>${esc(e.text)}</p>` : ""}
      </div>
    </li>`;
  fillList("#languages", "#languages-card", SITE.languages, (l) => `<li><strong>${esc(l.name)}</strong><span>${esc(l.level || "")}</span></li>`);
  fillList("#experience", "#experience-card", SITE.experience, timelineItem);
  fillList("#education", "#education-card", SITE.education, timelineItem);

  const contacts = [];
  if (SITE.email) contacts.push(["Email", `<a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>`]);
  if (SITE.phone) contacts.push(["Phone", `<a href="tel:${esc(SITE.phone.replace(/[^\d+]/g, ""))}">${esc(SITE.phone)}</a>`]);
  if (SITE.location) contacts.push(["Location", esc(SITE.location)]);
  // Show just the username; the label already says which site it is.
  const handle = (url) => host(url).split("/").filter(Boolean).pop();
  if (SITE.github) contacts.push(["GitHub", `<a href="${esc(SITE.github)}" target="_blank" rel="noopener">${GITHUB_SVG}${esc(handle(SITE.github))}</a>`]);
  if (SITE.linkedin) contacts.push(["LinkedIn", `<a href="${esc(SITE.linkedin)}" target="_blank" rel="noopener">${LINKEDIN_SVG}${esc(handle(SITE.linkedin))}</a>`]);
  if (SITE.resume) contacts.push(["Resume", `<a href="${esc(SITE.resume)}" download>${DOWNLOAD_SVG}Download PDF</a>`]);
  if (contacts.length) {
    $("#contact-list").innerHTML = contacts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  } else {
    $("#contact").remove();
  }

  /* ---------------- Nav ---------------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("solid", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Rotating projects row ---------------- */
  const rowsEl = $("#rows");
  const marquees = [];
  let detailOpen = false;
  let pressedCard = null;
  let restoringFocus = false; // true while focus returns to a card after closing a project

  const ROWS = window.ROWS || [{ title: "Projects", ids: PROJECTS.map((p) => p.id) }];
  ROWS.forEach((row, rowIndex) => {
    const items = row.ids.map((id) => byId[id]).filter(Boolean);
    if (!items.length) return;

    const section = document.createElement("section");
    section.className = "row";
    section.setAttribute("aria-label", row.title);
    section.innerHTML = `
      <div class="row-head">
        <h2 class="row-title">${esc(row.title)}<span>${items.length}</span></h2>
        <div class="row-controls">
          ${reducedMotion ? "" : `<button type="button" class="icon-btn" data-pause aria-pressed="false" aria-label="Pause rotation">${PAUSE_SVG}</button>`}
          <button type="button" class="icon-btn" data-dir="-1" aria-label="Scroll ${esc(row.title)} left">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button type="button" class="icon-btn" data-dir="1" aria-label="Scroll ${esc(row.title)} right">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
      <div class="row-viewport"><div class="row-track"></div></div>`;
    rowsEl.appendChild(section);

    marquees.push(createMarquee(section, items, rowIndex % 2 === 0 ? 1 : -1));
  });

  function createMarquee(section, items, direction) {
    const viewport = $(".row-viewport", section);
    const track = $(".row-track", section);
    const m = {
      offset: 0, setWidth: 0, step: 0,
      speed: reducedMotion ? 0 : 30 * direction, // px per second
      hover: false, focus: false, dragging: false, holdUntil: 0, tween: null,
      userPaused: false, onScreen: true,
    };

    function build() {
      const ratio = m.setWidth ? m.offset / m.setWidth : 0;
      track.innerHTML = "";
      items.forEach((p) => track.appendChild(cardEl(p)));
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      m.step = track.firstElementChild.offsetWidth + gap;
      m.setWidth = m.step * items.length;
      // Enough copies to always fill the screen while looping.
      const copies = Math.ceil((viewport.clientWidth + m.step) / m.setWidth) + 1;
      for (let c = 0; c < copies; c++) items.forEach((p) => track.appendChild(cardEl(p, { clone: true })));
      m.offset = ratio * m.setWidth;
      render();
    }

    function render() {
      m.offset = ((m.offset % m.setWidth) + m.setWidth) % m.setWidth;
      track.style.transform = `translate3d(${-m.offset}px,0,0)`;
    }

    m.tick = (dt) => {
      if (m.tween) {
        const t = Math.min(1, (performance.now() - m.tween.start) / m.tween.duration);
        const eased = 1 - Math.pow(1 - t, 3);
        m.offset = m.tween.from + (m.tween.to - m.tween.from) * eased;
        if (t >= 1) m.tween = null;
        render();
        return;
      }
      const paused = m.pressed || m.userPaused || !m.onScreen || m.hover || m.focus || m.dragging || detailOpen || performance.now() < m.holdUntil;
      if (!paused && m.speed) {
        m.offset += m.speed * dt;
        render();
      }
    };

    m.nudge = (dir) => {
      const visibleCards = Math.max(1, Math.floor(viewport.clientWidth / m.step) - 1);
      // Slide by a screenful, then keep rotating (no extra pause).
      m.tween = { from: m.offset, to: m.offset + dir * m.step * visibleCards, start: performance.now(), duration: 650 };
      m.holdUntil = 0;
    };
    m.build = build;

    // Pause while the mouse is over the row or a card has keyboard focus.
    viewport.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") m.hover = true; });
    viewport.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") m.hover = false; });
    section.addEventListener("focusin", (e) => {
      // Only hold still for keyboard users on a card; clicking the pause/arrow buttons shouldn't freeze it.
      const card = e.target.closest(".row-viewport .card");
      m.focus = !!card && !restoringFocus && card.matches(":focus-visible");
      if (m.focus) {
        const r = card.getBoundingClientRect();
        const vr = viewport.getBoundingClientRect();
        if (r.left < vr.left + 20 || r.right > vr.right - 20) {
          m.offset += r.left - vr.left - (vr.width - r.width) / 2;
          render();
        }
      }
    });
    section.addEventListener("focusout", () => { m.focus = false; });

    section.querySelectorAll(".row-controls [data-dir]").forEach((b) =>
      b.addEventListener("click", () => m.nudge(Number(b.dataset.dir)))
    );

    // Pause / play button, so touch and keyboard users can stop the motion too.
    const pauseBtn = $("[data-pause]", section);
    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        m.userPaused = !m.userPaused;
        m.holdUntil = 0; // resume means resume now
        if (m.userPaused) m.tween = null; // pause means stop now, even mid-slide
        pauseBtn.setAttribute("aria-pressed", String(m.userPaused));
        pauseBtn.setAttribute("aria-label", m.userPaused ? "Resume rotation" : "Pause rotation");
        pauseBtn.innerHTML = m.userPaused ? PLAY_SVG : PAUSE_SVG;
      });
    }

    // Don't animate while the row is scrolled out of view.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => { m.onScreen = entry.isIntersecting; }).observe(viewport);
    }

    // Drag / swipe to scroll.
    let startX = 0, startOffset = 0, pointerId = null, moved = false, suppressClickUntil = 0;
    viewport.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      pointerId = e.pointerId; startX = e.clientX; startOffset = m.offset; moved = false;
      m.tween = null;
      // Hold the row still while pressed, and remember the card in case it slides away before release.
      m.pressed = true;
      pressedCard = e.target.closest(".card[data-id]");
    });
    viewport.addEventListener("pointermove", (e) => {
      if (e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true; m.dragging = true;
        viewport.classList.add("dragging");
        viewport.setPointerCapture(pointerId);
      }
      if (moved) { m.offset = startOffset - dx; render(); }
    });
    const endDrag = (e) => {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      m.pressed = false;
      if (moved) {
        pressedCard = null;
        m.dragging = false;
        m.holdUntil = performance.now() + 2500;
        viewport.classList.remove("dragging");
        suppressClickUntil = performance.now() + 120;
      }
    };
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    // Released outside the row: make sure it starts moving again.
    window.addEventListener("pointerup", () => { m.pressed = false; });
    // Swallow the click that follows a drag so it doesn't open a card.
    viewport.addEventListener("click", (ev) => {
      if (performance.now() < suppressClickUntil) { ev.stopPropagation(); ev.preventDefault(); }
    }, { capture: true });

    build();
    return m;
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    marquees.forEach((m) => m.tick(dt));
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => marquees.forEach((m) => m.build()), 150);
  });

  rowsEl.addEventListener("click", (e) => {
    const card = e.target.closest(".card[data-id]") || (e.target.closest(".row-viewport") ? pressedCard : null);
    pressedCard = null;
    if (card) openDetail(card.dataset.id, card);
  });

  /* ---------------- Detail view ---------------- */
  const detail = $("#detail");
  const shell = $(".detail-shell", detail);
  const slot = $("#detail-slot");
  const stageFrame = $("#stage-frame");
  const stage = $("#detail-stage");
  const order = PROJECTS.map((p) => p.id);
  let currentId = null;
  let awayCard = null;
  let lastFocus = null;
  let animating = false;

  function fillDetail(id) {
    const p = byId[id];
    currentId = id;

    slot.innerHTML = "";
    slot.appendChild(cardEl(p, { isStatic: true }));

    const meta = [`<span class="year">${p.year}</span>`];
    if (p.badge) meta.push(`<span class="pill">${esc(p.badge)}</span>`);
    meta.push(`<span>${esc(p.kind)}</span>`);
    $("#detail-meta").innerHTML = meta.join("");
    $("#detail-title").textContent = p.title;
    $("#detail-tagline").textContent = p.tagline;

    const links = [];
    if (p.live) links.push(`<a class="btn btn-accent" href="${esc(p.live)}" target="_blank" rel="noopener">${EXTERNAL_SVG} Visit live site</a>`);
    if (p.code) links.push(`<a class="btn ${p.live ? "btn-ghost" : "btn-primary"}" href="${esc(p.code)}" target="_blank" rel="noopener">${GITHUB_SVG} View code</a>`);
    $("#detail-actions").innerHTML = links.join("");
    $("#detail-note").textContent = p.note || "";

    if (p.image) {
      const url = p.live ? host(p.live) : p.code ? host(p.code) : "";
      stageFrame.innerHTML = `
        <div class="browser-bar"><div class="browser-dots"><i></i><i></i><i></i></div><div class="browser-url">${esc(url)}</div></div>
        <div class="stage-view"><img src="${esc(p.image)}" alt="Screenshot of ${esc(p.title)}" /></div>`;
    } else {
      stageFrame.innerHTML = `
        <div class="stage-view">${posterHTML(p)}
          <div class="stage-caption"><strong>${esc(p.title)}</strong><span>${esc(p.tagline)}</span></div>
        </div>`;
    }

    // Short summary from the project's GitHub README.
    const readmeBox = $("#detail-readme");
    readmeBox.hidden = !p.readme;
    $("#detail-readme-text").textContent = p.readme || "";
    const readmeLink = $("#detail-readme-link");
    readmeLink.hidden = !p.code;
    if (p.code) readmeLink.href = `${p.code}#readme`;

    $("#detail-desc").textContent = p.description;
    $("#detail-stack").innerHTML = p.stack.map((s) => `<li>${esc(s)}</li>`).join("");
    $("#detail-highlights").innerHTML = p.highlights.map((h) => `<li>${esc(h)}</li>`).join("");

    const more = $("#detail-more");
    more.innerHTML = "";
    order.filter((x) => x !== id).slice(0, 4).forEach((mid) => more.appendChild(cardEl(byId[mid])));

    $("#detail-count").textContent = `${order.indexOf(id) + 1} / ${order.length}`;
    stage.scrollTop = 0;
    shell.scrollTop = 0;
    history.replaceState(null, "", `#p/${id}`);
  }

  /** Where the card lands: the side slot on desktop, the big preview on phones. */
  const landingEl = () => (mobileQuery.matches ? stageFrame : slot);

  function flyCard(p, fromRect, toRect, duration) {
    const flyer = document.createElement("div");
    flyer.className = "flyer";
    flyer.appendChild(cardEl(p, { isStatic: true }));
    const box = (r) => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    Object.assign(flyer.style, box(fromRect));
    document.body.appendChild(flyer);
    const anim = flyer.animate([box(fromRect), box(toRect)], { duration, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "forwards" });
    return anim.finished.then(() => flyer.remove());
  }

  /** While the project view is open, the page behind it can't be focused or read by screen readers. */
  const background = [...document.querySelectorAll("body > .skip, body > .nav, body > main, body > footer")];
  const setBackgroundInert = (on) => background.forEach((el) => { el.inert = on; });

  function lockScroll(lock) {
    setBackgroundInert(lock);
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = lock ? "hidden" : "";
    document.body.style.paddingRight = lock && sbw > 0 ? `${sbw}px` : "";
    nav.style.paddingRight = lock && sbw > 0 ? `calc(var(--gutter) + ${sbw}px)` : "";
  }

  function openDetail(id, sourceCard) {
    if (!byId[id] || animating) return;
    if (detailOpen) { swapDetail(id); return; }

    detailOpen = true;
    lastFocus = document.activeElement;
    fillDetail(id);
    lockScroll(true);
    detail.hidden = false;

    const landing = landingEl();
    if (sourceCard && !reducedMotion) {
      animating = true;
      const from = sourceCard.getBoundingClientRect();
      sourceCard.classList.add("is-away");
      awayCard = sourceCard;
      landing.style.opacity = "0";
      void detail.offsetWidth; // apply hidden -> visible before measuring
      detail.classList.add("open");
      flyCard(byId[id], from, landing.getBoundingClientRect(), 560).then(() => {
        landing.style.opacity = "";
        animating = false;
      });
    } else {
      void detail.offsetWidth;
      detail.classList.add("open");
    }
    $(".detail-close", detail).focus({ preventScroll: true });
  }

  function swapDetail(id) {
    if (id === currentId) return;
    if (awayCard) { awayCard.classList.remove("is-away"); awayCard = null; }
    detail.classList.add("swapping");
    setTimeout(() => {
      fillDetail(id);
      detail.classList.remove("swapping");
    }, reducedMotion ? 0 : 170);
  }

  function visibleRowCard(id) {
    return [...rowsEl.querySelectorAll(`.card[data-id="${CSS.escape(id)}"]`)].find((el) => {
      const r = el.getBoundingClientRect();
      return r.right > 0 && r.left < window.innerWidth && r.bottom > 0 && r.top < window.innerHeight;
    });
  }

  function closeDetail() {
    if (!detailOpen || animating) return;
    const landing = landingEl();
    const target = (awayCard && awayCard.dataset.id === currentId ? awayCard : null) || visibleRowCard(currentId);
    const finish = () => {
      detail.hidden = true;
      detail.classList.remove("open");
      lockScroll(false);
      if (awayCard) awayCard.classList.remove("is-away");
      if (target) target.classList.remove("is-away");
      awayCard = null;
      detailOpen = false;
      animating = false;
      history.replaceState(null, "", location.pathname + location.search);
      const focusBack = target && !target.hasAttribute("aria-hidden") ? target : lastFocus;
      if (focusBack && document.contains(focusBack)) {
        // Return focus for keyboard users, without freezing the row.
        restoringFocus = true;
        focusBack.focus({ preventScroll: true });
        restoringFocus = false;
      }
    };

    if (target && !reducedMotion) {
      animating = true;
      const from = landing.getBoundingClientRect();
      landing.style.opacity = "0";
      target.classList.add("is-away");
      detail.classList.remove("open");
      flyCard(byId[currentId], from, target.getBoundingClientRect(), 460).then(() => {
        landing.style.opacity = "";
        finish();
      });
    } else {
      detail.classList.remove("open");
      setTimeout(finish, reducedMotion ? 0 : 350);
    }
  }

  detail.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) { closeDetail(); return; }
    const card = e.target.closest("#detail-more .card[data-id]");
    if (card) swapDetail(card.dataset.id);
  });
  const step = (dir) => swapDetail(order[(order.indexOf(currentId) + dir + order.length) % order.length]);
  $("#detail-prev").addEventListener("click", () => step(-1));
  $("#detail-next").addEventListener("click", () => step(1));

  document.addEventListener("keydown", (e) => {
    if (!detailOpen) return;
    if (e.key === "Escape") { e.preventDefault(); closeDetail(); }
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "Tab") {
      // Keep keyboard focus inside the dialog.
      const focusables = [...shell.querySelectorAll("a[href], button:not([disabled]):not([tabindex='-1'])")].filter((el) => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    }
  });

  // Open a project straight from a shared link like  index.html#p/porthole
  const match = location.hash.match(/^#p\/(.+)$/);
  if (match && byId[decodeURIComponent(match[1])]) openDetail(decodeURIComponent(match[1]), null);
})();
