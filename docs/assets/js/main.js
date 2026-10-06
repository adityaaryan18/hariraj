/* =========================================================
   HARIRAJ — interactions
   ========================================================= */
(() => {
  "use strict";

  const CFG = window.HARIRAJ_CONFIG || {};
  const MENU = window.HARIRAJ_MENU || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const imgSrc = (n, w = 700) => `assets/img/${n}-${w}.webp`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* India time — the restaurant's wall clock, whatever the visitor's timezone */
  const istNow = () => {
    const d = new Date();
    return new Date(d.getTime() + (330 + d.getTimezoneOffset()) * 60000);
  };
  const fmtTime = (h, m) => {
    const ap = h >= 12 ? "PM" : "AM";
    const hh = h % 12 || 12;
    return `${hh}:${String(m).padStart(2, "0")} ${ap}`;
  };
  const hourLabel = (h) => `${h % 12 || 12} ${h >= 12 && h < 24 ? "PM" : "AM"}`;

  /* ---------------------------------------------------------
     Config → page
     --------------------------------------------------------- */
  function applyConfig() {
    if (CFG.phone) $$("[data-phone]").forEach((a) => (a.href = `tel:${CFG.phone}`));
    if (CFG.phone2) $$("[data-phone2]").forEach((a) => { a.href = `tel:${CFG.phone2}`; if (CFG.phone2Display) a.textContent = CFG.phone2Display; });
    if (CFG.phoneDisplay) {
      $$("[data-phone]").forEach((a) => {
        if (/\d{3}/.test(a.textContent)) a.textContent = a.textContent.replace(/[\d\s+()-]{7,}/, (m) => (m.startsWith(" ") ? " " : "") + CFG.phoneDisplay);
      });
    }
    const tCall = $("#tCall");
    if (tCall && CFG.phone) tCall.href = `tel:${CFG.phone}`;
    if (CFG.address) $("#addr").textContent = CFG.address;
    if (CFG.mapsQuery) {
      const q = encodeURIComponent(CFG.mapsQuery);
      $("#dirLink").href = `https://www.google.com/maps/search/?api=1&query=${q}`;
      $("#mapFrame").dataset.src = `https://maps.google.com/maps?q=${q}&z=16&output=embed`;
    }
    if (CFG.email) {
      const p = $("#footerEmail");
      p.innerHTML = `<a href="mailto:${esc(CFG.email)}">${esc(CFG.email)}</a>`;
      p.hidden = false;
    }
    const soc = [];
    if (CFG.instagram) soc.push(`<a href="${esc(CFG.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
    if (CFG.facebook) soc.push(`<a href="${esc(CFG.facebook)}" target="_blank" rel="noopener">Facebook</a>`);
    $("#footerSocial").innerHTML = soc.join("");
    $("#year").textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------
     Preloader
     --------------------------------------------------------- */
  function initPreloader() {
    const pre = $(".preloader");
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      pre && pre.classList.add("is-done");
      document.documentElement.classList.add("is-loaded");
    };
    const min = reduceMotion ? 0 : 1300;
    const start = performance.now();
    window.addEventListener("load", () => setTimeout(finish, Math.max(0, min - (performance.now() - start))));
    setTimeout(finish, 3200); // never block the page
  }

  /* ---------------------------------------------------------
     Nav, progress, mobile menu, active links
     --------------------------------------------------------- */
  function initNav() {
    const nav = $("#nav");
    const bar = $(".scroll-progress");
    const mobileBar = $("#mobileBar");
    const reserve = $("#reserve");
    let reserveVisible = false, bookVisible = false;

    new IntersectionObserver(([e]) => { reserveVisible = e.isIntersecting; onScroll(); }, { threshold: 0.15 }).observe(reserve);
    const bookCtl = $(".book-controls");
    if (bookCtl) new IntersectionObserver(([e]) => { bookVisible = e.isIntersecting; onScroll(); }).observe(bookCtl);

    function onScroll() {
      const y = window.scrollY;
      nav.classList.toggle("is-scrolled", y > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
      mobileBar.classList.toggle("is-on", y > window.innerHeight * 0.7 && !reserveVisible && !bookVisible);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const toggle = $(".nav-toggle");
    const mm = $("#mobileMenu");
    const setMenu = (open) => {
      toggle.setAttribute("aria-expanded", open);
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      mm.classList.toggle("is-open", open);
      mm.setAttribute("aria-hidden", !open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    $$("a", mm).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

    const links = $$(".nav-links a");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${en.target.id}`));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["home", "signatures", "menu", "ambience", "celebrate", "reserve", "visit"].forEach((id) => { const s = document.getElementById(id); s && io.observe(s); });
  }

  /* ---------------------------------------------------------
     Hero: embers, parallax, open status
     --------------------------------------------------------- */
  function initHero() {
    const embers = $(".hero-embers");
    if (!reduceMotion) {
      let html = "";
      for (let i = 0; i < 22; i++) {
        html += `<i style="left:${(Math.random() * 100).toFixed(1)}%;--s:${(2 + Math.random() * 5).toFixed(1)}px;--t:${(8 + Math.random() * 9).toFixed(1)}s;--dl:${(-Math.random() * 15).toFixed(1)}s;--x:${(Math.random() * 140 - 70).toFixed(0)}px"></i>`;
      }
      embers.innerHTML = html;
    }

    const bg = $(".hero-bg");
    const plates = $(".hero-plates");
    if (!reduceMotion) {
      let ticking = false;
      window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight * 1.2) {
            bg.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
            plates.style.transform = `translate3d(0, ${y * -0.08}px, 0)`;
          }
          ticking = false;
        });
      }, { passive: true });

      // plates lean toward the mouse
      if (finePointer) {
        const hero = $(".hero");
        hero.addEventListener("pointermove", (e) => {
          const x = e.clientX / window.innerWidth - 0.5;
          const y = e.clientY / window.innerHeight - 0.5;
          $$(".plate", plates).forEach((p, i) => {
            const k = (i + 1) * 6;
            p.style.transform = `translate(${x * k}px, ${y * k}px)`;
          });
        });
      }
    }

    // Live open / closed badge (India time)
    const st = $("#openStatus");
    const open = CFG.openHour ?? 11, close = CFG.closeHour ?? 23;
    const update = () => {
      const n = istNow();
      const h = n.getHours() + n.getMinutes() / 60;
      const isOpen = h >= open && h < close;
      st.classList.toggle("is-open", isOpen);
      st.classList.toggle("is-closed", !isOpen);
      st.innerHTML = isOpen
        ? `<i></i><b>Open now</b> · until ${hourLabel(close)}`
        : `<i></i><b>Closed now</b> · opens ${hourLabel(open)}${h >= close ? " tomorrow" : ""}`;
    };
    update();
    setInterval(update, 60000);
  }

  /* ---------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------- */
  function initReveal() {
    const els = $$("[data-reveal]");
    // stagger siblings
    const parents = new Map();
    els.forEach((el) => {
      const p = el.parentElement;
      const i = parents.get(p) || 0;
      parents.set(p, i + 1);
      el.style.setProperty("--rd", `${Math.min(i, 6) * 0.09}s`);
    });
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------
     3D tilt for dish cards
     --------------------------------------------------------- */
  function initTilt() {
    if (!finePointer || reduceMotion) return;
    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        if (!card.classList.contains("is-in")) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateZ(0)`;
      });
      card.addEventListener("pointerleave", () => (card.style.transform = ""));
    });
  }

  /* ---------------------------------------------------------
     Floating image that follows the cursor on [data-img]
     --------------------------------------------------------- */
  function initHoverReveal() {
    const box = $("#hoverReveal");
    const img = $("img", box);
    if (!finePointer) return;
    let tx = 0, ty = 0, x = 0, y = 0, vx = 0, active = null, raf = null;
    const W = 300, H = 220;

    const loop = () => {
      const px = x;
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      vx = x - px;
      box.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      box.style.setProperty("--rot", `${clamp(vx * 0.6, -10, 10).toFixed(2)}deg`);
      raf = active || Math.abs(tx - x) > 0.5 ? requestAnimationFrame(loop) : null;
    };
    const target = (e) => {
      const flip = e.clientX + W + 40 > window.innerWidth;
      tx = flip ? e.clientX - W - 30 : e.clientX + 30;
      ty = clamp(e.clientY - H / 2, 10, window.innerHeight - H - 10);
    };

    document.addEventListener("pointerover", (e) => {
      if (e.pointerType !== "mouse") return;
      const el = e.target.closest("[data-img]");
      if (!el || el === active) return;
      active = el;
      img.src = imgSrc(el.dataset.img);
      target(e);
      if (!box.classList.contains("is-on")) { x = tx; y = ty; }
      box.classList.add("is-on");
      if (!raf) raf = requestAnimationFrame(loop);
    });
    document.addEventListener("pointermove", (e) => { if (active) target(e); }, { passive: true });
    document.addEventListener("pointerout", (e) => {
      if (!active) return;
      if (e.relatedTarget && active.contains(e.relatedTarget)) return;
      if (!e.target.closest("[data-img]")) return;
      active = null;
      box.classList.remove("is-on");
    });
    window.addEventListener("scroll", () => { if (active) { active = null; box.classList.remove("is-on"); } }, { passive: true });
  }

  /* =========================================================
     THE MENU BOOK
     ========================================================= */
  function initMenuBook() {
    const book = $("#book");
    if (!book || !MENU.length) return;
    const chipsWrap = $("#menuChips");
    const status = $("#bookStatus");
    const prevBtn = $("#bookPrev");
    const nextBtn = $("#bookNext");

    const ORN = `<svg class="p-orn" viewBox="0 0 120 12" aria-hidden="true"><path d="M0 6h46M74 6h46" stroke="currentColor" stroke-width="1"/><path d="M60 1l5 5-5 5-5-5z" fill="currentColor"/><circle cx="50" cy="6" r="1.6" fill="currentColor"/><circle cx="70" cy="6" r="1.6" fill="currentColor"/></svg>`;
    const EYE = `<svg viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const LOGO = (cls = "") => `<svg class="logo ${cls}" viewBox="0 0 200 200" aria-hidden="true"><circle class="logo-ring" cx="100" cy="100" r="82"/><text class="logo-hi" x="86" y="100" text-anchor="middle">हरि</text><text class="logo-hi" x="116" y="146" text-anchor="middle">राज</text></svg>`;
    const CORNER = (c) => `<svg class="cover-corner ${c}" viewBox="0 0 40 40" aria-hidden="true"><path d="M2 38V2h36" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 30V8h22" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="8" cy="8" r="2.6" fill="currentColor"/></svg>`;

    // Counts
    let total = 0;
    MENU.forEach((c) => c.groups.forEach((g) => (total += g.items.length)));
    $("#menuCount").textContent = `${total} dishes · ${MENU.length} sections`;
    const dc = $("#dishCount");
    if (dc) dc.dataset.count = total;

    // Category chips
    chipsWrap.innerHTML = MENU.map((c) =>
      `<button type="button" class="menu-chip" data-cat="${c.id}" ${c.img ? `data-img="${c.img}"` : ""}>${esc(c.title)}${c.img ? '<span class="cam" aria-hidden="true"></span>' : ""}</button>`
    ).join("");

    /* ----- Build page HTML (measured pagination) ----- */
    const catHeader = (c, cont) => cont
      ? `<header class="p-cat p-cat--cont"><h3>${esc(c.title)} <small style="font-weight:500;font-style:italic;font-size:.7em">(contd.)</small></h3></header>`
      : `<header class="p-cat"><h3 ${c.img ? `data-img="${c.img}"` : ""}>${esc(c.title)}</h3><span class="p-hi">${esc(c.hi)}</span>${c.blurb ? `<p>${esc(c.blurb)}</p>` : ""}${ORN}</header>`;
    const groupHead = (g, cont) =>
      `<h4 class="p-group-h" ${g.img ? `data-img="${g.img}"` : ""}>` +
      (g.img ? `<img class="thumb" src="${imgSrc(g.img)}" alt="" loading="lazy">` : "") +
      `<span>${esc(g.name)}${cont ? " (contd.)" : ""}</span>` +
      (g.tag ? `<span class="tag">${esc(g.tag)}</span>` : "") +
      (g.img && !cont ? `<span class="peek">${EYE}peek</span>` : "") +
      `</h4>`;
    const itemHTML = (it, key) =>
      `<li data-key="${key}"><span class="n">${esc(it[0])}</span><span class="d"></span><span class="pr">₹${it[1]}</span></li>`;

    let content = [];      // [{catId, html}]
    let itemPage = {};     // key -> content index

    function paginate(pw, ph) {
      const face = document.createElement("div");
      face.className = "face";
      face.style.cssText = `position:absolute;inset:auto;left:-99999px;top:0;width:${pw}px;height:${ph}px;visibility:hidden;`;
      const page = document.createElement("div");
      page.className = "page";
      face.appendChild(page);
      document.body.appendChild(face);
      // keep a clear band at the bottom for the page number
      const fits = () => {
        const last = page.lastElementChild;
        if (!last) return true;
        const padB = parseFloat(getComputedStyle(page).paddingBottom) || 0;
        return last.getBoundingClientRect().bottom <= page.getBoundingClientRect().bottom - padB;
      };

      content = [];
      itemPage = {};
      let pageCat = null;
      const flush = () => { content.push({ catId: pageCat, html: page.innerHTML }); page.innerHTML = ""; };

      MENU.forEach((c, ci) => {
        if (page.innerHTML) flush();
        pageCat = c.id;
        page.insertAdjacentHTML("beforeend", catHeader(c, false));
        c.groups.forEach((g, gi) => {
          let sec = document.createElement("section");
          sec.className = "p-group";
          sec.innerHTML = groupHead(g, false) + `<ul class="p-items"></ul>`;
          page.appendChild(sec);
          let ul = $("ul", sec);
          g.items.forEach((it, ii) => {
            const key = `${ci}-${gi}-${ii}`;
            ul.insertAdjacentHTML("beforeend", itemHTML(it, key));
            if (!fits()) {
              ul.lastElementChild.remove();
              const orphan = ul.children.length === 0;
              if (orphan) sec.remove();
              flush();
              page.insertAdjacentHTML("beforeend", catHeader(c, true));
              sec = document.createElement("section");
              sec.className = "p-group";
              sec.innerHTML = groupHead(g, !orphan) + `<ul class="p-items"></ul>`;
              page.appendChild(sec);
              ul = $("ul", sec);
              ul.insertAdjacentHTML("beforeend", itemHTML(it, key));
            }
            itemPage[key] = content.length;
          });
        });
      });
      if (page.innerHTML) flush();
      face.remove();
    }

    /* ----- Faces & leaves ----- */
    let faces = [];      // [{html, cls, catId}]
    let leaves = [];
    let cur = 0;         // turned leaves
    let single = false;
    let catFace = {};    // catId -> face index

    function buildFaces() {
      const OFFSET = 2; // cover + contents
      catFace = {};
      content.forEach((p, i) => { if (!(p.catId in catFace)) catFace[p.catId] = i + OFFSET; });

      const cover = {
        cls: "cover",
        html: `<div class="cover-inner">${CORNER("tl")}${CORNER("tr")}${CORNER("bl")}${CORNER("br")}
          ${LOGO()}
          <h3 class="cover-title">Menu</h3>
          <p class="cover-sub">Hariraj · The Veg Restaurant</p>
          <p class="cover-hi">मेन्यू</p>
          <span class="cover-open">Open the book →</span></div>`
      };
      const toc = {
        cls: "",
        html: `<div class="page"><header class="p-cat"><h3>Contents</h3><span class="p-hi">अनुक्रमणिका</span>${ORN}</header>
          <ul class="toc">${MENU.map((c) => `<li><button type="button" data-goto="${c.id}" ${c.img ? `data-img="${c.img}"` : ""}><span class="t-n">${esc(c.title)}</span><span class="t-hi">${esc(c.hi)}</span><span class="d"></span><span class="t-p">${catFace[c.id]}</span></button></li>`).join("")}</ul>
          <span class="page-num">1</span></div>`
      };
      faces = [cover, toc];
      content.forEach((p, i) => faces.push({ cls: "", catId: p.catId, html: `<div class="page">${p.html}<span class="page-num">${i + OFFSET}</span></div>` }));
      faces.push({
        cls: "",
        html: `<div class="page closing">${LOGO()}<h3>Thank you</h3><p class="c-hi">धन्यवाद · फिर पधारिए</p>
          <p class="c-time">11:00 AM – 11:00 PM</p><p>Open every day</p>
          <p>Please allow 20–25 minutes for à-la-carte dishes — each one is prepared fresh, just for you.</p>
          <p>Dishes once ordered cannot be cancelled.</p>
          <a href="#reserve" class="btn btn--primary btn--sm">Reserve a table</a>
          <span class="page-num">${faces.length}</span></div>`
      });
      if (!single) {
        if ((faces.length + 1) % 2) {
          faces.push({ cls: "", html: `<div class="page ornament-page"><svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".8">${Array.from({ length: 12 }, (_, i) => `<ellipse cx="50" cy="30" rx="7" ry="20" transform="rotate(${i * 30} 50 50)"/>`).join("")}<circle cx="50" cy="50" r="8"/><circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="47" stroke-dasharray="1 3"/></g></svg></div>` });
        }
        faces.push({ cls: "back-cover", html: `<div class="cover-inner">${LOGO()}<p class="cover-sub">Civic Centre · Bhilai</p><p class="cover-hi">हरि राज</p></div>` });
      }
    }

    function faceHTML(f, side) {
      if (!f) return `<div class="face ${side}"></div>`;
      return `<div class="face ${side} ${f.cls}">${f.html}<span class="curl" aria-hidden="true"></span></div>`;
    }

    function render() {
      const n = single ? faces.length : faces.length / 2;
      let html = "";
      for (let k = 0; k < n; k++) {
        const front = single ? faces[k] : faces[2 * k];
        const back = single ? null : faces[2 * k + 1];
        html += `<div class="leaf" data-leaf="${k}">${faceHTML(front, "front")}${single ? "" : faceHTML(back, "back")}</div>`;
      }
      book.innerHTML = html;
      leaves = $$(".leaf", book);
      book.classList.toggle("is-single", single);
    }

    const maxCur = () => (single ? leaves.length - 1 : leaves.length);

    function setZ(leaf, k) {
      if (leaf.classList.contains("is-flipping")) return;
      leaf.style.zIndex = k < cur ? k + 1 : leaves.length - k + 1;
    }

    function refresh() {
      leaves.forEach((l, k) => {
        l.classList.toggle("is-turned", k < cur);
        setZ(l, k);
        // hidden faces must not catch clicks / hovers
        const f = $(".face.front", l), b = $(".face.back", l);
        if (f) f.style.pointerEvents = k < cur ? "none" : "";
        if (b) b.style.pointerEvents = k < cur ? "" : "none";
      });
      book.classList.toggle("at-start", !single && cur === 0);
      book.classList.toggle("at-end", !single && cur === leaves.length);
      prevBtn.disabled = cur === 0;
      nextBtn.disabled = cur >= maxCur();
      updateStatus();
    }

    function visibleFaces() {
      if (single) return [cur];
      return [2 * cur - 1, 2 * cur].filter((i) => i >= 0 && i < faces.length);
    }

    function updateStatus() {
      const vis = visibleFaces();
      const last = faces.length - 1;
      let label, sub = "";
      if (!single && cur === 0 || single && cur === 0) { label = "Cover"; sub = "Tap to open"; }
      else if (!single && cur === leaves.length) { label = "Back cover"; sub = "Tap to go back"; }
      else {
        const nums = vis.filter((i) => i > 0 && !(faces[i].cls === "back-cover"));
        label = nums.length > 1 ? `Pages ${nums[0]}–${nums[1]}` : `Page ${nums[0]}`;
        const catIds = [...new Set(vis.map((i) => faces[i].catId).filter(Boolean))];
        sub = catIds.length ? catIds.map((id) => MENU.find((c) => c.id === id).title).join(" · ") : (vis.includes(1) ? "Contents" : vis.includes(last) || vis.includes(last - 1) ? "Thank you" : "");
      }
      status.innerHTML = `${label}<small>${esc(sub || "Hariraj Menu")}</small>`;
      const active = (() => {
        for (const i of vis.slice().reverse()) if (faces[i] && faces[i].catId) return faces[i].catId;
        return null;
      })();
      $$(".menu-chip", chipsWrap).forEach((b) => b.classList.toggle("is-active", b.dataset.cat === active));
    }

    let flipOrder = 0;
    function flipLeaf(leaf, k) {
      leaf.classList.add("is-flipping");
      leaf.style.zIndex = 200 + (flipOrder++);
      clearTimeout(leaf._t);
      leaf._t = setTimeout(() => {
        leaf.classList.remove("is-flipping");
        setZ(leaf, k);
        if (!$$(".leaf.is-flipping", book).length) flipOrder = 0;
      }, reduceMotion ? 20 : 1100);
    }

    let queue = null;
    function goTo(target, instant = false) {
      target = clamp(target, 0, maxCur());
      clearTimeout(queue);
      if (instant) {
        book.classList.add("no-anim");
        cur = target;
        refresh();
        void book.offsetWidth;
        requestAnimationFrame(() => book.classList.remove("no-anim"));
        return;
      }
      const dist = Math.abs(target - cur);
      const step = () => {
        if (cur === target) return;
        let k;
        if (target > cur) { k = cur; cur++; } else { cur--; k = cur; }
        flipLeaf(leaves[k], k);
        refresh();
        if (cur !== target) queue = setTimeout(step, dist > 1 ? 130 : 0);
      };
      step();
      return dist;
    }
    const faceToCur = (f) => (single ? f : Math.ceil(f / 2));
    const next = () => goTo(cur + 1);
    const prev = () => goTo(cur - 1);

    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);

    // Click / swipe on the pages
    let downX = null, downY = null, swiped = false;
    book.addEventListener("pointerdown", (e) => { downX = e.clientX; downY = e.clientY; swiped = false; });
    book.addEventListener("pointerup", (e) => {
      if (downX == null) return;
      const dx = e.clientX - downX, dy = e.clientY - downY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { swiped = true; dx < 0 ? next() : prev(); }
      downX = null;
    });
    book.addEventListener("click", (e) => {
      if (swiped) { swiped = false; return; }
      const go = e.target.closest("[data-goto]");
      if (go) { e.preventDefault(); goTo(faceToCur(catFace[go.dataset.goto])); return; }
      if (e.target.closest("a, button, input")) return;
      const leaf = e.target.closest(".leaf");
      if (!leaf) return;
      const k = +leaf.dataset.leaf;
      if (single) {
        const r = leaf.getBoundingClientRect();
        (e.clientX - r.left < r.width * 0.3 && cur > 0) ? prev() : next();
      } else {
        k < cur ? prev() : next();
      }
    });

    chipsWrap.addEventListener("click", (e) => {
      const b = e.target.closest(".menu-chip");
      if (b) goTo(faceToCur(catFace[b.dataset.cat]));
    });

    // Keyboard when the book is on screen
    let inView = false;
    new IntersectionObserver(([en]) => (inView = en.isIntersecting), { threshold: 0.35 }).observe(book);
    document.addEventListener("keydown", (e) => {
      if (!inView || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    });

    /* ----- Build / rebuild on resize ----- */
    let lastKey = "";
    function build(force) {
      single = window.innerWidth < 900;
      book.classList.toggle("is-single", single);
      const pw = single ? book.offsetWidth : book.offsetWidth / 2;
      const ph = book.offsetHeight;
      const key = `${single}-${Math.round(pw)}-${Math.round(ph)}`;
      if (key === lastKey && !force) return;
      lastKey = key;
      // remember where we were
      const vis = faces.length ? visibleFaces() : [];
      const keepCat = vis.map((i) => faces[i] && faces[i].catId).filter(Boolean).pop();
      const wasOpen = cur > 0;
      paginate(pw, ph);
      buildFaces();
      render();
      const target = keepCat ? faceToCur(catFace[keepCat]) : (wasOpen ? 1 : 0);
      goTo(target, true);
    }

    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => build(false), 200); });
    build(true);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => build(true));

    /* ----- Search ----- */
    const input = $("#menuSearch");
    const results = $("#searchResults");
    const index = [];
    MENU.forEach((c, ci) => c.groups.forEach((g, gi) => g.items.forEach((it, ii) => {
      index.push({ name: it[0], price: it[1], cat: c.title, group: g.name, key: `${ci}-${gi}-${ii}`, hay: `${it[0]} ${g.name} ${c.title}`.toLowerCase().replace(/\./g, "") });
    })));
    let focusIdx = -1, shown = [];

    function showResults() {
      const q = input.value.trim().toLowerCase().replace(/\./g, "");
      if (!q) { results.hidden = true; return; }
      const terms = q.split(/\s+/);
      shown = index.filter((x) => terms.every((t) => x.hay.includes(t)))
        .sort((a, b) => (b.name.toLowerCase().includes(q) - a.name.toLowerCase().includes(q)))
        .slice(0, 40);
      focusIdx = -1;
      const hl = (s) => {
        let out = esc(s);
        terms.forEach((t) => { if (t.length > 1) out = out.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"), "<mark>$1</mark>"); });
        return out;
      };
      results.innerHTML = shown.length
        ? shown.map((x, i) => `<li role="option"><button type="button" data-i="${i}"><span class="sr-name">${hl(x.name)}<br><span class="sr-cat">${esc(x.cat)} · ${esc(x.group)}</span></span><span class="sr-price">₹${x.price}</span></button></li>`).join("")
        : `<li class="sr-empty">No dish found for “${esc(input.value)}”. Ask our team. The chef may still make it for you!</li>`;
      results.hidden = false;
    }
    function pick(i) {
      const x = shown[i];
      if (!x) return;
      results.hidden = true;
      input.blur();
      const f = itemPage[x.key] + 2;
      book.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      const dist = goTo(faceToCur(f)) || 0;
      setTimeout(() => {
        const li = $(`[data-key="${x.key}"]`, book);
        if (li) { li.classList.remove("flash"); void li.offsetWidth; li.classList.add("flash"); }
      }, reduceMotion ? 50 : 700 + dist * 130);
    }
    input.addEventListener("input", showResults);
    input.addEventListener("focus", showResults);
    input.addEventListener("keydown", (e) => {
      const btns = $$("button", results);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!btns.length) return;
        focusIdx = (focusIdx + (e.key === "ArrowDown" ? 1 : -1) + btns.length) % btns.length;
        btns.forEach((b, i) => b.classList.toggle("is-focus", i === focusIdx));
        btns[focusIdx].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        pick(focusIdx >= 0 ? focusIdx : 0);
      } else if (e.key === "Escape") {
        results.hidden = true;
      }
    });
    results.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) pick(+b.dataset.i); });
    document.addEventListener("click", (e) => { if (!e.target.closest(".menu-search")) results.hidden = true; });
  }

  /* ---------------------------------------------------------
     Ambience: image opens up as you scroll
     --------------------------------------------------------- */
  function initAmbience() {
    const wrap = $(".amb-sticky");
    const media = $("#ambMedia");
    if (!wrap || reduceMotion) { media && media.style.setProperty("--inset", "0%"); return; }
    let ticking = false;
    const update = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp((vh - r.top) / (vh * 0.95), 0, 1);
      const max = window.innerWidth < 640 ? 4 : 9;
      media.style.setProperty("--inset", `${(max * (1 - p)).toFixed(2)}%`);
      media.style.setProperty("--rad", `${(28 * (1 - p)).toFixed(1)}px`);
      media.style.setProperty("--sc", (1.2 - 0.2 * p).toFixed(3));
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------------------------------------------------------
     Count-up stats
     --------------------------------------------------------- */
  function initCounters() {
    const nums = $$("[data-count]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const el = en.target;
        const end = +el.dataset.count;
        const dur = reduceMotion ? 1 : 1600;
        const t0 = performance.now();
        const tick = (t) => {
          const p = clamp((t - t0) / dur, 0, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    nums.forEach((n) => io.observe(n));
  }

  /* ---------------------------------------------------------
     Celebrate: marigold toran, sparkles, occasion cards
     --------------------------------------------------------- */
  function initCelebrate() {
    const svg = $("#toran");
    const flower = (x, y, r, c1 = "#f28c28", c2 = "#ffb933") => {
      let petals = "";
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        petals += `<circle cx="${(x + Math.cos(a) * r * 0.55).toFixed(1)}" cy="${(y + Math.sin(a) * r * 0.55).toFixed(1)}" r="${(r * 0.5).toFixed(1)}" fill="${i % 2 ? c1 : c2}"/>`;
      }
      return petals + `<circle cx="${x}" cy="${y}" r="${(r * 0.35).toFixed(1)}" fill="#e0611b"/>`;
    };
    const leaf = (x, y, rot) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="13" fill="#3f8a3a" transform="rotate(${rot} ${x} ${y})"/>`;
    let out = `<path d="M0 8 Q300 40 600 8 T1200 8" fill="none" stroke="#c38d38" stroke-width="2"/>`;
    // rope garland
    for (let x = 0; x <= 1200; x += 26) {
      const t = (x % 600) / 600;
      const y = 8 + Math.sin(t * Math.PI) * 26;
      out += flower(x, y, 11, x % 52 ? "#f28c28" : "#f5c02f", x % 52 ? "#ffb933" : "#ffe27a");
    }
    // hanging strands
    for (let x = 50, i = 0; x < 1200; x += 100, i++) {
      const t = (x % 600) / 600;
      const y0 = 8 + Math.sin(t * Math.PI) * 26;
      const len = 3 + (i % 2);
      let g = `<g class="swing" style="animation-delay:${(-i * 0.45).toFixed(2)}s">`;
      g += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + len * 18}" stroke="#c38d38" stroke-width="1"/>`;
      for (let j = 1; j <= len; j++) g += flower(x, y0 + j * 18, 8.5, j % 2 ? "#f28c28" : "#f5c02f", j % 2 ? "#ffb933" : "#ffe27a");
      g += leaf(x - 6, y0 + len * 18 + 14, 20) + leaf(x + 6, y0 + len * 18 + 14, -20);
      g += `</g>`;
      out += g;
    }
    svg.innerHTML = out;

    const sp = $(".sparkles");
    if (!reduceMotion) {
      let s = "";
      for (let i = 0; i < 34; i++) s += `<i style="left:${(Math.random() * 100).toFixed(1)}%;top:${(10 + Math.random() * 88).toFixed(1)}%;--t:${(2 + Math.random() * 4).toFixed(1)}s;--dl:${(-Math.random() * 6).toFixed(1)}s"></i>`;
      sp.innerHTML = s;
    }

    $$(".occasion").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
      $("button", card).addEventListener("click", (e) => {
        const occ = card.dataset.occasion;
        window.HarirajReserve && window.HarirajReserve.setOccasion(occ);
        const r = e.currentTarget.getBoundingClientRect();
        confetti(r.left + r.width / 2, r.top + r.height / 2, 90);
        setTimeout(() => $("#reserve").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }), 350);
      });
    });
  }

  /* ---------------------------------------------------------
     Confetti
     --------------------------------------------------------- */
  const canvas = $("#confetti");
  const ctx = canvas.getContext("2d");
  let parts = [], confRaf = null;
  function confetti(x, y, n = 140) {
    if (reduceMotion) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ["#e6b562", "#f28c28", "#e3263f", "#f6ead7", "#ffd27a", "#3fa35a"];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 4 + Math.random() * 9;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, w: 6 + Math.random() * 6, h: 4 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: colors[i % colors.length], life: 1, round: Math.random() < 0.3 });
    }
    if (!confRaf) confRaf = requestAnimationFrame(drawConfetti);
  }
  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts.forEach((p) => {
      p.vy += 0.28; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= 0.009;
      ctx.save();
      ctx.globalAlpha = clamp(p.life, 0, 1);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.h / 2, 0, Math.PI * 2); ctx.fill(); }
      else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    parts = parts.filter((p) => p.life > 0 && p.y < window.innerHeight + 40);
    confRaf = parts.length ? requestAnimationFrame(drawConfetti) : (ctx.clearRect(0, 0, canvas.width, canvas.height), null);
  }

  /* =========================================================
     RESERVATION
     ========================================================= */
  function initReservation() {
    const form = $("#reserveForm");
    const ticket = $("#ticket");
    const steps = $$(".rstep", form);
    const dots = $$("[data-stepdot]", form);
    const bar = $("#rformBar");
    const state = { date: null, time: null, guests: 2, occasion: "Just dining", seating: "No preference" };
    const OPEN = CFG.openHour ?? 11, CLOSE = CFG.closeHour ?? 23;
    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const parseYmd = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
    const prettyDate = (s) => { const d = parseYmd(s); return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
    const prettyTime = (t) => { const [h, m] = t.split(":").map(Number); return fmtTime(h, m); };

    /* ----- Step 1: dates ----- */
    const strip = $("#dateStrip");
    const other = $("#dateOther");
    const today = istNow();
    today.setHours(0, 0, 0, 0);
    const dates = [];
    for (let i = 0; i < 14; i++) { const d = new Date(today); d.setDate(d.getDate() + i); dates.push(d); }
    strip.innerHTML = dates.map((d, i) =>
      `<button type="button" class="date-chip" role="radio" aria-checked="false" data-date="${ymd(d)}"><small>${i === 0 ? "Today" : i === 1 ? "Tmrw" : DAYS[d.getDay()]}</small><b>${d.getDate()}</b><em>${MONTHS[d.getMonth()]}</em></button>`
    ).join("");
    const maxD = new Date(today); maxD.setDate(maxD.getDate() + 90);
    other.min = ymd(today);
    other.max = ymd(maxD);

    function selectDate(s) {
      state.date = s;
      $("#fDate").value = s;
      $$(".date-chip", strip).forEach((b) => { const on = b.dataset.date === s; b.classList.toggle("is-active", on); b.setAttribute("aria-checked", on); });
      if (!$$(".date-chip", strip).some((b) => b.dataset.date === s)) other.value = s; else other.value = "";
      renderSlots();
    }
    strip.addEventListener("click", (e) => { const b = e.target.closest(".date-chip"); if (b) selectDate(b.dataset.date); });
    other.addEventListener("change", () => { if (other.value && other.value >= other.min && other.value <= other.max) selectDate(other.value); });

    /* ----- Step 1: time slots ----- */
    const slotsEl = $("#slots");
    function renderSlots() {
      const d = parseYmd(state.date);
      const isToday = state.date === ymd(today);
      const now = istNow();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const weekend = [0, 5, 6].includes(d.getDay());
      const groups = [
        { label: "☀️ Lunch", from: OPEN * 60 + 30, to: 16 * 60 - 1 },
        { label: "🌇 Evening", from: 16 * 60, to: 19 * 60 - 1 },
        { label: "🌙 Dinner", from: 19 * 60, to: (CLOSE - 1) * 60 }
      ];
      let html = "", anyFree = false;
      groups.forEach((g) => {
        let row = "";
        for (let m = g.from; m <= g.to; m += 30) {
          const h = Math.floor(m / 60), mm = m % 60;
          const val = `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
          const past = isToday && m < nowMin + 30;
          if (!past) anyFree = true;
          const hot = (weekend && m >= 19 * 60 + 30 && m <= 21 * 60) || (d.getDay() === 0 && (m === 13 * 60 || m === 13 * 60 + 30));
          row += `<button type="button" class="slot${state.time === val && !past ? " is-active" : ""}" data-time="${val}" ${past ? "disabled" : ""}>${fmtTime(h, mm)}${hot && !past ? '<span class="hot">Popular</span>' : ""}</button>`;
        }
        if (row) html += `<div><div class="slot-group-label">${g.label}</div><div class="slot-row">${row}</div></div>`;
      });
      if (!anyFree) html = `<p class="slots-empty">We’re all wrapped up for today. Please pick another date. Tomorrow has plenty of tables!</p>`;
      slotsEl.innerHTML = html;
      if (state.time && !$(`.slot[data-time="${state.time}"]:not(:disabled)`, slotsEl)) { state.time = null; $("#fTime").value = ""; }
    }
    slotsEl.addEventListener("click", (e) => {
      const b = e.target.closest(".slot");
      if (!b || b.disabled) return;
      state.time = b.dataset.time;
      $("#fTime").value = state.time;
      $$(".slot", slotsEl).forEach((s) => s.classList.toggle("is-active", s === b));
      setError(1, "");
    });

    // default date: today if any slot remains, else tomorrow
    selectDate(ymd(today));
    if (!$(".slot:not(:disabled)", slotsEl)) selectDate(ymd(dates[1]));

    /* ----- Step 2: guests, occasion, seating ----- */
    const guestNum = $("#guestNum");
    const faces = $("#guestFaces");
    const hint = $("#guestHint");
    const PEOPLE = ["🧑", "👩", "👨", "👧", "👵", "👦", "👴", "👩‍🦱", "🧔", "👱‍♀️", "🧒", "👨‍🦳"];
    function renderGuests(bump) {
      guestNum.textContent = state.guests;
      $("#fGuests").value = state.guests;
      if (bump) { guestNum.classList.remove("bump"); void guestNum.offsetWidth; guestNum.classList.add("bump"); }
      const shown = Math.min(state.guests, 12);
      faces.innerHTML = Array.from({ length: shown }, (_, i) => `<span>${PEOPLE[i]}</span>`).join("") + (state.guests > 12 ? `<span style="font-size:.9rem;color:var(--muted);align-self:center">+${state.guests - 12}</span>` : "");
      hint.textContent =
        state.guests === 1 ? "A quiet meal for one. We’ll find you a cosy spot." :
        state.guests === 2 ? "A table for two. Lovely." :
        state.guests >= 15 ? "A big celebration! We’ll call you to plan the seating." :
        state.guests >= 8 ? "Great group! We’ll set up a long table for you." :
        "Perfect for a family dinner.";
    }
    $$("[data-guest]", form).forEach((b) => b.addEventListener("click", () => {
      state.guests = clamp(state.guests + +b.dataset.guest, 1, 40);
      renderGuests(true);
    }));
    renderGuests(false);

    const chipGroup = (wrap, key, input) => {
      wrap.addEventListener("click", (e) => {
        const c = e.target.closest(".chip");
        if (!c) return;
        setChip(wrap, key, input, c.dataset.val);
        if (key === "occasion" && /Birthday|Anniversary|Special/.test(c.dataset.val)) {
          const r = c.getBoundingClientRect();
          confetti(r.left + r.width / 2, r.top + r.height / 2, 50);
        }
      });
    };
    function setChip(wrap, key, input, val) {
      state[key] = val;
      $(input).value = val;
      $$(".chip", wrap).forEach((x) => { const on = x.dataset.val === val; x.classList.toggle("is-active", on); x.setAttribute("aria-checked", on); });
    }
    const occWrap = $("#occasionChips"), seatWrap = $("#seatingChips");
    chipGroup(occWrap, "occasion", "#fOccasion");
    chipGroup(seatWrap, "seating", "#fSeating");

    /* ----- Steps ----- */
    let step = 1;
    function setError(n, msg) { const el = $(`[data-error="${n}"]`, form); if (el) el.textContent = msg; }
    function goStep(n) {
      step = n;
      steps.forEach((s) => s.classList.toggle("is-active", +s.dataset.step === n));
      dots.forEach((d) => {
        const k = +d.dataset.stepdot;
        d.classList.toggle("is-active", k === n);
        d.classList.toggle("is-done", k < n);
      });
      bar.style.width = `${(n / 3) * 100}%`;
      if (n === 3) renderSummary();
      const card = $(".reserve-card");
      const r = card.getBoundingClientRect();
      if (r.top < 60) window.scrollBy({ top: r.top - 90, behavior: reduceMotion ? "auto" : "smooth" });
    }
    function renderSummary() {
      const occIcon = { Birthday: "🎂", Anniversary: "💞", "Family get-together": "👨‍👩‍👧", "Special Occasion": "✨", Business: "💼" }[state.occasion] || "🍽️";
      $("#rSummary").innerHTML =
        `<span>📅 ${esc(prettyDate(state.date))}</span><span>🕖 ${esc(prettyTime(state.time))}</span><span>👥 ${state.guests} guest${state.guests > 1 ? "s" : ""}</span><span>${occIcon} ${esc(state.occasion)}</span>` +
        (state.seating !== "No preference" ? `<span>🛋️ ${esc(state.seating)}</span>` : "");
    }
    form.addEventListener("click", (e) => {
      if (e.target.closest("[data-next]")) {
        if (step === 1) {
          if (!state.date) return setError(1, "Please pick a date.");
          if (!state.time) {
            setError(1, "Please pick a time for your table.");
            slotsEl.animate([{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "none" }], { duration: 300 });
            return;
          }
          setError(1, "");
        }
        goStep(step + 1);
      }
      if (e.target.closest("[data-prev]")) goStep(step - 1);
    });

    /* ----- Validation & submit ----- */
    const normPhone = (v) => {
      let d = v.replace(/\D/g, "");
      if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
      if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
      return d;
    };
    const markField = (input, ok) => input.closest(".field").classList.toggle("is-invalid", !ok);
    $$(".field input", form).forEach((i) => i.addEventListener("input", () => markField(i, true)));

    const submitBtn = $("#rSubmit");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = $("#fName"), phone = $("#fPhone"), email = $("#fEmail");
      const errs = [];
      if (name.value.trim().length < 2) { errs.push("your name"); markField(name, false); }
      const p = normPhone(phone.value);
      if (!/^[6-9]\d{9}$/.test(p)) { errs.push("a valid 10-digit mobile number"); markField(phone, false); }
      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { errs.push("a valid email (or leave it empty)"); markField(email, false); }
      if (errs.length) { setError(3, `Please enter ${errs.join(", ")}.`); return; }
      setError(3, "");
      if ($('[name="bot-field"]', form).value) return; // spam bot

      const ref = "HR-" + Date.now().toString(36).slice(-4).toUpperCase() + Math.random().toString(36).slice(2, 4).toUpperCase();
      $("#fRef").value = ref;
      const data = {
        booking_ref: ref,
        name: name.value.trim(),
        phone: "+91 " + p,
        email: email.value.trim(),
        date: state.date,
        date_pretty: prettyDate(state.date),
        time: prettyTime(state.time),
        guests: state.guests,
        occasion: state.occasion,
        seating: state.seating,
        message: $("#fMsg").value.trim()
      };

      submitBtn.classList.add("is-loading");
      submitBtn.disabled = true;
      const delivered = await send(data);
      submitBtn.classList.remove("is-loading");
      submitBtn.disabled = false;

      try { localStorage.setItem("hariraj:lastBooking", JSON.stringify({ ...data, delivered, at: Date.now() })); } catch (_) {}
      showTicket(data, delivered);
    });

    async function send(data) {
      try {
        if (CFG.formEndpoint) {
          const res = await fetch(CFG.formEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ ...data, _subject: `New table reservation ${data.booking_ref} — ${data.date_pretty}, ${data.time}` })
          });
          return res.ok;
        }
        if (!/^https?:/.test(location.protocol)) return false;
        // Netlify Forms
        const fd = new FormData(form);
        fd.set("phone", data.phone);
        fd.set("time", data.time);
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(fd).toString()
        });
        return res.ok && /netlify/i.test(res.headers.get("server") || "");
      } catch (_) {
        return false;
      }
    }

    function waLink(d) {
      if (!CFG.whatsapp) return null;
      const msg =
`Hello Hariraj! I'd like to reserve a table 🙏

*Ref:* ${d.booking_ref}
*Name:* ${d.name}
*Date:* ${d.date_pretty}
*Time:* ${d.time}
*Guests:* ${d.guests}
*Occasion:* ${d.occasion}
*Seating:* ${d.seating}${d.message ? `\n*Note:* ${d.message}` : ""}
*Phone:* ${d.phone}`;
      return `https://wa.me/${CFG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
    }

    let lastData = null;
    function showTicket(d, delivered) {
      lastData = d;
      $("#tRef").textContent = d.booking_ref;
      $("#tName").textContent = d.name;
      $("#tDate").textContent = d.date_pretty;
      $("#tTime").textContent = d.time;
      $("#tGuests").textContent = d.guests;
      $("#tOcc").textContent = d.occasion;
      const wa = waLink(d);
      const waBtn = $("#tWhatsApp");
      waBtn.hidden = !wa;
      if (wa) waBtn.href = wa;
      const msg = $("#ticketMsg");
      if (delivered) {
        $("#ticketTitle").textContent = "Your table request is in!";
        msg.textContent = `Our team will call or WhatsApp you on ${d.phone} shortly to confirm your table.`;
        msg.classList.remove("is-warn");
      } else {
        $("#ticketTitle").textContent = "One last tap to confirm";
        msg.textContent = wa
          ? "We couldn’t send your request online just now. Tap “Confirm on WhatsApp” (your details are already filled in) or give us a call."
          : "We couldn’t send your request online just now. Please call us to confirm your table. Your details are below.";
        msg.classList.add("is-warn");
      }
      form.hidden = true;
      ticket.hidden = false;
      const r = ticket.getBoundingClientRect();
      confetti(r.left + r.width / 2, r.top + 80, 160);
      if (r.top < 0) ticket.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    $("#tCal").addEventListener("click", () => {
      if (!lastData) return;
      const [y, m, d] = state.date.split("-").map(Number);
      const [hh, mm] = state.time.split(":").map(Number);
      const start = new Date(Date.UTC(y, m - 1, d, hh, mm) - 330 * 60000); // IST → UTC
      const end = new Date(start.getTime() + 2 * 3600000);
      const f = (dt) => dt.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
      const ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Hariraj//Reservation//EN", "BEGIN:VEVENT",
        `UID:${lastData.booking_ref}@hariraj`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`,
        `SUMMARY:Table at Hariraj (${lastData.guests} guests)`,
        `LOCATION:${(CFG.address || "Civic Centre, Bhilai").replace(/,/g, "\\,")}`,
        `DESCRIPTION:Booking ref ${lastData.booking_ref} · ${lastData.occasion}`,
        "BEGIN:VALARM", "TRIGGER:-PT2H", "ACTION:DISPLAY", "DESCRIPTION:Your table at Hariraj", "END:VALARM",
        "END:VEVENT", "END:VCALENDAR"
      ].join("\r\n");
      const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `hariraj-${lastData.booking_ref}.ics`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

    $("#tAgain").addEventListener("click", () => {
      form.reset();
      state.time = null;
      $("#fTime").value = "";
      setChip(occWrap, "occasion", "#fOccasion", "Just dining");
      setChip(seatWrap, "seating", "#fSeating", "No preference");
      state.guests = 2;
      renderGuests(false);
      renderSlots();
      ticket.hidden = true;
      form.hidden = false;
      goStep(1);
    });

    // public hook for the "Celebrate" cards
    window.HarirajReserve = {
      setOccasion(val) {
        if (!$(`.chip[data-val="${val}"]`, occWrap)) return;
        setChip(occWrap, "occasion", "#fOccasion", val);
        if (val === "Birthday" && state.guests < 4) { state.guests = 4; renderGuests(false); }
      }
    };
  }

  /* ---------------------------------------------------------
     Map: load when near the viewport (or on click)
     --------------------------------------------------------- */
  function initMap() {
    const frame = $("#mapFrame");
    const btn = $("#mapLoad");
    const load = () => {
      if (frame.src) return;
      frame.src = frame.dataset.src;
      frame.addEventListener("load", () => btn.remove(), { once: true });
      setTimeout(() => btn && btn.remove(), 4000);
    };
    btn.addEventListener("click", load);
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { load(); io.disconnect(); } }, { rootMargin: "200px" });
    io.observe(frame);
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  applyConfig();
  initPreloader();
  initNav();
  initHero();
  initMenuBook();   // before reveal so the dish count is ready
  initReveal();
  initTilt();
  initHoverReveal();
  initAmbience();
  initCounters();
  initCelebrate();
  initReservation();
  initMap();
})();
