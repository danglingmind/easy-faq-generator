import { FAQStyles } from "./types";
import { TemplateProtection, isPropertyProtected } from "./template-protection";

const fontFamilyMap: Record<string, string> = {
  // System fonts
  Default: "system-ui, -apple-system, sans-serif",
  Serif: "Georgia, serif",
  Mono: "monospace",
  Sans: "sans-serif",
  // Popular Google Fonts - Sans Serif
  Inter: "Inter, sans-serif",
  Roboto: "Roboto, sans-serif",
  "Open Sans": '"Open Sans", sans-serif',
  Lato: "Lato, sans-serif",
  Montserrat: "Montserrat, sans-serif",
  Poppins: "Poppins, sans-serif",
  Nunito: "Nunito, sans-serif",
  Raleway: "Raleway, sans-serif",
  "Source Sans Pro": '"Source Sans Pro", sans-serif',
  Ubuntu: "Ubuntu, sans-serif",
  "Work Sans": '"Work Sans", sans-serif',
  "DM Sans": '"DM Sans", sans-serif',
  "Noto Sans": '"Noto Sans", sans-serif',
  Oswald: "Oswald, sans-serif",
  "Playfair Display": '"Playfair Display", serif',
  Merriweather: "Merriweather, serif",
  "PT Sans": '"PT Sans", sans-serif',
  "Fira Sans": '"Fira Sans", sans-serif',
  Cabin: "Cabin, sans-serif",
  Quicksand: "Quicksand, sans-serif",
  Dosis: "Dosis, sans-serif",
  Barlow: "Barlow, sans-serif",
  Rubik: "Rubik, sans-serif",
  Manrope: "Manrope, sans-serif",
  "Plus Jakarta Sans": '"Plus Jakarta Sans", sans-serif',
  Outfit: "Outfit, sans-serif",
  Figtree: "Figtree, sans-serif",
  "Space Grotesk": '"Space Grotesk", sans-serif',
  Sora: "Sora, sans-serif",
  Epilogue: "Epilogue, sans-serif",
  Lexend: "Lexend, sans-serif",
  "Red Hat Display": '"Red Hat Display", sans-serif',
  "IBM Plex Sans": '"IBM Plex Sans", sans-serif',
  "Public Sans": '"Public Sans", sans-serif',
  Karla: "Karla, sans-serif",
  Hind: "Hind, sans-serif",
  "Titillium Web": '"Titillium Web", sans-serif',
  "Varela Round": '"Varela Round", sans-serif',
  "Maven Pro": '"Maven Pro", sans-serif',
  Comfortaa: "Comfortaa, sans-serif",
  "Josefin Sans": '"Josefin Sans", sans-serif',
  "Libre Franklin": '"Libre Franklin", sans-serif',
  // Serif fonts
  "Crimson Text": '"Crimson Text", serif',
  Lora: "Lora, serif",
  "PT Serif": '"PT Serif", serif',
  "Source Serif Pro": '"Source Serif Pro", serif',
  "Crimson Pro": '"Crimson Pro", serif',
  "Libre Baskerville": '"Libre Baskerville", serif',
  "EB Garamond": '"EB Garamond", serif',
  Bitter: "Bitter, serif",
  "Noto Serif": '"Noto Serif", serif',
  "Roboto Slab": '"Roboto Slab", serif',
  "Zilla Slab": '"Zilla Slab", serif',
  "Bree Serif": '"Bree Serif", serif',
  "Crete Round": '"Crete Round", serif',
  // Script/Handwriting fonts
  "Dancing Script": '"Dancing Script", cursive',
  Pacifico: "Pacifico, cursive",
  Satisfy: "Satisfy, cursive",
  "Great Vibes": '"Great Vibes", cursive',
  Kalam: "Kalam, cursive",
  "Permanent Marker": '"Permanent Marker", cursive',
  Caveat: "Caveat, cursive",
  "Shadows Into Light": '"Shadows Into Light", cursive',
  "Amatic SC": '"Amatic SC", cursive',
  // Display fonts
  Bangers: "Bangers, cursive",
  "Fredoka One": '"Fredoka One", cursive',
  Righteous: "Righteous, cursive",
  Lobster: "Lobster, cursive",
  "Bebas Neue": '"Bebas Neue", cursive',
  Anton: "Anton, sans-serif",
  "Fjalla One": '"Fjalla One", sans-serif',
  "Archivo Black": '"Archivo Black", sans-serif',
  "Black Ops One": '"Black Ops One", cursive',
  Orbitron: "Orbitron, sans-serif",
  Rajdhani: "Rajdhani, sans-serif",
  "Exo 2": '"Exo 2", sans-serif',
  Teko: "Teko, sans-serif",
  "Russo One": '"Russo One", sans-serif',
  "Abril Fatface": '"Abril Fatface", serif',
  "Alfa Slab One": '"Alfa Slab One", cursive',
  Bungee: "Bungee, cursive",
  "Fugaz One": '"Fugaz One", cursive',
  "Luckiest Guy": '"Luckiest Guy", cursive',
  "Passion One": '"Passion One", cursive',
  "Patua One": '"Patua One", cursive',
  Staatliches: "Staatliches, cursive",
  "Titan One": '"Titan One", cursive',
  // Additional serif fonts
  Vollkorn: "Vollkorn, serif",
  Alegreya: "Alegreya, serif",
  "Cormorant Garamond": '"Cormorant Garamond", serif',
  "Gentium Book Basic": '"Gentium Book Basic", serif',
  Lusitana: "Lusitana, serif",
  "Old Standard TT": '"Old Standard TT", serif',
  Spectral: "Spectral, serif",
  Cinzel: "Cinzel, serif",
  Prata: "Prata, serif",
  "Playfair Display SC": '"Playfair Display SC", serif',
  "Bodoni Moda": '"Bodoni Moda", serif',
  Cormorant: "Cormorant, serif",
  Fraunces: "Fraunces, serif",
  "Libre Caslon Display": '"Libre Caslon Display", serif',
  "Yeseva One": '"Yeseva One", serif',
  // Monospace fonts
  "Fira Code": '"Fira Code", monospace',
  "JetBrains Mono": '"JetBrains Mono", monospace',
  "Source Code Pro": '"Source Code Pro", monospace',
  "Roboto Mono": '"Roboto Mono", monospace',
  "Space Mono": '"Space Mono", monospace',
  "Courier Prime": '"Courier Prime", monospace',
  Inconsolata: "Inconsolata, monospace",
  "PT Mono": '"PT Mono", monospace',
  "Overpass Mono": '"Overpass Mono", monospace',
  "Anonymous Pro": '"Anonymous Pro", monospace',
};

