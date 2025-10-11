/**
 * Script de diagnostic Cloudinary
 * Vérifie où se trouvent les templates PDF et leur configuration
 */
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PUBLIC_IDS = [
  'convention_template_pn9fte',
  'emargement_template_jco15s',
  'form-me/pdf-templates/convention_template_pn9fte',
  'form-me/pdf-templates/emargement_template_jco15s',
];

async function probe(publicId: string, resource_type: 'raw' | 'image') {
  try {
    const res = await cloudinary.api.resource(publicId, { resource_type });
    console.log(`\n✓ [FOUND][${resource_type}] ${publicId}`);
    console.log({
      public_id: res.public_id,
      type: res.type,
      format: res.format,
      bytes: res.bytes,
      secure_url: res.secure_url,
      created_at: res.created_at,
    });
    return res;
  } catch (e: any) {
    console.log(`✗ [MISS][${resource_type}] ${publicId}: ${e?.error?.message ?? e?.message}`);
    return null;
  }
}

async function listAllRawAssets() {
  try {
    console.log('\n=== Listing all RAW assets ===');
    const result = await cloudinary.api.resources({
      resource_type: 'raw',
      type: 'upload',
      max_results: 100,
    });

    console.log(`Found ${result.resources.length} raw assets:`);
    for (const asset of result.resources) {
      if (asset.public_id.includes('template') || asset.public_id.includes('pdf')) {
        console.log({
          public_id: asset.public_id,
          format: asset.format,
          bytes: asset.bytes,
          secure_url: asset.secure_url,
        });
      }
    }
  } catch (e: any) {
    console.error('Error listing assets:', e?.error?.message ?? e?.message);
  }
}

(async () => {
  console.log('=== Cloudinary Template Diagnostics ===\n');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('API Key:', process.env.CLOUDINARY_API_KEY?.substring(0, 5) + '...');

  // Test each public_id with both resource types
  for (const publicId of PUBLIC_IDS) {
    console.log(`\n--- Testing: ${publicId} ---`);
    await probe(publicId, 'raw');
    await probe(publicId, 'image');
  }

  // List all raw assets
  await listAllRawAssets();

  console.log('\n=== Diagnosis Complete ===');
})();
