# Embed Renderer Implementation Plan

## **(The Heart of the Product)**

This is **exactly how the embed works**.

---

## **2.1 Runtime Lifecycle (Deterministic)**

```
User Page Loads
   ↓
faq-embed.js loads
   ↓
Finds <div data-faq-embed="ID">
   ↓
Calls /api/public/embed/ID
   ↓
Validates response
   ↓
Injects HTML + CSS + JSON-LD
```

---

## **2.2**

## **faq-embed.ts**

## **(Entry Point)**

### **Responsibilities**

- DOM scanning
- Network orchestration
- Failure handling

```
findAllEmbedNodes()
loadEmbedPayload(embedId)
injectEmbed(node, payload)
```

❌ No rendering logic

❌ No config interpretation

---

## **2.3**

## **injector.ts**

Responsible for **safe DOM insertion**.

```
injectHTML(container, html)
injectStyle(css)
injectSchema(schema)
```

Rules:

- Scoped styles only
- No global CSS pollution
- Schema injected once per embed

---

## **2.4**

## **integrity.ts**

Commercial protection layer.

```
verifyIntegrity(payload)
```

Checks:

- Hash match
- Payload completeness
- Version compatibility

Failure → silent no-op or watermark

---

## **2.5 Server-Side Embed Payload Generation**

**Location:**

/api/public/embed/[embedId]

### **Flow**

```
const config = getEmbedConfig(embedId)
assertLicenseValid(config.userId)

return {
  html: renderFaqHTML(config),
  css: renderScopedCSS(config),
  schema: renderJsonLd(config),
  integrity: generateHash(...)
}
```