const googleFontFamilyMap: Record<string, string> = {
  // Popular Google Fonts - Sans Serif
  Inter: "Inter:wght@300;400;500;600;700",
  Roboto: "Roboto:wght@300;400;500;700",
  "Open Sans": "Open+Sans:wght@300;400;600;700",
  Lato: "Lato:wght@300;400;700",
  Montserrat: "Montserrat:wght@300;400;500;600;700",
  Poppins: "Poppins:wght@300;400;500;600;700",
  Nunito: "Nunito:wght@300;400;500;600;700",
  Raleway: "Raleway:wght@300;400;500;600;700",
  "Source Sans Pro": "Source+Sans+Pro:wght@300;400;600;700",
  Ubuntu: "Ubuntu:wght@300;400;500;700",
  "Work Sans": "Work+Sans:wght@300;400;500;600;700",
  "DM Sans": "DM+Sans:wght@300;400;500;600;700",
  "Noto Sans": "Noto+Sans:wght@300;400;500;600;700",
  Oswald: "Oswald:wght@300;400;500;600;700",
  "Playfair Display": "Playfair+Display:wght@400;500;600;700",
  Merriweather: "Merriweather:wght@300;400;700",
  "PT Sans": "PT+Sans:wght@400;700",
  "Fira Sans": "Fira+Sans:wght@300;400;500;600;700",
  Cabin: "Cabin:wght@400;500;600;700",
  Quicksand: "Quicksand:wght@300;400;500;600;700",
  Dosis: "Dosis:wght@300;400;500;600;700",
  Barlow: "Barlow:wght@300;400;500;600;700",
  Rubik: "Rubik:wght@300;400;500;600;700",
  Manrope: "Manrope:wght@300;400;500;600;700",
  "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@300;400;500;600;700",
  Outfit: "Outfit:wght@300;400;500;600;700",
  Figtree: "Figtree:wght@300;400;500;600;700",
  "Space Grotesk": "Space+Grotesk:wght@300;400;500;600;700",
  Sora: "Sora:wght@300;400;500;600;700",
  Epilogue: "Epilogue:wght@300;400;500;600;700",
  Lexend: "Lexend:wght@300;400;500;600;700",
  "Red Hat Display": "Red+Hat+Display:wght@300;400;500;600;700",
  "IBM Plex Sans": "IBM+Plex+Sans:wght@300;400;500;600;700",
  "Public Sans": "Public+Sans:wght@300;400;500;600;700",
  Karla: "Karla:wght@300;400;500;600;700",
  Hind: "Hind:wght@300;400;500;600;700",
  "Titillium Web": "Titillium+Web:wght@300;400;600;700",
  "Varela Round": "Varela+Round:wght@400",
  "Maven Pro": "Maven+Pro:wght@400;500;600;700",
  Comfortaa: "Comfortaa:wght@300;400;500;600;700",
  "Josefin Sans": "Josefin+Sans:wght@300;400;500;600;700",
  "Libre Franklin": "Libre+Franklin:wght@300;400;500;600;700",
  // Serif fonts
  "Crimson Text": "Crimson+Text:wght@400;600;700",
  Lora: "Lora:wght@400;500;600;700",
  "PT Serif": "PT+Serif:wght@400;700",
  "Source Serif Pro": "Source+Serif+Pro:wght@300;400;600;700",
  "Crimson Pro": "Crimson+Pro:wght@300;400;600;700",
  "Libre Baskerville": "Libre+Baskerville:wght@400;700",
  "EB Garamond": "EB+Garamond:wght@400;500;600;700",
  Bitter: "Bitter:wght@300;400;600;700",
  "Noto Serif": "Noto+Serif:wght@400;700",
  "Roboto Slab": "Roboto+Slab:wght@300;400;500;600;700",
  "Zilla Slab": "Zilla+Slab:wght@300;400;500;600;700",
  "Bree Serif": "Bree+Serif:wght@400",
  "Crete Round": "Crete+Round:wght@400",
  // Script/Handwriting fonts
  "Dancing Script": "Dancing+Script:wght@400;500;600;700",
  Pacifico: "Pacifico:wght@400",
  Satisfy: "Satisfy:wght@400",
  "Great Vibes": "Great+Vibes:wght@400",
  Kalam: "Kalam:wght@300;400;700",
  "Permanent Marker": "Permanent+Marker:wght@400",
  Caveat: "Caveat:wght@400;500;600;700",
  "Shadows Into Light": "Shadows+Into+Light:wght@400",
  "Amatic SC": "Amatic+SC:wght@400;700",
  // Display fonts
  Bangers: "Bangers:wght@400",
  "Fredoka One": "Fredoka+One:wght@400",
  Righteous: "Righteous:wght@400",
  Lobster: "Lobster:wght@400",
  "Bebas Neue": "Bebas+Neue:wght@400",
  Anton: "Anton:wght@400",
  "Fjalla One": "Fjalla+One:wght@400",
  "Archivo Black": "Archivo+Black:wght@400",
  "Black Ops One": "Black+Ops+One:wght@400",
  Orbitron: "Orbitron:wght@300;400;500;600;700",
  Rajdhani: "Rajdhani:wght@300;400;500;600;700",
  "Exo 2": "Exo+2:wght@300;400;500;600;700",
  Teko: "Teko:wght@300;400;500;600;700",
  "Russo One": "Russo+One:wght@400",
  "Abril Fatface": "Abril+Fatface:wght@400",
  "Alfa Slab One": "Alfa+Slab+One:wght@400",
  Bungee: "Bungee:wght@400",
  "Fugaz One": "Fugaz+One:wght@400",
  "Luckiest Guy": "Luckiest+Guy:wght@400",
  "Passion One": "Passion+One:wght@400",
  "Patua One": "Patua+One:wght@400",
  Staatliches: "Staatliches:wght@400",
  "Titan One": "Titan+One:wght@400",
  // Additional serif fonts
  Vollkorn: "Vollkorn:wght@400;600;700",
  Alegreya: "Alegreya:wght@400;500;600;700",
  "Cormorant Garamond": "Cormorant+Garamond:wght@300;400;500;600;700",
  "Gentium Book Basic": "Gentium+Book+Basic:wght@400;700",
  Lusitana: "Lusitana:wght@400;700",
  "Old Standard TT": "Old+Standard+TT:wght@400;700",
  Spectral: "Spectral:wght@300;400;600;700",
  Cinzel: "Cinzel:wght@400;500;600;700",
  Prata: "Prata:wght@400",
  "Playfair Display SC": "Playfair+Display+SC:wght@400",
  "Bodoni Moda": "Bodoni+Moda:wght@400;500;600;700",
  Cormorant: "Cormorant:wght@300;400;500;600;700",
  Fraunces: "Fraunces:wght@300;400;500;600;700",
  "Libre Caslon Display": "Libre+Caslon+Display:wght@400",
  "Yeseva One": "Yeseva+One:wght@400",
  // Monospace fonts
  "Fira Code": "Fira+Code:wght@300;400;500;600;700",
  "JetBrains Mono": "JetBrains+Mono:wght@300;400;500;600;700",
  "Source Code Pro": "Source+Code+Pro:wght@300;400;500;600;700",
  "Roboto Mono": "Roboto+Mono:wght@300;400;500;700",
  "Space Mono": "Space+Mono:wght@400;700",
  "Courier Prime": "Courier+Prime:wght@400;700",
  Inconsolata: "Inconsolata:wght@300;400;500;600;700",
  "PT Mono": "PT+Mono:wght@400;700",
  "Overpass Mono": "Overpass+Mono:wght@300;400;600;700",
  "Anonymous Pro": "Anonymous+Pro:wght@400;700",
};

