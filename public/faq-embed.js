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

    // Simple approach: inject HTML, then extract and execute scripts
    node.innerHTML = payload.html;
    
    // Define manual accordion initialization function OUTSIDE the script execution
    // This ensures it always runs, regardless of script execution success/failure
    function initializeAccordion() {
      const containersAfter = node.querySelectorAll(".faq-container");
      
      if (containersAfter.length > 0) {
        const container = containersAfter[0];
        const items = container.querySelectorAll(".faq-item");
        
        // Get animation config from container
        const animationType = container.getAttribute("data-animation-type") || "Fade";
        const animationDuration = parseInt(container.getAttribute("data-animation-duration") || "300", 10);
        const mode = container.getAttribute("data-accordion-mode") || "single";
        
        items.forEach((item, idx) => {
          const button = item.querySelector("[data-accordion-button]");
          const answer = item.querySelector(".faq-answer");
          
          if (!button || !answer) {
            return;
          }
          
          const dataOpen = item.getAttribute("data-open");
          
          // Set initial state - items should be closed by default unless explicitly set to "true"
          const shouldBeOpen = dataOpen === "true";
          
          if (!shouldBeOpen) {
            // Hide answer if it should be closed
            if (animationType === "Fade") {
              answer.style.transition = "opacity " + animationDuration + "ms";
              answer.style.opacity = "0";
              answer.hidden = true;
            } else if (animationType === "Slide") {
              answer.style.transition = "max-height " + animationDuration + "ms";
              answer.style.overflow = "hidden";
              answer.style.maxHeight = "0px";
              answer.hidden = true;
            } else {
              answer.hidden = true;
            }
            button.setAttribute("aria-expanded", "false");
            item.setAttribute("data-open", "false");
          } else {
            // Item should be open
            if (animationType === "Fade") {
              answer.style.transition = "opacity " + animationDuration + "ms";
              answer.style.opacity = "1";
              answer.hidden = false;
            } else if (animationType === "Slide") {
              answer.style.transition = "max-height " + animationDuration + "ms";
              answer.style.overflow = "hidden";
              answer.hidden = false;
              answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
              answer.hidden = false;
            }
            button.setAttribute("aria-expanded", "true");
            item.setAttribute("data-open", "true");
          }
          
          // Attach click handler - clone button to remove any existing listeners
          const newButton = button.cloneNode(true);
          button.parentNode.replaceChild(newButton, button);
          
          newButton.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const currentlyOpen = item.getAttribute("data-open") === "true";
            const nextOpen = !currentlyOpen;
            
            // Close other items if single mode
            if (mode === "single" && nextOpen) {
              items.forEach((other, otherIdx) => {
                if (other !== item) {
                  const otherAnswer = other.querySelector(".faq-answer");
                  const otherButton = other.querySelector("[data-accordion-button]");
                  if (otherAnswer && otherButton) {
                    if (animationType === "Fade") {
                      otherAnswer.style.opacity = "0";
                    } else if (animationType === "Slide") {
                      otherAnswer.style.maxHeight = "0px";
                    }
                    otherAnswer.hidden = true;
                    otherButton.setAttribute("aria-expanded", "false");
                    other.setAttribute("data-open", "false");
                  }
                }
              });
            }
            
            // Toggle current item
            item.setAttribute("data-open", nextOpen ? "true" : "false");
            newButton.setAttribute("aria-expanded", String(nextOpen));
            
            if (animationType === "Slide") {
              answer.hidden = false;
              answer.style.overflow = "hidden";
              answer.style.transition = "max-height " + animationDuration + "ms";
              if (nextOpen) {
                answer.style.maxHeight = answer.scrollHeight + "px";
              } else {
                answer.style.maxHeight = "0px";
                setTimeout(() => {
                  answer.hidden = true;
                }, animationDuration);
              }
            } else if (animationType === "Fade") {
              answer.style.transition = "opacity " + animationDuration + "ms";
              answer.style.opacity = nextOpen ? "1" : "0";
              answer.hidden = !nextOpen;
            } else {
              answer.hidden = !nextOpen;
            }
          });
        });
      }
    }
    
    // Find all scripts ONLY within the injected node (not from parent page)
    const scripts = Array.from(node.querySelectorAll("script"));
    
    // Execute each script (skip JSON and JSON-LD scripts)
    scripts.forEach((oldScript, scriptIndex) => {
      // Skip JSON and JSON-LD scripts - they're not JavaScript
      const scriptType = (oldScript.type || "").toLowerCase();
      if (scriptType === "application/ld+json" || 
          scriptType === "application/json" ||
          scriptType.startsWith("application/")) {
        // Non-JavaScript scripts - just remove them (JSON-LD is handled separately)
        oldScript.remove();
        return;
      }
      
      // Only process scripts that are actually inside our node
      if (!node.contains(oldScript)) {
        return;
      }
      
      if (oldScript.src) {
        // External script
        const script = document.createElement("script");
        script.src = oldScript.src;
        script.async = oldScript.async;
        script.defer = oldScript.defer;
        document.head.appendChild(script);
        oldScript.remove();
      } else {
        // Inline JavaScript script - get content before removing
        const scriptContent = oldScript.textContent || "";
        oldScript.remove();
        
        if (scriptContent.trim()) {
          // Check if content looks like JSON (starts with { or [)
          const trimmedContent = scriptContent.trim();
          if (trimmedContent.startsWith("{") || trimmedContent.startsWith("[")) {
            // This looks like JSON, not JavaScript - skip it
            return;
          }
          
          // Execute using eval wrapped in IIFE to maintain scope
          try {
            // Use multiple delays to ensure DOM is fully ready and rendered
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setTimeout(() => {
                  try {
                    // Execute script - wrap in try-catch to catch any errors
                    try {
                      // Inject 'node' variable into scope and execute the script
                      // Replace document.querySelectorAll with node.querySelectorAll in the script
                      let modifiedScript = scriptContent;
                      // If script uses document.querySelectorAll, replace with node.querySelectorAll
                      // But only for .faq-container queries (to avoid breaking other queries)
                      modifiedScript = modifiedScript.replace(
                        /document\.querySelectorAll\(["']\.faq-container["']\)/g,
                        'node.querySelectorAll(".faq-container")'
                      );
                      // Also handle the case where it might be searching for containers
                      modifiedScript = modifiedScript.replace(
                        /document\.querySelectorAll\(["']\.faq-item["']\)/g,
                        'node.querySelectorAll(".faq-item")'
                      );
                      
                      // Execute in a scope where 'node' is available
                      (function() {
                        const node = arguments[0];
                        return eval(modifiedScript);
                      })(node);
                    } catch (scriptError) {
                      // Fallback: try creating script element (browser will execute it)
                      try {
                        const script = document.createElement("script");
                        script.textContent = scriptContent;
                        // Append to the embed node so it has access to the injected HTML
                        node.appendChild(script);
                        // Remove after a moment (browser executes it when appended)
                        setTimeout(() => {
                          if (script.parentNode) {
                            script.parentNode.removeChild(script);
                          }
                        }, 1000);
                      } catch (fallbackError) {
                        // Silently fail
                      }
                    }
                  } catch (evalError) {
                    // If eval fails, try creating script element as fallback
                    try {
                      const script = document.createElement("script");
                      script.textContent = scriptContent;
                      if (document.body) {
                        document.body.appendChild(script);
                      } else {
                        document.head.appendChild(script);
                      }
                    } catch (fallbackError) {
                      // Silently fail
                    }
                  }
                }, 50);
              });
            });
          } catch (error) {
            // Silently fail
          }
        }
      }
    });

    // ALWAYS manually initialize accordion to ensure it works
    // This runs regardless of whether the template script executes successfully
    // Run immediately and with multiple delays to catch any timing issues
    initializeAccordion(); // Run immediately
    
    // Also run after delays to ensure DOM is ready
    setTimeout(initializeAccordion, 100);
    setTimeout(initializeAccordion, 250);
    setTimeout(initializeAccordion, 500);
    setTimeout(initializeAccordion, 1000);

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
