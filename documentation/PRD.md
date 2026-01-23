# PRD

# **Product Requirements Document (PRD)**

## **FAQ Embed Generator**

---

## **1. Product Summary**

### **1.1 Product Name**

FAQ Embed Generator (working name)

### **1.2 Product Type**

Design-first Single Page Application (SPA)

### **1.3 Objective**

Enable users to visually design **SEO-optimized FAQ sections** and embed them into existing websites using a protected embed snippet, without exposing raw code.

---

## **2. Tech Stack (Locked)**

The following stack **must be used exclusively**.

| **Layer** | **Technology** |
| --- | --- |
| Frontend | **Next.js (App Router) + TypeScript** |
| UI System | **shadcn/ui** |
| Animations | CSS + subtle motion (no heavy animation libs) |
| Hosting | **Vercel** |
| Database (if needed) | **Supabase** |
| Authentication | **Clerk** |
| Payments | **Stripe** |
| Analytics | **Google Analytics** |
| Session Recording | **Microsoft Clarity** |
| Email | **MailerLite** |

---

## **3. Architectural Principles**

### **3.1 Core Principles**

- **SOLID principles must be followed strictly**
- Clear separation of concerns
- UI ≠ business logic ≠ embed runtime
- Embed runtime must be isolated from app UI

### **3.2 Application Boundaries**

- App UI: user-facing editor
- Embed runtime: CDN-served, license-validated, SEO-safe
- Backend APIs: stateless, edge-compatible where possible

---

## **4. User Roles**

### **4.1 Free User**

- Authenticated via Clerk
- Limited usage
- Can explore full UI visually

### **4.2 Paid User**

- One-time purchase verified via Stripe
- No functional restrictions
- Unlimited embed usage

---

## **5. Functional Requirements**

---

### **5.1 Authentication**

### **Requirements**

- Clerk authentication required before:
    - Creating FAQs
    - Copying embed code
- Clerk user ID used as primary identity key

### **Acceptance Criteria**

- User cannot access editor without login
- User session persists across reloads

---

### **5.2 FAQ Content Management**

### **Capabilities**

- Edit section heading
- Edit section description
- Add, edit, delete FAQ items

### **Constraints**

- Free users: max 4 FAQ items
- Paid users: configurable higher limit

### **Acceptance Criteria**

- Changes instantly reflect in preview
- Limits enforced at UI and logic level

---

### **5.3 Template System**

### **Requirements**

- Multiple predefined FAQ templates
- Templates differ in:
    - Layout
    - Accordion behavior
    - Visual hierarchy

### **Access Rules**

- Free users: default template only
- Paid users: all templates

### **Acceptance Criteria**

- Locked templates visible but disabled
- Switching templates updates preview immediately

---

### **5.4 Styling Customization (Inspector Panel)**

### **Customizable Properties (Paid Only)**

- **Typography - Heading**
    - Font family (Default, Serif, Mono, Sans, Inter, Roboto, Open Sans, Lato, Montserrat, Poppins)
    - Font size (XS to 4XL)
    - Font weight (Light to Bold)
    - Text color
- **Typography - Description**
    - Font family
    - Font size
    - Font weight
    - Text color
- **Typography - Question**
    - Font family
    - Font size
    - Font weight
    - Text color
- **Typography - Answer**
    - Font family
    - Font size
    - Font weight
    - Text color
- **Colors**
    - Background color (with color picker)
    - Background gradient (CSS gradient syntax)
- **Accordion**
    - Icon style (Chevron, Plus)
    - Animation type (Fade, Slide, None)
    - Animation duration (0-1000ms slider)
    - Border full styling
    - x/y padding and margin of inside accordion question and answer item
- **Spacing**
    - Section padding
    - Item spacing

### **Acceptance Criteria**

- Styling updates are real-time and reflect immediately in preview
- All font changes apply correctly using proper CSS font-family values
- Color pickers with hex input for precise control
- Free users see disabled controls with upgrade hints

---

### **5.5 Live Preview Canvas using iframe**

### **Requirements**

