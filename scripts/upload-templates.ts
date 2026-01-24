/**
 * Script to upload template files to Cloudflare R2
 * 
 * Usage: npx tsx scripts/upload-templates.ts
 * 
 * Requires R2 environment variables:
 * - R2_ACCOUNT_ID
 * - R2_ACCESS_KEY_ID
 * - R2_SECRET_ACCESS_KEY
 * - R2_BUCKET_NAME
 * - R2_ENDPOINT (optional)
 */

// Load environment variables from .env.local
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") });
// Also try .env as fallback
config({ path: resolve(process.cwd(), ".env") });

import { uploadTemplate } from "../lib/r2";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const TEMPLATES_DIR = join(process.cwd(), "templates");

interface TemplateFiles {
  html: string;
  css: string;
  js?: string;
}

async function uploadTemplates() {
  // Check if R2 is configured
  const requiredVars = [
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:");
    missingVars.forEach((varName) => console.error(`   - ${varName}`));
    console.error("\n💡 Make sure these are set in your .env.local file");
    process.exit(1);
  }

  console.log("✅ R2 configuration found");
  console.log(`   Account ID: ${process.env.R2_ACCOUNT_ID}`);
  console.log(`   Bucket: ${process.env.R2_BUCKET_NAME}`);
  console.log(`   Endpoint: ${process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`}\n`);

  const templates = ["default", "minimal", "card", "bordered", "split"];

  for (const templateId of templates) {
    const templateDir = join(TEMPLATES_DIR, templateId);
    
    const htmlPath = join(templateDir, "template.html");
    const cssPath = join(templateDir, "template.css");
    const jsPath = join(templateDir, "template.js");

    if (!existsSync(htmlPath) || !existsSync(cssPath)) {
      console.warn(`⚠️  Template ${templateId} missing required files, skipping...`);
      continue;
    }

    const files: TemplateFiles = {
      html: readFileSync(htmlPath, "utf-8"),
      css: readFileSync(cssPath, "utf-8"),
    };

    if (existsSync(jsPath)) {
      files.js = readFileSync(jsPath, "utf-8");
    }

    console.log(`📤 Uploading template: ${templateId}...`);
    const success = await uploadTemplate(templateId, files);

    if (success) {
      console.log(`✅ Successfully uploaded: ${templateId}`);
    } else {
      console.error(`❌ Failed to upload: ${templateId}`);
    }
  }

  console.log("\n✨ Template upload complete!");
}

uploadTemplates().catch(console.error);
