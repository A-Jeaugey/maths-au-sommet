/* Aperçu en direct (Decap CMS) pour la collection "pages".
 *
 * Reproduit le rendu du site (couleurs, polices, mise en page, fonds
 * clair/sombre/accent) pendant que l'on tape. Les animations et la 3D
 * n'existent que sur le vrai site publié — l'aperçu est statique.
 *
 * Tout est en vanilla JS : `h` = React.createElement, `createClass` =
 * composant React, fournis par Decap sans étape de build.
 */
(function () {
  var C = {
    nuit: "#0A1628",
    glacier: "#4AAFD4",
    neige: "#F8F9FB",
    soleil: "#F4B942",
    ardoise: "#6B7280",
    encre: "#0F172A",
  };
  var F = {
    serif: "'Fraunces', Georgia, serif",
    sans: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    hand: "'Caveat', cursive",
  };

  function tone(dark) {
    return dark
      ? { title: C.neige, body: "rgba(248,249,251,0.85)", muted: "rgba(248,249,251,0.55)", cardBg: C.nuit, hair: "rgba(248,249,251,0.18)" }
      : { title: C.encre, body: "rgba(15,23,42,0.85)", muted: C.ardoise, cardBg: C.neige, hair: "rgba(15,23,42,0.15)" };
  }
  function blockDark(b, pageDark) {
    if (b.background === "dark") return true;
    if (b.background === "light" || b.background === "accent") return false;
    return pageDark;
  }
  function band(b) {
    if (b.background === "dark") return { background: C.nuit, color: C.neige };
    if (b.background === "light") return { background: C.neige, color: C.encre };
    if (b.background === "accent") return { background: C.soleil, color: C.nuit };
    return {};
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  // Comme src/lib/url.ts : préfixe https:// si l'adresse n'a pas de schéma,
  // pour qu'un « google.com » n'ouvre pas …/google.com (chemin relatif).
  function normUrl(u) {
    u = (u || "").trim();
    if (!u) return "#";
    if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(u)) return u;
    return "https://" + u;
  }

  // Inline markdown → HTML (gras, italique, barré, code, liens, images).
  function inline(t) {
    t = esc(t);
    t = t.replace(/!\[[^\]]*\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, '<img src="$1" style="max-width:100%;border-radius:2px;" />');
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, txt, u) { return '<a href="' + normUrl(u) + '" style="color:' + C.glacier + ';">' + txt + "</a>"; });
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/__([^_]+)__/g, "<strong>$1</strong>");
    t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/(^|[^\w])_([^_]+)_/g, "$1<em>$2</em>");
    t = t.replace(/~~([^~]+)~~/g, "<s>$1</s>");
    t = t.replace(/`([^`]+)`/g, '<code style="background:rgba(74,175,212,0.15);padding:1px 5px;border-radius:3px;font-family:' + F.mono + ';font-size:0.9em;">$1</code>');
    return t;
  }
  // Block markdown → HTML, aligné sur le vrai moteur du site (titres, listes,
  // paragraphes, images en bloc).
  function md(src) {
    if (!src) return "";
    return String(src).split(/\n\s*\n/).map(function (blk) {
      var lines = blk.split("\n");
      var t = blk.trim();
      var img = t.match(/^!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)$/);
      if (img) return '<img src="' + img[1] + '" style="max-width:100%;border-radius:2px;display:block;margin:8px 0;" />';
      var hd = t.match(/^(#{1,6})\s+([\s\S]*)$/);
      if (hd) {
        var fs = hd[1].length <= 2 ? "28px" : "22px";
        return '<h3 style="font-family:' + F.serif + ';font-weight:300;font-size:' + fs + ';line-height:1.15;margin:18px 0 8px;">' + inline(hd[2]) + "</h3>";
      }
      if (lines.every(function (l) { return /^[-*+]\s+/.test(l.trim()); })) {
        return '<ul style="margin:0 0 1em;padding-left:20px;line-height:1.7;">' + lines.map(function (l) { return "<li>" + inline(l.trim().replace(/^[-*+]\s+/, "")) + "</li>"; }).join("") + "</ul>";
      }
      if (lines.every(function (l) { return /^\d+\.\s+/.test(l.trim()); })) {
        return '<ol style="margin:0 0 1em;padding-left:22px;line-height:1.7;">' + lines.map(function (l) { return "<li>" + inline(l.trim().replace(/^\d+\.\s+/, "")) + "</li>"; }).join("") + "</ol>";
      }
      if (lines.every(function (l) { return /^>\s?/.test(l) || l.trim() === ""; })) {
        var qi = lines.map(function (l) { return l.replace(/^>\s?/, ""); }).join(" ").trim();
        return '<blockquote style="border-left:2px solid rgba(74,175,212,0.5);padding-left:16px;font-style:italic;margin:0 0 1em;line-height:1.75;">' + inline(qi) + "</blockquote>";
      }
      return '<p style="margin:0 0 1em;line-height:1.75;">' + inline(lines.join(" ")) + "</p>";
    }).join("");
  }
  function htmlNode(html, style) {
    return h("div", { style: style || {}, dangerouslySetInnerHTML: { __html: html } });
  }

  function heading(text, t, mb) {
    return h("h2", { style: { fontFamily: F.serif, fontWeight: 300, fontSize: "30px", lineHeight: 1.1, margin: "0 0 " + (mb || 24) + "px", color: t.title } }, text);
  }

  var WIDTH = { narrow: "720px", normal: "1100px", wide: "1320px", full: "100%" };

  function renderInner(b, dark, t) {
    switch (b.type) {
      case "sectionHeader":
        return h("div", {},
          b.label ? h("p", { style: { fontFamily: F.mono, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: dark ? C.glacier : "rgba(15,23,42,0.6)", margin: "0 0 14px" } }, b.label) : null,
          h("h2", { style: { fontFamily: F.serif, fontWeight: 300, fontSize: "38px", lineHeight: 1.05, margin: 0, color: t.title } },
            (b.title || "") + " ", b.highlight ? h("span", { style: { fontStyle: "italic", color: C.glacier } }, b.highlight) : null),
          b.intro ? h("p", { style: { fontSize: "18px", lineHeight: 1.7, color: t.body, margin: "18px 0 0", maxWidth: "62ch" } }, b.intro) : null);

      case "richText":
        return h("div", {}, b.title ? heading(b.title, t) : null, htmlNode(md(b.body), { color: t.body, fontSize: "17px" }));

      case "cardGrid": {
        var cards = b.cards || [];
        var n = Math.max(1, Math.min(b.columns || 3, 4));
        var cols = Math.max(1, Math.min(n, cards.length || 1));
        return h("div", {}, b.title ? heading(b.title, t) : null,
          h("div", { style: { display: "grid", gridTemplateColumns: "repeat(" + cols + ",1fr)", gap: "16px" } },
            cards.map(function (c, i) {
              return h("div", { key: i, style: { border: "1px solid " + t.hair, background: t.cardBg, padding: "24px" } },
                c.icon ? h("div", { style: { fontSize: "28px", marginBottom: "10px" } }, c.icon) : null,
                h("p", { style: { fontFamily: F.serif, fontSize: "20px", margin: "0 0 8px", color: t.title } }, c.title || ""),
                c.text ? h("p", { style: { fontSize: "14px", lineHeight: 1.6, color: t.body, margin: 0 } }, c.text) : null);
            }))); }

      case "gallery": {
        var imgs = b.images || [];
        return h("div", {}, b.title ? heading(b.title, t) : null,
          h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" } },
            imgs.map(function (im, i) {
              return h("figure", { key: i, style: { margin: 0, background: t.cardBg, padding: "10px", boxShadow: "0 10px 30px -12px rgba(10,22,40,0.45)" } },
                im.image ? h("div", { style: { aspectRatio: "4 / 3", background: "rgba(15,23,42,0.1)", backgroundImage: "url(" + im.image + ")", backgroundSize: "cover", backgroundPosition: "center" } }) : null,
                im.caption ? h("figcaption", { style: { fontFamily: F.serif, fontSize: "13px", margin: "8px 2px 0", color: t.body } }, im.caption) : null,
                im.meta ? h("p", { style: { fontFamily: F.hand, fontSize: "18px", margin: "2px", color: t.muted } }, im.meta) : null);
            }))); }

      case "keyFigures": {
        var figs = b.figures || [];
        var fcols = Math.max(1, Math.min(4, figs.length || 1));
        return h("div", { style: { display: "grid", gridTemplateColumns: "repeat(" + fcols + ",1fr)", gap: "16px" } },
          figs.map(function (kf, i) {
            return h("div", { key: i, style: { border: "1px solid " + t.hair, background: t.cardBg, padding: "28px" } },
              h("p", { style: { fontFamily: F.mono, fontSize: "10px", letterSpacing: "0.18em", color: t.muted, margin: "0 0 18px" } }, ("0" + (i + 1)).slice(-2)),
              h("p", { style: { fontFamily: F.mono, fontSize: "44px", fontWeight: 500, margin: 0, color: t.title } }, (kf.value != null ? kf.value : ""), h("span", { style: { fontSize: "18px", color: t.muted } }, kf.suffix || "")),
              h("p", { style: { fontSize: "14px", margin: "16px 0 0", color: t.body } }, kf.label || ""));
          })); }

      case "timeline": {
        var steps = b.steps || [];
        return h("div", {}, b.title ? heading(b.title, t) : null,
          steps.map(function (s, i) {
            return h("div", { key: i, style: { borderLeft: "1px solid " + t.hair, padding: "0 0 24px 20px", marginLeft: "4px" } },
              s.date ? h("p", { style: { fontFamily: F.mono, fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: C.glacier, margin: "0 0 4px" } }, s.date) : null,
              h("p", { style: { fontFamily: F.serif, fontSize: "20px", margin: "0 0 4px", color: t.title } }, s.title || ""),
              s.body ? h("p", { style: { fontSize: "15px", lineHeight: 1.6, color: t.body, margin: 0 } }, s.body) : null);
          })); }

      case "cta":
        return h("div", { style: { maxWidth: "62ch" } },
          h("h2", { style: { fontFamily: F.serif, fontWeight: 300, fontSize: "32px", margin: 0, color: t.title } }, b.title || ""),
          b.text ? h("p", { style: { fontSize: "17px", lineHeight: 1.7, color: t.body, margin: "18px 0 0" } }, b.text) : null,
          h("div", { style: { marginTop: "28px" } },
            h("span", { style: { display: "inline-block", background: C.soleil, color: C.nuit, padding: "14px 28px", borderRadius: "999px", fontFamily: F.mono, fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase" } }, (b.buttonLabel || "Bouton") + "  →")));

      case "imageText":
        return h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "center" } },
          h("div", { style: { aspectRatio: "4 / 3", background: "rgba(15,23,42,0.1)", backgroundImage: b.image ? "url(" + b.image + ")" : "none", backgroundSize: "cover", backgroundPosition: "center", order: b.imageSide === "right" ? 2 : 0 } }),
          h("div", {}, b.title ? heading(b.title, t, 16) : null, htmlNode(md(b.body), { color: t.body, fontSize: "16px" })));

      case "quote":
        return h("blockquote", { style: { margin: 0, maxWidth: "62ch" } },
          h("p", { style: { fontFamily: F.serif, fontWeight: 300, fontStyle: "italic", fontSize: "30px", lineHeight: 1.3, color: t.title, margin: 0 } }, "« " + (b.quote || "") + " »"),
          b.author ? h("p", { style: { fontFamily: F.mono, fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: t.muted, margin: "18px 0 0" } }, "— " + b.author) : null);

      case "fundraiser": {
        var goal = Number(b.goal) || 0, cur = Number(b.current) || 0;
        var pct = goal > 0 ? Math.min(100, Math.round((cur / goal) * 100)) : 0;
        return h("div", { style: { maxWidth: "62ch" } },
          h("p", { style: { fontFamily: F.mono, fontSize: "48px", fontWeight: 500, margin: 0, color: t.title } }, cur.toLocaleString("fr-FR"), h("span", { style: { fontSize: "24px", color: t.muted } }, " " + (b.currency || "€"))),
          h("p", { style: { fontFamily: F.mono, fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase", color: t.muted, margin: "8px 0 0" } }, "sur " + goal.toLocaleString("fr-FR") + " " + (b.currency || "€") + " · " + pct + "%"),
          h("div", { style: { marginTop: "20px", height: "12px", borderRadius: "999px", background: dark ? "rgba(248,249,251,0.15)" : "rgba(15,23,42,0.1)", overflow: "hidden" } },
            h("div", { style: { height: "100%", width: pct + "%", background: C.soleil, borderRadius: "999px" } })),
          b.label ? h("p", { style: { fontSize: "17px", color: t.body, margin: "16px 0 0" } }, b.label) : null); }

      case "countdown": {
        var ms = b.date ? (new Date(b.date).getTime() - Date.now()) : 0;
        ms = isNaN(ms) ? 0 : Math.max(0, ms);
        var cells = [[Math.floor(ms / 86400000), "jours"], [Math.floor((ms % 86400000) / 3600000), "heures"], [Math.floor((ms % 3600000) / 60000), "min"], [Math.floor((ms % 60000) / 1000), "sec"]];
        return h("div", {},
          b.label ? h("p", { style: { fontFamily: F.serif, fontWeight: 300, fontSize: "26px", margin: "0 0 18px", color: t.title } }, b.label) : null,
          h("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap" } },
            cells.map(function (c, i) {
              return h("div", { key: i, style: { border: "1px solid " + t.hair, background: t.cardBg, padding: "14px 22px", textAlign: "center", minWidth: "80px" } },
                h("div", { style: { fontFamily: F.mono, fontSize: "36px", fontWeight: 500, color: t.title } }, ("0" + c[0]).slice(-2)),
                h("div", { style: { fontFamily: F.mono, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: t.muted, marginTop: "4px" } }, c[1]));
            }))); }

      case "video":
      case "embed":
        return h("div", {}, b.title ? heading(b.title, t) : null,
          h("div", { style: { border: "1px dashed " + t.hair, background: dark ? "rgba(248,249,251,0.05)" : "rgba(15,23,42,0.04)", aspectRatio: b.type === "video" ? "16 / 9" : "auto", minHeight: b.type === "embed" ? "180px" : "auto", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "24px" } },
            h("div", {},
              h("p", { style: { fontFamily: F.mono, fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: t.muted, margin: 0 } }, b.type === "video" ? "▶  Vidéo" : "Contenu intégré"),
              h("p", { style: { fontSize: "13px", color: t.body, margin: "8px 0 0", wordBreak: "break-all" } }, b.url || "(adresse à renseigner)"))));

      case "accordion": {
        var items = b.items || [];
        return h("div", { style: { maxWidth: "62ch" } }, b.title ? heading(b.title, t) : null,
          items.map(function (it, i) {
            return h("div", { key: i, style: { borderBottom: "1px solid " + t.hair, padding: "16px 0" } },
              h("p", { style: { fontFamily: F.serif, fontSize: "19px", margin: 0, color: t.title } }, it.question || ""),
              htmlNode(md(it.answer), { color: t.body, fontSize: "15px", marginTop: "8px" }));
          })); }

      case "table": {
        var headers = b.headers || [], rows = b.rows || [];
        return h("div", {}, b.title ? heading(b.title, t) : null,
          h("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "15px", color: t.body } },
            headers.length ? h("thead", {}, h("tr", { style: { borderBottom: "1px solid " + t.hair } },
              headers.map(function (hd, i) { return h("th", { key: i, style: { textAlign: "left", padding: "12px", fontFamily: F.mono, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: t.muted } }, hd); }))) : null,
            h("tbody", {}, rows.map(function (r, ri) {
              return h("tr", { key: ri, style: { borderBottom: "1px solid " + t.hair } },
                (r.cells || []).map(function (cell, ci) { return h("td", { key: ci, style: { padding: "12px", color: ci === 0 ? t.title : t.body } }, cell); }));
            })))); }

      case "file":
        return h("div", { style: { border: "1px solid " + t.hair, background: t.cardBg, padding: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" } },
          h("div", { style: { display: "flex", gap: "16px", alignItems: "center" } },
            h("span", { style: { fontSize: "28px" } }, "📄"),
            h("div", {}, b.title ? h("p", { style: { fontFamily: F.serif, fontSize: "19px", margin: 0, color: t.title } }, b.title) : null,
              b.description ? h("p", { style: { fontSize: "14px", color: t.body, margin: "4px 0 0" } }, b.description) : null)),
          h("span", { style: { background: C.soleil, color: C.nuit, padding: "12px 24px", borderRadius: "999px", fontFamily: F.mono, fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase" } }, (b.buttonLabel || "Télécharger") + " ↓"));

      case "buttons": {
        var btns = b.buttons || [];
        return h("div", { style: { display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: b.align === "center" ? "center" : "flex-start" } },
          btns.map(function (bt, i) {
            var primary = (bt.style || "primary") === "primary";
            return h("span", { key: i, style: primary
              ? { background: C.soleil, color: C.nuit, padding: "14px 28px", borderRadius: "999px", fontFamily: F.mono, fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase" }
              : { border: "1px solid " + (dark ? "rgba(248,249,251,0.3)" : "rgba(15,23,42,0.3)"), color: t.title, padding: "13px 27px", borderRadius: "999px", fontFamily: F.mono, fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase" } },
              bt.label || "Bouton");
          })); }

      default:
        return h("p", { style: { color: t.muted, fontFamily: F.mono, fontSize: "12px" } }, "[bloc : " + (b.type || "?") + "]");
    }
  }

  function renderBanner(b, key) {
    var overlay = "linear-gradient(rgba(10,22,40,0.55),rgba(10,22,40,0.55))";
    var center = b.align !== "left";
    return h("div", { key: key, style: { backgroundImage: (b.image ? overlay + ",url(" + b.image + ")" : overlay), backgroundSize: "cover", backgroundPosition: "center", minHeight: b.height === "large" ? "420px" : b.height === "small" ? "240px" : "340px", display: "flex", alignItems: center ? "center" : "flex-end" } },
      h("div", { style: { maxWidth: "1100px", margin: "0 auto", padding: "48px 24px", width: "100%", textAlign: center ? "center" : "left" } },
        b.title ? h("h2", { style: { fontFamily: F.serif, fontWeight: 300, fontSize: "44px", lineHeight: 1.05, color: C.neige, margin: 0 } }, b.title) : null,
        b.text ? h("p", { style: { fontSize: "18px", lineHeight: 1.6, color: "rgba(248,249,251,0.85)", margin: "18px 0 0" } }, b.text) : null,
        b.buttonLabel ? h("div", { style: { marginTop: "24px" } }, h("span", { style: { background: C.soleil, color: C.nuit, padding: "14px 28px", borderRadius: "999px", fontFamily: F.mono, fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase" } }, b.buttonLabel + "  →")) : null));
  }

  function renderSeparator(b, key, pageDark) {
    if (b.style === "space") {
      var hgt = b.size === "large" ? "120px" : b.size === "small" ? "32px" : "64px";
      return h("div", { key: key, style: { height: hgt } });
    }
    return h("div", { key: key, style: { maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" } },
      h("hr", { style: { border: 0, borderTop: "1px solid " + (pageDark ? "rgba(248,249,251,0.15)" : "rgba(15,23,42,0.15)") } }));
  }

  var PagePreview = createClass({
    render: function () {
      var data = this.props.entry.get("data");
      var d = data ? data.toJS() : {};
      var pageDark = d.theme === "dark";
      var t = tone(pageDark);
      var blocks = Array.isArray(d.blocks) ? d.blocks : [];
      return h("div", { style: { background: pageDark ? C.nuit : C.neige, color: t.title, fontFamily: F.sans, minHeight: "100%", paddingBottom: "60px" } },
        h("div", { style: { maxWidth: "880px", margin: "0 auto", padding: "48px 24px 8px" } },
          h("p", { style: { fontFamily: F.mono, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: pageDark ? C.glacier : "rgba(15,23,42,0.6)", margin: 0 } }, "Les Maths au Sommet"),
          h("h1", { style: { fontFamily: F.serif, fontWeight: 300, fontSize: "44px", lineHeight: 1.05, margin: "14px 0 0", color: t.title } }, d.title || "Titre de la page"),
          d.description ? h("p", { style: { fontSize: "18px", lineHeight: 1.7, color: t.body, margin: "18px 0 0", maxWidth: "62ch" } }, d.description) : null),
        blocks.map(function (b, i) {
          if (!b || !b.type) return null;
          if (b.type === "banner") return renderBanner(b, i);
          if (b.type === "separator") return renderSeparator(b, i, pageDark);
          var dark = blockDark(b, pageDark);
          var bt = tone(dark);
          var mw = WIDTH[b.width || "normal"] || WIDTH.normal;
          var inner;
          try { inner = renderInner(b, dark, bt); } catch (e) { inner = h("p", { style: { color: "#c00" } }, "Aperçu indisponible pour ce bloc."); }
          return h("div", { key: i, style: band(b) },
            h("div", { style: { maxWidth: mw, margin: "0 auto", padding: "40px 24px", textAlign: b.align === "center" ? "center" : "left" } }, inner));
        }));
    },
  });

  var STYLE =
    "@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,400..500&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&family=Caveat&display=swap');" +
    "body{margin:0;}";

  if (window.CMS) {
    CMS.registerPreviewStyle(STYLE, { raw: true });
    CMS.registerPreviewTemplate("pages", PagePreview);
  }
})();
