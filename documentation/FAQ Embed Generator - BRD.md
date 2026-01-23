# FAQ Embed Generator - BRD

# **FAQ Embed Generator**

## **Consolidated Product Definition (BRD + UX + Embed Architecture)**

---

## **1. Product Overview**

### **1.1 Product Name (Working)**

FAQ Embed Generator

### **1.2 Product Type**

Single Page Web Application (SPA)

### **1.3 Purpose**

Enable users to generate **SEO-optimized, embeddable FAQ sections** via a design-first interface, without exposing raw code, and usable inside any existing webpage or website builder.

---

## **2. Goals & Non-Goals**

### **2.1 Goals**

- Generate SEO-compliant FAQ sections
- Provide a no-code, design-first experience
- Support one-time purchase monetization
- Prevent easy reuse or modification of generated code
- Work seamlessly with static and dynamic websites

### **2.2 Non-Goals**

- Full website builder
- CMS-based FAQ management
- Analytics or tracking (future)
- Multi-language FAQs (future)

---

## **3. Target Users**

### **Primary Users**

- Web designers
- No-code website builders
- Indie founders
- SEO consultants

### **Assumptions**

- Users can paste embed snippets into HTML fields
- Users are not expected to edit raw code
- Users value SEO correctness and visual quality

---

## **4. Monetization Model**

### **Pricing**

- One-time purchase (lifetime access)

### **Free Tier Limitations**

- Maximum 4 FAQ items
- Only default template
- No styling customization
- One-time embed code copy allowed
- Embed copy permanently locked after first use

### **Paid Tier Unlocks**

- All templates
- Full styling customization
- Higher FAQ limits
- Unlimited embed copies
- No UI restrictions

---

## **5. Locked UX & Layout Design**

### **5.1 Overall Layout (SPA)**

**Three-panel Figma-inspired layout**

```
┌──────────────────────────────────────────────────────────────┐
│ Top Bar (Brand · Template · Auth · Upgrade)                  │
├───────────────┬───────────────────────────┬─────────────────┤
│ Left Panel    │ Center Canvas             │ Right Panel      │
│ Content       │ Live Preview              │ Design + Actions │
└───────────────┴───────────────────────────┴─────────────────┘
```

---

### **5.2 Top Bar (Global)**

**Persistent, minimal**

- Logo + App Name
- Template selector (dropdown)
- User avatar / Login
- Upgrade CTA (free users only)

---

### **5.3 Left Panel — Content (Structure Panel)**

**Purpose:** Define FAQ content and hierarchy

**Width:** ~300px

**Scrollable**

### **Sections**

- Section Heading (text input)
- Section Description (textarea)
- FAQ Items list
    - Question input
    - Answer textarea
    - Add / remove
    - Max 4 for free users

### **Behavior**

- Selecting a question highlights it in preview
- Add button disabled at free limit
- Usage indicator shown for free users

---

### **5.4 Center Panel — Live Canvas (Primary Focus)**

**Purpose:** Visual truth of embed output

### **Characteristics**

- Neutral canvas background
- Pixel-accurate rendering
- Fully interactive accordion
- Desktop / Mobile preview toggle

### **Rules**

- Preview always matches embed output exactly
- No placeholder or mocked content
- Accordion content always visible in DOM for SEO

---

### **5.5 Right Panel — Design + Actions (Inspector)**

**Purpose:** Visual customization and embed action

**Width:** ~340px

### **Sections**

### **Template Selector**

- Vertical list of template thumbnails
- Active template highlighted
- Locked templates blurred + lock icon

### **Styling Controls (Paid Only)**

- **Typography Controls** (for Heading, Description, Question, Answer)
    - Font family selection (9+ options)
    - Font size selection (8 sizes from XS to 4XL)
    - Font weight selection (Light to Bold)
    - Color picker with hex input
- **Colors**
    - Background color picker
    - Background gradient input (CSS gradient syntax)
- **Accordion Settings**
    - Icon style (Chevron, Plus)
    - Animation type (Fade, Slide, None)
    - Animation duration slider (0-1000ms)
    - Border color picker
    - Border width control
- **Spacing**
    - Section padding
    - Item spacing between FAQs

Locked controls are visible but disabled. All styling changes reflect in real-time preview.

### **Embed Action (Sticky Bottom)**

- Primary button: **Copy Embed Code**
- Disabled after first use for free users
- Inline upgrade prompt when locked

---

## **6. Code Visibility Policy**

- Raw HTML / CSS / JS **must never be shown**
- Users interact only via:
    - Live preview
    - Copy Embed Code button
- Embed snippet is minimal and opaque

---

## **7. Embed Architecture (Locked)**

### **7.1 What the User Copies**

Users copy a **small embed snippet** only:

```
<div data-faq-embed="EMBED_ID"></div>
<script src="https://cdn.app.com/faq-embed.js" async></script>
```

---

### **7.2 Embed Runtime Flow**

1. User pastes snippet into website
2. faq-embed.js loads from CDN
3. Script reads data-faq-embed
4. Script requests backend:

```
GET /embed/{embed_id}
```

1. 
2. Backend validates:
    - Embed ID
    - User license
    - Usage rules
3. Backend returns:
    - Pre-rendered FAQ HTML
    - Inline scoped styles
    - JSON-LD FAQ schema
4. Script injects content into DOM

---

### **7.3 Licensing & Protection**

Each embed is bound to:

- User ID
- Embed ID
- Purchase status

### **Protection Measures**

- Obfuscated & minified JS
- License validation per embed
- Optional domain binding
- Integrity hash to detect tampering
- CDN-based delivery (no static reuse)

Failure behavior:

- Graceful embed failure
- Optional watermark or message

---

## **8. SEO Requirements (Mandatory)**

### **Structured Data**

- FAQPage JSON-LD
- Matches visible content exactly
- Injected inline

### **HTML Semantics**

- Proper heading hierarchy
- Accessible accordion markup
- No hidden content

### **Performance**

- Minimal JS
- No render-blocking assets
- Lightweight animations

### **Compliance**

- Content indexable without interaction
- No cloaking
- Google-rich-result safe

---

## **9. Non-Functional Requirements**

### **Performance**

- Instant preview updates
- Embed load < 200ms (CDN target)

### **Compatibility**

- Chrome, Safari, Firefox
- Desktop & mobile
- Website builders and static sites

### **Security**

- Auth required to generate embeds
- Payment-gated features
- Abuse-resistant free tier

---

## **10. Constraints & Assumptions**

- Absolute embed protection is not possible; deterrence is sufficient
- Users manually paste embed code
- SEO rules may evolve → schema must be maintainable

---

## **11. Future Enhancements (Explicitly Out of Scope)**

- Saved projects
- Multi-language support
- FAQ analytics
- CMS integrations
- Agency / white-label mode