const fontSizeMap: Record<string, string> = {
  XS: "0.75rem",
  SM: "0.875rem",
  MD: "1rem",
  LG: "1.125rem",
  XL: "1.25rem",
  "2XL": "1.5rem",
  "3XL": "1.875rem",
  "4XL": "2.25rem",
};

const fontWeightMap: Record<string, string> = {
  Light: "300",
  Normal: "400",
  Medium: "500",
  Semibold: "600",
  Bold: "700",
};

/**
 * Detect if a template should be protected from user customizations
 * A template is considered "protected" if it uses !important in its CSS,
 * indicating it has strong styling preferences that shouldn't be overridden
 * 
 * See TEMPLATE_FORMAT.md for template format specification
 */
function isTemplateProtected(templateCSS?: string): boolean {
  if (!templateCSS) return false;
  // Check if template CSS uses !important (indicating it wants to control styling)
  // We look for a reasonable threshold - if more than 3 properties use !important,
  // the template likely wants full control
  // This follows the standard defined in TEMPLATE_FORMAT.md
  const importantMatches = templateCSS.match(/!important/gi);
  return importantMatches ? importantMatches.length > 3 : false;
}

/**
 * Generate dynamic CSS from styles object
 * This applies user customizations to the template
 * 
 * @param styles - The styles object
 * @param templateId - Optional template ID for higher specificity selectors
 * @param templateCSS - Optional template CSS (for backward compatibility)
 * @param protection - Optional protection object to control which properties are editable
 */