- Central canvas shows exact embed output
- Desktop / Mobile preview toggle
- Accordion interactions fully functional

### **SEO Rule**

- All FAQ content must exist in DOM at render time

### **Acceptance Criteria**

- Preview matches embed output 1:1
- No mocked or placeholder behavior

---

### **5.6 Embed Code Generation**

### **User Interaction**

- User clicks **Copy Embed Code**
- Raw code is never displayed

### **Copy Rules**

- Free user:
    - 1 copy allowed
    - Button permanently locked after use
- Paid user:
    - Unlimited copies

### **Acceptance Criteria**

- Copy event tracked
- Lock enforced even after reload

---

## **6. Embed Architecture (Technical Requirements)**

### **6.1 Embed Snippet (User-Facing)**

```
<div data-faq-embed="EMBED_ID"></div>
<script src="https://cdn.app.com/faq-embed.js" async></script>
```

---

### **6.2 Runtime Flow**

1. faq-embed.js loads from CDN
2. Reads data-faq-embed
3. Calls backend:

```
GET /api/embed/{embed_id}
```

1. 
2. Backend validates:
    - Embed ID
    - User license
    - Usage rules
3. Backend responds with:
    - Pre-rendered FAQ HTML
    - Inline scoped CSS
    - JSON-LD FAQ schema
4. Script injects content into DOM

---

### **6.3 Licensing Enforcement**

### **Binding**

Each embed is bound to:

- Clerk user ID
- Embed ID
- Purchase status

### **Protection Mechanisms**

- Obfuscated JS
- Embed integrity hash
- Optional domain binding
- CDN delivery only

### **Failure Behavior**

- Graceful failure
- Optional watermark message

---

## **7. SEO Requirements (Mandatory)**

### **Structured Data**

- FAQPage JSON-LD
- Matches visible content exactly

### **HTML Semantics**

- Proper heading structure
- Accessible accordion (ARIA)

### **Performance**

- No render-blocking JS
- Minimal runtime script
- CDN-served embed assets

### **Compliance**

- No cloaking
- No hidden FAQ answers
- Google rich-results safe

---

## **8. Analytics & Tracking**

### **Google Analytics**

Track:

- Page views
- Template selection
- Embed copy attempts
- Upgrade clicks

### **Microsoft Clarity**

Track:

- Session recordings
- Heatmaps
- UX friction points

---

## **9. Email & Lifecycle Communication**

### **MailerLite Integration**

### **Events**

- User signup → add to “Users” group
- Purchase completed → add to “Paid Users” group

### **Responsibility**

- App only sends user + event
- MailerLite automations handle email logic

---

## **10. Payment Flow (Stripe)**

### **Model**

- One-time purchase

### **Flow**

1. User clicks Upgrade
2. Stripe Checkout
3. Webhook confirms payment
4. User marked as paid
5. UI unlocks immediately

### **Acceptance Criteria**

- Payment state reflected within same session
- Stripe webhook is source of truth

---

## **11. UI System & Design Rules**

### **UI Library**

- shadcn/ui only

### **Design Constraints**

- Neutral color palette
- Minimal shadows
- Subtle transitions
- No flashy animations

### **Layout (Locked)**

```
Left Panel    → Content (FAQs)
Center Canvas → Live Preview (using iframe)
Right Panel   → Templates, Styles, Embed Action
```

---

## **12. Data Persistence (Neon.tech – If Needed)**

### **Possible Tables**

- embeds
- faq_definitions
- user_usage
- templates (static or semi-static)

### **Rules**

- Do not store unnecessary state
- Embed output must be derivable from stored config

---

## **13. Non-Functional Requirements**

| **Category** | **Requirement** |
| --- | --- |
| Performance | Preview updates < 100ms |
| Embed Load | < 200ms from CDN |
| Reliability | Embed must not break host page |
| Security | Auth & payment gated |
| Scalability | CDN-first embed delivery |

---

## **14. Out of Scope (Explicit)**

- Multi-language support
- Analytics for FAQ clicks
- CMS integrations
- White-label mode
- Versioned FAQ history