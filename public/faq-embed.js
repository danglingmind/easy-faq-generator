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

    console.log("[FAQ Embed] Injecting embed into node:", node);

    // Inject styles
    const styleId = `faq-embed-styles-${node.getAttribute("data-faq-embed")}`;
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = payload.css;
      document.head.appendChild(style);
      console.log("[FAQ Embed] Styles injected");
    }

    // Simple approach: inject HTML, then extract and execute scripts
    node.innerHTML = payload.html;
    console.log("[FAQ Embed] HTML injected, looking for scripts...");
    
    // Define manual accordion initialization function OUTSIDE the script execution
    // This ensures it always runs, regardless of script execution success/failure
    function initializeAccordion() {
      console.log("[FAQ Embed] Starting manual accordion initialization...");
      const containersAfter = node.querySelectorAll(".faq-container");
      console.log("[FAQ Embed] Containers found in node:", containersAfter.length);
      
      if (containersAfter.length > 0) {
        const container = containersAfter[0];
        const items = container.querySelectorAll(".faq-item");
        console.log("[FAQ Embed] FAQ items found:", items.length);
        
        // Get animation config from container
        const animationType = container.getAttribute("data-animation-type") || "Fade";
        const animationDuration = parseInt(container.getAttribute("data-animation-duration") || "300", 10);
        const mode = container.getAttribute("data-accordion-mode") || "single";
        
        console.log("[FAQ Embed] Animation config:", { animationType, animationDuration, mode });
        
        items.forEach((item, idx) => {
          const button = item.querySelector("[data-accordion-button]");
          const answer = item.querySelector(".faq-answer");
          
          if (!button || !answer) {
            console.warn("[FAQ Embed] Item", idx, "missing button or answer");
            return;
          }
          
          const dataOpen = item.getAttribute("data-open");
          console.log("[FAQ Embed] Item", idx, "data-open:", dataOpen, "answer.hidden:", answer.hidden);
          
          // Set initial state - items should be closed by default unless explicitly set to "true"
          const shouldBeOpen = dataOpen === "true";
          
          if (!shouldBeOpen) {
            // Hide answer if it should be closed
            console.log("[FAQ Embed] Closing item", idx, "- setting hidden and styles");
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
            console.log("[FAQ Embed] Item", idx, "closed - hidden:", answer.hidden);
          } else {
            // Item should be open
            console.log("[FAQ Embed] Item", idx, "should be open");
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
            console.log("[FAQ Embed] Button clicked for item", idx);
            
            const currentlyOpen = item.getAttribute("data-open") === "true";
            const nextOpen = !currentlyOpen;
            console.log("[FAQ Embed] Toggling item", idx, "from", currentlyOpen, "to", nextOpen);
            
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
                    console.log("[FAQ Embed] Closed item", otherIdx);
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
            
            console.log("[FAQ Embed] Item", idx, "now", nextOpen ? "open" : "closed");
          });
          
          console.log("[FAQ Embed] Event listener attached to item", idx);
        });
        
        console.log("[FAQ Embed] Manual accordion initialization complete");
      } else {
        console.warn("[FAQ Embed] No containers found for manual initialization!");
      }
    }
    
    // Find all scripts ONLY within the injected node (not from parent page)
    const scripts = Array.from(node.querySelectorAll("script"));
    console.log("[FAQ Embed] Found", scripts.length, "script(s) in injected HTML");
    
    // Execute each script (skip JSON and JSON-LD scripts)
    scripts.forEach((oldScript, scriptIndex) => {
      console.log("[FAQ Embed] Processing script", scriptIndex + 1, "of", scripts.length);
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
            console.warn("Skipping script that appears to be JSON:", trimmedContent.substring(0, 50));
            return;
          }
          
          // Execute using eval wrapped in IIFE to maintain scope
          try {
            // Use multiple delays to ensure DOM is fully ready and rendered
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setTimeout(() => {
                  try {
                    console.log("[FAQ Embed] Executing accordion script...");
                    console.log("[FAQ Embed] Node content check:", node.innerHTML.substring(0, 100));
                    console.log("[FAQ Embed] Looking for .faq-container in node:", node.querySelectorAll(".faq-container").length);
                    console.log("[FAQ Embed] Looking for .faq-container in document:", document.querySelectorAll(".faq-container").length);
                    
                    // Log script content for debugging
                    console.log("[FAQ Embed] Script content length:", scriptContent.length);
                    console.log("[FAQ Embed] Script content preview:", scriptContent.substring(0, 200));
                    console.log("[FAQ Embed] Script content ends with:", scriptContent.substring(scriptContent.length - 50));
                    
                    // Execute script - wrap in try-catch to catch any errors
                    try {
                      console.log("[FAQ Embed] About to execute script with eval...");
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
                      const result = (function() {
                        const node = arguments[0];
                        return eval(modifiedScript);
                      })(node);
                      console.log("[FAQ Embed] Script eval returned:", result);
                      console.log("[FAQ Embed] Script eval completed without errors");
                    } catch (scriptError) {
                      console.error("[FAQ Embed] Script execution error:", scriptError);
                      console.error("[FAQ Embed] Error name:", scriptError.name);
                      console.error("[FAQ Embed] Error message:", scriptError.message);
                      console.error("[FAQ Embed] Error stack:", scriptError.stack);
                      
                      // Fallback: try creating script element (browser will execute it)
                      console.log("[FAQ Embed] Attempting fallback: creating script element...");
                      try {
                        const script = document.createElement("script");
                        script.textContent = scriptContent;
                        // Append to the embed node so it has access to the injected HTML
                        node.appendChild(script);
                        console.log("[FAQ Embed] Fallback: Script element appended to embed node");
                        // Remove after a moment (browser executes it when appended)
                        setTimeout(() => {
                          if (script.parentNode) {
                            script.parentNode.removeChild(script);
                          }
                        }, 1000);
                      } catch (fallbackError) {
                        console.error("[FAQ Embed] Fallback also failed:", fallbackError);
                      }
                    }
                    
                    console.log("[FAQ Embed] Accordion script execution attempt completed");
                  }, 50);
                  } catch (evalError) {
                    console.error("[FAQ Embed] Error executing embed script:", evalError);
                    console.error("[FAQ Embed] Script content (first 200 chars):", scriptContent.substring(0, 200));
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
                      console.error("[FAQ Embed] Fallback script execution also failed:", fallbackError);
                    }
                  }
                }, 100); // Increased delay to ensure DOM is fully ready
              });
            });
          } catch (error) {
            console.error("[FAQ Embed] Error setting up script execution:", error);
          }
        }
      }
    });

    // ALWAYS manually initialize accordion to ensure it works
    // This runs regardless of whether the template script executes successfully
    // Run immediately and with multiple delays to catch any timing issues
    console.log("[FAQ Embed] Setting up manual accordion initialization...");
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