export function generateDynamicCSS(
  styles: FAQStyles, 
  templateId?: string, 
  templateCSS?: string,
  protection?: TemplateProtection | null
): string {
  const {
    heading,
    description,
    question,
    answer,
    backgroundColor,
    backgroundGradient,
    accordion,
    spacing,
  } = styles;

  const bg = backgroundGradient || backgroundColor;
  const fontsToLoad = new Set<string>();
  [heading.fontFamily, description.fontFamily, question.fontFamily, answer.fontFamily].forEach(
    (font) => {
      if (font && googleFontFamilyMap[font]) {
        fontsToLoad.add(googleFontFamilyMap[font]);
      }
    }
  );
  const googleFontsImport =
    fontsToLoad.size > 0
      ? `@import url("https://fonts.googleapis.com/css2?${Array.from(fontsToLoad)
          .map((family) => `family=${family}`)
          .join("&")}&display=swap");\n`
      : "";
  
  // Use protection if provided, otherwise fall back to old detection method for backward compatibility
  const isTemplateControlled = protection 
    ? Object.values(protection).some(v => v === true) // If any property is protected, use old behavior as fallback
    : isTemplateProtected(templateCSS);
  
  // Helper to check if a property is protected
  const isProtected = (path: string) => protection ? isPropertyProtected(protection, path) : false;

  // Defensive check for borderSides - ensure it exists and has all properties
  const borderSides = accordion.borderSides || {
    top: true,
    right: true,
    bottom: true,
    left: true,
  };

  // Get border properties with proper defaults
  const borderVisible = accordion.borderVisible !== undefined ? accordion.borderVisible : true;
  const borderWidth = accordion.borderWidth ?? 1;
  const borderStyle = accordion.borderStyle || "solid";
  const borderColor = accordion.borderColor || "#e5e5e5";

  return `
    ${googleFontsImport}
    /* Use higher specificity selector for templates that use data-template attribute */
    /* Use higher specificity selector for templates that use data-template attribute */
    ${templateId ? `.faq-container[data-template="${templateId}"]` : '.faq-container'} {
      ${!isProtected('backgroundColor') ? `background: ${bg} !important;` : ''}
      ${!isProtected('spacing.sectionPadding') ? `padding: ${spacing.sectionPadding}px !important;` : ''}
      font-family: ${fontFamilyMap[heading.fontFamily] || fontFamilyMap.Default} !important;
    }
    ${templateId ? `.faq-container[data-template="${templateId}"] .faq-heading` : '.faq-heading'} {
      ${!isProtected('heading.fontFamily') ? `font-family: ${fontFamilyMap[heading.fontFamily] || fontFamilyMap.Default} !important;` : ''}
      ${!isProtected('heading.fontSize') ? `font-size: ${fontSizeMap[heading.fontSize]} !important;` : ''}
      ${!isProtected('heading.fontWeight') ? `font-weight: ${fontWeightMap[heading.fontWeight]} !important;` : ''}
      ${!isProtected('heading.color') ? `color: ${heading.color} !important;` : ''}
    }
    ${templateId ? `.faq-container[data-template="${templateId}"] .faq-description` : '.faq-description'} {
      ${!isProtected('description.fontFamily') ? `font-family: ${fontFamilyMap[description.fontFamily] || fontFamilyMap.Default} !important;` : ''}
      ${!isProtected('description.fontSize') ? `font-size: ${fontSizeMap[description.fontSize]} !important;` : ''}
      ${!isProtected('description.fontWeight') ? `font-weight: ${fontWeightMap[description.fontWeight]} !important;` : ''}
      ${!isProtected('description.color') ? `color: ${description.color} !important;` : ''}
    }
    /* Use higher specificity selector for templates that use data-template attribute */
    ${templateId ? `.faq-container[data-template="${templateId}"] .faq-item` : '.faq-item'} {
      ${!isProtected('spacing.itemSpacing') ? `margin-bottom: ${spacing.itemSpacing}px !important;` : ''}
      ${
        borderVisible && !isProtected('accordion.borderVisible')
          ? `
        /* Explicitly set each border side individually for proper control */
        ${
          borderSides.top && !isProtected('accordion.borderColor') && !isProtected('accordion.borderWidth') && !isProtected('accordion.borderStyle')
            ? `border-top: ${borderWidth}px ${borderStyle} ${borderColor} !important;`
            : borderSides.top ? "border-top: none !important;" : ""
        }
        ${
          borderSides.right && !isProtected('accordion.borderColor') && !isProtected('accordion.borderWidth') && !isProtected('accordion.borderStyle')
            ? `border-right: ${borderWidth}px ${borderStyle} ${borderColor} !important;`
            : borderSides.right ? "border-right: none !important;" : ""
        }
        ${
          borderSides.bottom && !isProtected('accordion.borderColor') && !isProtected('accordion.borderWidth') && !isProtected('accordion.borderStyle')
            ? `border-bottom: ${borderWidth}px ${borderStyle} ${borderColor} !important;`
            : borderSides.bottom ? "border-bottom: none !important;" : ""
        }
        ${
          borderSides.left && !isProtected('accordion.borderColor') && !isProtected('accordion.borderWidth') && !isProtected('accordion.borderStyle')
            ? `border-left: ${borderWidth}px ${borderStyle} ${borderColor} !important;`
            : borderSides.left ? "border-left: none !important;" : ""
        }
      `
          : !isProtected('accordion.borderVisible') ? `
        border-top: none !important;
        border-right: none !important;
        border-bottom: none !important;
        border-left: none !important;
      ` : ''
      }
    }
    /* Use higher specificity selector for templates that use data-template attribute */
    ${templateId ? `.faq-container[data-template="${templateId}"] .faq-question` : '.faq-question'} {
      ${!isProtected('question.fontFamily') ? `font-family: ${fontFamilyMap[question.fontFamily] || fontFamilyMap.Default} !important;` : ''}
      ${!isProtected('question.fontSize') ? `font-size: ${fontSizeMap[question.fontSize]} !important;` : ''}
      ${!isProtected('question.fontWeight') ? `font-weight: ${fontWeightMap[question.fontWeight]} !important;` : ''}
      ${!isProtected('question.color') ? `color: ${question.color} !important;` : ''}
      ${!isProtected('accordion.paddingX') && !isProtected('accordion.paddingY') ? `padding: ${accordion.paddingY}px ${accordion.paddingX}px !important;` : 
        !isProtected('accordion.paddingX') && isProtected('accordion.paddingY') ? `padding-left: ${accordion.paddingX}px !important; padding-right: ${accordion.paddingX}px !important;` :
        isProtected('accordion.paddingX') && !isProtected('accordion.paddingY') ? `padding-top: ${accordion.paddingY}px !important; padding-bottom: ${accordion.paddingY}px !important;` : ''}
      ${!isProtected('accordion.marginX') && !isProtected('accordion.marginY') ? `margin: ${accordion.marginY}px ${accordion.marginX}px !important;` : 
        !isProtected('accordion.marginX') && isProtected('accordion.marginY') ? `margin-left: ${accordion.marginX}px !important; margin-right: ${accordion.marginX}px !important;` :
        isProtected('accordion.marginX') && !isProtected('accordion.marginY') ? `margin-top: ${accordion.marginY}px !important; margin-bottom: ${accordion.marginY}px !important;` : ''}
    }
    ${templateId ? `.faq-container[data-template="${templateId}"] .faq-answer` : '.faq-answer'} {
      ${!isProtected('answer.fontFamily') ? `font-family: ${fontFamilyMap[answer.fontFamily] || fontFamilyMap.Default} !important;` : ''}
      ${!isProtected('answer.fontSize') ? `font-size: ${fontSizeMap[answer.fontSize]} !important;` : ''}
      ${!isProtected('answer.fontWeight') ? `font-weight: ${fontWeightMap[answer.fontWeight]} !important;` : ''}
      ${!isProtected('answer.color') ? `color: ${answer.color} !important;` : ''}
      ${!isProtected('accordion.paddingX') && !isProtected('accordion.paddingY') ? `padding: 0 ${accordion.paddingX}px ${accordion.paddingY}px !important;` : 
        !isProtected('accordion.paddingX') && isProtected('accordion.paddingY') ? `padding-left: ${accordion.paddingX}px !important; padding-right: ${accordion.paddingX}px !important;` :
        isProtected('accordion.paddingX') && !isProtected('accordion.paddingY') ? `padding-bottom: ${accordion.paddingY}px !important;` : ''}
      ${!isProtected('accordion.marginX') && !isProtected('accordion.marginY') ? `margin: 0 ${accordion.marginX}px ${accordion.marginY}px !important;` : 
        !isProtected('accordion.marginX') && isProtected('accordion.marginY') ? `margin-left: ${accordion.marginX}px !important; margin-right: ${accordion.marginX}px !important;` :
        isProtected('accordion.marginX') && !isProtected('accordion.marginY') ? `margin-bottom: ${accordion.marginY}px !important;` : ''}
      ${accordion.animationType === "Fade" ? `transition: opacity ${accordion.animationDuration}ms !important;` : ""}
      ${accordion.animationType === "Slide" ? `transition: max-height ${accordion.animationDuration}ms !important;` : ""}
    }
    .faq-icon {
      transition: transform ${accordion.animationDuration}ms !important;
    }
  `;
}
