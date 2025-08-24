import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Configuration pour augmenter la limite de taille des requêtes
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes timeout

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 401 }
      );
    }

    // Récupération du fichier depuis FormData
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Validation du type de fichier
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé" },
        { status: 400 }
      );
    }

    // Limitation de taille (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 50MB)" },
        { status: 400 }
      );
    }

    // Conversion du fichier en Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Détermination du type de ressource Cloudinary
    const resourceType = file.type.startsWith('video/') ? 'video' : 'auto';
    
    // Upload vers Cloudinary avec limite augmentée
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: 'form-me/supports', // Dossier organisé
          public_id: `support_${Date.now()}`, // Nom unique
          original_filename: file.name,
          chunk_size: 50000000, // 50MB chunks
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    if (!result || typeof result !== 'object' || !('secure_url' in result)) {
      throw new Error('Upload failed');
    }

    const uploadResult = result as { 
      secure_url: string; 
      public_id: string; 
      bytes: number; 
      format: string;
      original_filename: string;
    };

    // Détermination du type de fichier pour la base de données
    const getFileType = (mimeType: string, format: string): string => {
      if (mimeType.includes('pdf')) return 'pdf';
      if (mimeType.includes('powerpoint') || format === 'pptx') return 'pptx';
      if (mimeType.includes('ms-powerpoint') || format === 'ppt') return 'ppt';
      if (mimeType.includes('wordprocessingml') || format === 'docx') return 'docx';
      if (mimeType.includes('msword') || format === 'doc') return 'doc';
      if (mimeType.includes('spreadsheetml') || format === 'xlsx') return 'xlsx';
      if (mimeType.includes('ms-excel') || format === 'xls') return 'xls';
      if (mimeType.includes('video')) return 'video';
      return 'other';
    };

    // Réponse avec les données du fichier uploadé
    return NextResponse.json({
      success: true,
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        size: uploadResult.bytes,
        type: getFileType(file.type, uploadResult.format),
        originalName: uploadResult.original_filename || file.name,
        format: uploadResult.format
      }
    });

  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload du fichier" },
      { status: 500 }
    );
  }
}

// API pour supprimer un fichier de Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json(
        { error: "Public ID manquant" },
        { status: 400 }
      );
    }

    // Suppression de Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({
      success: true,
      result: result
    });

  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du fichier" },
      { status: 500 }
    );
  }
}