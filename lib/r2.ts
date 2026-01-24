import { S3Client, GetObjectCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "faq-templates";

/**
 * Get R2 endpoint URL
 */
function getR2Endpoint(): string {
  if (process.env.R2_ENDPOINT) {
    return process.env.R2_ENDPOINT;
  }
  
  const accountId = process.env.R2_ACCOUNT_ID;
  if (!accountId) {
    throw new Error("R2_ACCOUNT_ID or R2_ENDPOINT must be set");
  }
  
  return `https://${accountId}.r2.cloudflarestorage.com`;
}

/**
 * Check if R2 is configured
 */
function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    (process.env.R2_ENDPOINT || process.env.R2_ACCOUNT_ID)
  );
}

/**
 * Get R2 client (only if configured)
 */
function getR2Client(): S3Client | null {
  if (!isR2Configured()) {
    return null;
  }

  try {
    return new S3Client({
      region: "auto",
      endpoint: getR2Endpoint(),
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  } catch (error) {
    console.error("Error creating R2 client:", error);
    return null;
  }
}

export interface TemplateFile {
  html: string;
  css: string;
  js?: string;
}

/**
 * Get a template from R2
 */
export async function getTemplate(templateId: string): Promise<TemplateFile | null> {
  const client = getR2Client();
  if (!client) {
    return null;
  }

  try {
    const [html, css, js] = await Promise.all([
      getFile(client, `${templateId}/template.html`),
      getFile(client, `${templateId}/template.css`),
      getFile(client, `${templateId}/template.js`).catch(() => null), // JS is optional
    ]);

    if (!html || !css) {
      return null;
    }

    return {
      html,
      css,
      js: js || undefined,
    };
  } catch (error) {
    console.error(`Error loading template ${templateId}:`, error);
    return null;
  }
}

/**
 * Get a single file from R2
 */
async function getFile(client: S3Client, key: string): Promise<string | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    const response = await client.send(command);
    
    if (!response.Body) {
      return null;
    }

    const text = await response.Body.transformToString();
    return text;
  } catch (error: any) {
    if (error.name === "NoSuchKey") {
      return null;
    }
    throw error;
  }
}

/**
 * List all templates in R2
 */
export async function listTemplates(): Promise<string[]> {
  const client = getR2Client();
  if (!client) {
    return [];
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: "",
      Delimiter: "/",
    });

    const response = await client.send(command);
    
    if (!response.CommonPrefixes) {
      return [];
    }

    // Extract template IDs from folder names
    return response.CommonPrefixes
      .map((prefix) => prefix.Prefix?.replace("/", ""))
      .filter((id): id is string => !!id);
  } catch (error) {
    console.error("Error listing templates:", error);
    return [];
  }
}

/**
 * Upload a template to R2 (for admin/development use)
 */
export async function uploadTemplate(
  templateId: string,
  files: TemplateFile
): Promise<boolean> {
  const client = getR2Client();
  if (!client) {
    console.error("R2 is not configured. Please set R2 environment variables.");
    return false;
  }

  try {
    const uploads = [
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: `${templateId}/template.html`,
        Body: files.html,
        ContentType: "text/html",
      }),
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: `${templateId}/template.css`,
        Body: files.css,
        ContentType: "text/css",
      }),
    ];

    if (files.js) {
      uploads.push(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: `${templateId}/template.js`,
          Body: files.js,
          ContentType: "application/javascript",
        })
      );
    }

    await Promise.all(uploads.map((cmd) => client.send(cmd)));
    return true;
  } catch (error) {
    console.error(`Error uploading template ${templateId}:`, error);
    return false;
  }
}

export { getR2Client as r2Client };
