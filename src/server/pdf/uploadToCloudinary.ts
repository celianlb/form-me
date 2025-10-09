/**
 * Service: Upload de PDF vers Cloudinary
 * Upload un Buffer PDF vers Cloudinary et retourne l'URL + publicId
 */

import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary (les variables d'env doivent être définies)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface UploadResult {
  url: string;
  publicId: string;
}

export async function uploadPdfToCloudinary(
  pdfBuffer: Buffer,
  folder: string = 'generated-docs',
  filename?: string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'raw', // Pour les PDF
        format: 'pdf',
        public_id: filename,
        invalidate: true, // Invalide le cache CDN si remplacement
      },
      (error, result) => {
        if (error || !result) {
          console.error('[uploadPdfToCloudinary] Error:', error);
          reject(
            new Error(
              `Cloudinary upload failed: ${error?.message || 'Unknown error'}`
            )
          );
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    // Pipe le buffer vers le stream Cloudinary
    uploadStream.end(pdfBuffer);
  });
}

/**
 * Upload d'un template PDF (utilisé lors de la création de template)
 */
export async function uploadTemplatePdf(
  pdfBuffer: Buffer,
  templateName: string
): Promise<UploadResult> {
  const sanitizedName = templateName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .substring(0, 50);

  return uploadPdfToCloudinary(
    pdfBuffer,
    'pdf-templates',
    `template_${sanitizedName}_${Date.now()}`
  );
}

/**
 * Upload d'un document généré
 */
export async function uploadGeneratedPdf(
  pdfBuffer: Buffer,
  templateId: string
): Promise<UploadResult> {
  return uploadPdfToCloudinary(
    pdfBuffer,
    'generated-docs',
    `doc_${templateId}_${Date.now()}`
  );
}
