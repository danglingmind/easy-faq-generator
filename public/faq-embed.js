(function () {
  "use strict";

  function findAllEmbedNodes() {
    return Array.from(
      document.querySelectorAll('[data-faq-embed]')
    );
  }

  function resolveEmbedOrigin(node) {
    const explicitOrigin = node.getAttribute("data-faq-origin");
    if (explicitOrigin) {
      return explicitOrigin.replace(/\/$/, "");
    }
    if (window.location.protocol === "file:" || window.location.origin === "null") {
      return "http://localhost:3000";
    }
    return window.location.origin;
  }

  async function loadEmbedPayload(embedId, origin) {
    try {
      const response = await fetch(
        `${origin}/api/public/embed/${embedId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to load embed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error loading FAQ embed:", error);
      return null;
    }
  }

  function injectEmbed(node, payload) {
    if (!payload || !payload.html || !payload.css) {
      node.innerHTML = "<!-- FAQ Embed: Failed to load -->";
      return;
    }

    // Inject styles
    const styleId = `faq-embed-styles-${node.getAttribute("data-faq-embed")}`;
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = payload.css;
      document.head.appendChild(style);
    }

    // Inject HTML
    node.innerHTML = payload.html;

    // Execute inline scripts inside the embedded HTML (e.g., toggleFAQ)
    const inlineScripts = Array.from(node.querySelectorAll("script"));
    inlineScripts.forEach((oldScript) => {
      const script = document.createElement("script");
      if (oldScript.src) {
        script.src = oldScript.src;
        script.async = oldScript.async;
      } else {
        script.textContent = oldScript.textContent || "";
      }
      document.body.appendChild(script);
      oldScript.remove();
    });

    // Inject JSON-LD schema
    if (payload.schema) {
      const scriptId = `faq-embed-schema-${node.getAttribute("data-faq-embed")}`;
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(payload.schema);
        document.head.appendChild(script);
      }
    }
  }

  function verifyIntegrity(payload) {
    // Simplified integrity check
    // In production, verify hash matches
    return payload && payload.html && payload.css;
  }

  async function init() {
    const nodes = findAllEmbedNodes();
    
    for (const node of nodes) {
      const embedId = node.getAttribute("data-faq-embed");
      if (!embedId) continue;

      const origin = resolveEmbedOrigin(node);
      const payload = await loadEmbedPayload(embedId, origin);
      if (verifyIntegrity(payload)) {
        injectEmbed(node, payload);
      } else {
        node.innerHTML = "<!-- FAQ Embed: Invalid payload -->";
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
