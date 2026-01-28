/**
 * Génération programmatique du template de Feuille d'Émargement (Présence)
 * Design moderne et stylé basé sur le modèle PIBO/FOSEC
 */
import { PDFDocument, PDFPage, rgb, RGB, StandardFonts } from "pdf-lib";

// Constantes de style
const COLORS = {
  black: rgb(0, 0, 0),
  darkGray: rgb(0.3, 0.3, 0.3),
  mediumGray: rgb(0.5, 0.5, 0.5),
  lightGray: rgb(0.9, 0.9, 0.9),
  veryLightGray: rgb(0.95, 0.95, 0.95),
  white: rgb(1, 1, 1),
  primary: rgb(0.26, 0.52, 0.96), // Bleu moderne élégant (#4285F4 style Google)
  accent: rgb(0.1, 0.6, 0.4), // Vert/Turquoise
  border: rgb(0.7, 0.7, 0.7),
} as const;

const PAGE = {
  width: 595, // A4
  height: 842, // A4
  margin: 40,
} as const;

const FONTS = {
  title: 16,
  subtitle: 13,
  sectionTitle: 12,
  normal: 10,
  small: 9,
  tiny: 8,
} as const;

/**
 * Dessine un rectangle (bordure)
 */
function drawBox(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  options: {
    borderColor?: RGB;
    backgroundColor?: RGB;
    borderWidth?: number;
  } = {}
) {
  const {
    borderColor = COLORS.border,
    backgroundColor,
    borderWidth = 1,
  } = options;

  page.drawRectangle({
    x,
    y,
    width,
    height,
    borderColor,
    borderWidth,
    color: backgroundColor,
  });
}

/**
 * Génère la feuille d'émargement (1 page avec tableau dynamique)
 * @param doc Document PDF
 * @param nombreStagiaires Nombre de stagiaires pour générer les lignes du tableau
 */
export async function generateEmargementPage(
  doc: PDFDocument,
  nombreStagiaires = 1
): Promise<PDFPage> {
  const page = doc.addPage([PAGE.width, PAGE.height]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let yPos = PAGE.height - PAGE.margin;

  // === EN-TÊTE MODERNE ===
  // Bande colorée en haut élégante
  page.drawRectangle({
    x: 0,
    y: PAGE.height - 70,
    width: PAGE.width,
    height: 70,
    color: COLORS.primary,
  });

  // "FORM ME" en texte simple et élégant en haut à gauche
  page.drawText("FORM ME", {
    x: PAGE.margin,
    y: PAGE.height - 35,
    size: FONTS.subtitle,
    font: fontBold,
    color: COLORS.white,
  });

  // Titre principal centré
  page.drawText("FEUILLE DE PRÉSENCE", {
    x: PAGE.width / 2 - 105,
    y: PAGE.height - 35,
    size: 18,
    font: fontBold,
    color: COLORS.white,
  });

  // Sous-titre (durée) centré
  page.drawText("Demi-journée", {
    x: PAGE.width / 2 - 35,
    y: PAGE.height - 52,
    size: FONTS.normal,
    font,
    color: rgb(0.9, 0.9, 0.9),
  });

  // Nom de l'organisme/entreprise en haut à droite (sera rempli dynamiquement)
  // Le texte sera ajouté par generateEmargement.ts

  yPos = PAGE.height - 85;

  // Note de conformité
  page.drawText(
    "L'organisme FORM ME atteste par la présente de la réalité des informations portées ci-dessous",
    {
      x: PAGE.margin,
      y: yPos,
      size: FONTS.small,
      font,
      color: COLORS.mediumGray,
    }
  );

  yPos -= 30;

  // === SECTION 1: FORMATION ===
  // Titre de section avec fond bleu
  const section1HeaderHeight = 25;
  page.drawRectangle({
    x: PAGE.margin,
    y: yPos - section1HeaderHeight,
    width: PAGE.width - 2 * PAGE.margin,
    height: section1HeaderHeight,
    color: COLORS.primary,
    borderColor: COLORS.primary,
    borderWidth: 2,
  });

  page.drawText("1.   FORMATION", {
    x: PAGE.margin + 15,
    y: yPos - 18,
    size: FONTS.sectionTitle,
    font: fontBold,
    color: COLORS.white,
  });

  yPos -= section1HeaderHeight + 10;

  // Grand encadré pour toutes les infos de formation avec ombre subtile
  const formationBoxHeight = 120;
  const formationBoxY = yPos - formationBoxHeight;

  // Ombre légère (rectangle décalé gris)
  page.drawRectangle({
    x: PAGE.margin + 2,
    y: formationBoxY - 2,
    width: PAGE.width - 2 * PAGE.margin,
    height: formationBoxHeight,
    color: rgb(1, 1, 1),
    borderWidth: 0,
  });

  // Encadré principal
  drawBox(
    page,
    PAGE.margin,
    formationBoxY,
    PAGE.width - 2 * PAGE.margin,
    formationBoxHeight,
    {
      borderColor: COLORS.primary,
      borderWidth: 1.5,
    }
  );

  // Contenu de l'encadré formation
  let formYPos = yPos - 18;

  // Intitulé de l'action
  page.drawText("Intitulé de l'action :", {
    x: PAGE.margin + 15,
    y: formYPos,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });
  // Valeur dynamique sera ajoutée à droite

  formYPos -= 25;

  // Date(s) de la formation
  page.drawText("Date(s) de la formation :", {
    x: PAGE.margin + 15,
    y: formYPos,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });
  // Valeur dynamique sera ajoutée à droite

  formYPos -= 25;

  // Organisme de Formation
  page.drawText("Organisme de Formation :", {
    x: PAGE.margin + 15,
    y: formYPos,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });
  page.drawText("FORM ME", {
    x: PAGE.margin + 200,
    y: formYPos,
    size: FONTS.normal,
    font,
    color: COLORS.black,
  });

  formYPos -= 25;

  // Lieu de Formation
  page.drawText("Lieu de Formation :", {
    x: PAGE.margin + 15,
    y: formYPos,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });
  // Valeur dynamique sera ajoutée à droite

  yPos = formationBoxY - 15;

  // === SECTION 2: FORMATEUR et PRÉSENCE ===
  const section2HeaderHeight = 25;
  page.drawRectangle({
    x: PAGE.margin,
    y: yPos - section2HeaderHeight,
    width: PAGE.width - 2 * PAGE.margin,
    height: section2HeaderHeight,
    color: COLORS.primary,
    borderColor: COLORS.primary,
    borderWidth: 2,
  });

  page.drawText("2.   FORMATEUR et PRÉSENCE", {
    x: PAGE.margin + 15,
    y: yPos - 18,
    size: FONTS.sectionTitle,
    font: fontBold,
    color: COLORS.white,
  });

  yPos -= section2HeaderHeight + 15;

  // Nom et Prénom du formateur (hors encadré)
  page.drawText("Nom et Prénom du formateur :", {
    x: PAGE.margin + 15,
    y: yPos,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });
  // Valeur dynamique sera ajoutée à droite

  yPos -= 30;

  // Encadré signature formateur avec style amélioré
  const signatureFormateurHeight = 95;
  const signatureFormateurWidth = 380;
  const signatureFormateurY = yPos - signatureFormateurHeight;

  // Ombre
  page.drawRectangle({
    x: PAGE.margin + 17,
    y: signatureFormateurY - 2,
    width: signatureFormateurWidth,
    height: signatureFormateurHeight,
    color: rgb(0.85, 0.85, 0.85),
    borderWidth: 0,
  });

  // Encadré principal avec fond gris très clair
  page.drawRectangle({
    x: PAGE.margin + 15,
    y: signatureFormateurY,
    width: signatureFormateurWidth,
    height: signatureFormateurHeight,
    color: rgb(0.98, 0.98, 0.98),
    borderColor: COLORS.border,
    borderWidth: 1.5,
  });

  // Titre de l'encadré
  page.drawText("SIGNATURE* DU FORMATEUR à la ½ journée", {
    x: PAGE.margin + 25,
    y: yPos - 15,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });

  // Sous-titre
  page.drawText("Matin ou Après-midi", {
    x: PAGE.margin + 25,
    y: yPos - 30,
    size: FONTS.small,
    font,
    color: COLORS.darkGray,
  });

  // Heure début
  page.drawText("Heure début :", {
    x: PAGE.margin + 25,
    y: yPos - 48,
    size: FONTS.small,
    font,
    color: COLORS.darkGray,
  });
  // Valeur dynamique pour l'heure

  // Note de bas d'encadré
  page.drawText(
    "*Par ma signature, j'atteste par la présente avoir dispensé la formation",
    {
      x: PAGE.margin + 15,
      y: signatureFormateurY - 15,
      size: FONTS.tiny,
      font,
      color: COLORS.mediumGray,
    }
  );

  // Affichage de l'horaire sous la note (sera rempli dynamiquement)
  // Ex: "09:00 - 12:30"

  yPos = signatureFormateurY - 25;

  // === SECTION 3: STAGIAIRES - TABLEAU ===
  const section3HeaderHeight = 25;
  page.drawRectangle({
    x: PAGE.margin,
    y: yPos - section3HeaderHeight,
    width: PAGE.width - 2 * PAGE.margin,
    height: section3HeaderHeight,
    color: COLORS.primary,
    borderColor: COLORS.primary,
    borderWidth: 2,
  });

  page.drawText("3.   STAGIAIRES", {
    x: PAGE.margin + 15,
    y: yPos - 18,
    size: FONTS.sectionTitle,
    font: fontBold,
    color: COLORS.white,
  });

  yPos -= section3HeaderHeight + 10;

  // Tableau des stagiaires
  const tableHeaderHeight = 25;
  const tableRowHeight = 50;

  // Colonnes du tableau
  const col1Width = 120; // Nom
  const col2Width = 120; // Prénom
  const col3Width = 90; // Date de naissance
  const col4Width = 150; // Signature
  const tableWidth = col1Width + col2Width + col3Width + col4Width;

  const tableX = PAGE.margin;

  // Ombre du tableau
  page.drawRectangle({
    x: tableX + 2,
    y: yPos - tableHeaderHeight - 2,
    width: tableWidth,
    height: tableHeaderHeight,
    color: rgb(0.85, 0.85, 0.85),
    borderWidth: 0,
  });

  // En-tête du tableau avec couleur primaire
  page.drawRectangle({
    x: tableX,
    y: yPos - tableHeaderHeight,
    width: tableWidth,
    height: tableHeaderHeight,
    color: rgb(0.9, 0.93, 0.98),
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  });

  // Titres des colonnes
  page.drawText("Nom", {
    x: tableX + 10,
    y: yPos - 17,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });

  page.drawText("Prénom", {
    x: tableX + col1Width + 10,
    y: yPos - 17,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });

  page.drawText("Date de naissance", {
    x: tableX + col1Width + col2Width + 5,
    y: yPos - 17,
    size: FONTS.small,
    font: fontBold,
    color: COLORS.black,
  });

  page.drawText("Signature", {
    x: tableX + col1Width + col2Width + col3Width + 10,
    y: yPos - 17,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });

  // Lignes verticales de l'en-tête
  page.drawLine({
    start: { x: tableX + col1Width, y: yPos },
    end: { x: tableX + col1Width, y: yPos - tableHeaderHeight },
    color: COLORS.border,
    thickness: 1,
  });

  page.drawLine({
    start: { x: tableX + col1Width + col2Width, y: yPos },
    end: { x: tableX + col1Width + col2Width, y: yPos - tableHeaderHeight },
    color: COLORS.border,
    thickness: 1,
  });

  page.drawLine({
    start: { x: tableX + col1Width + col2Width + col3Width, y: yPos },
    end: {
      x: tableX + col1Width + col2Width + col3Width,
      y: yPos - tableHeaderHeight,
    },
    color: COLORS.border,
    thickness: 1,
  });

  yPos -= tableHeaderHeight;

  // Génération dynamique des lignes pour chaque stagiaire
  let currentYPos = yPos;

  for (let i = 0; i < nombreStagiaires; i++) {
    const rowY = currentYPos - tableRowHeight;

    // Ombre de la ligne
    page.drawRectangle({
      x: tableX + 2,
      y: rowY - 2,
      width: tableWidth,
      height: tableRowHeight,
      color: rgb(0.85, 0.85, 0.85),
      borderWidth: 0,
    });

    // Ligne principale
    drawBox(page, tableX, rowY, tableWidth, tableRowHeight, {
      borderColor: COLORS.primary,
      borderWidth: 1.5,
    });

    // Lignes verticales de la ligne de données
    page.drawLine({
      start: { x: tableX + col1Width, y: currentYPos },
      end: { x: tableX + col1Width, y: rowY },
      color: COLORS.border,
      thickness: 1,
    });

    page.drawLine({
      start: { x: tableX + col1Width + col2Width, y: currentYPos },
      end: { x: tableX + col1Width + col2Width, y: rowY },
      color: COLORS.border,
      thickness: 1,
    });

    page.drawLine({
      start: { x: tableX + col1Width + col2Width + col3Width, y: currentYPos },
      end: { x: tableX + col1Width + col2Width + col3Width, y: rowY },
      color: COLORS.border,
      thickness: 1,
    });

    currentYPos = rowY;
  }

  // Les valeurs dynamiques seront ajoutées ici par generateEmargement.ts
  // Coordonnées pour le remplissage (première ligne):
  // - Nom: tableX + 10, yPos - 25
  // - Prénom: tableX + col1Width + 10, yPos - 25
  // - Date naissance: tableX + col1Width + col2Width + 10, yPos - 25
  // - Signature: zone vide tableX + col1Width + col2Width + col3Width à tableWidth

  yPos = currentYPos - 10;

  // Note RGPD sous le tableau
  page.drawText(
    "Par la signature de cette fiche de présence, vous donnez votre accord pour l'utilisation de vos données personnelles transmises dans le cadre de cette formation",
    {
      x: PAGE.margin,
      y: yPos,
      size: FONTS.tiny,
      font,
      color: COLORS.mediumGray,
      maxWidth: PAGE.width - 2 * PAGE.margin,
      lineHeight: 10,
    }
  );

  // === PIED DE PAGE ===
  yPos = PAGE.margin + 25;

  // Ligne de séparation élégante
  page.drawLine({
    start: { x: PAGE.margin + 150, y: yPos + 15 },
    end: { x: PAGE.width - PAGE.margin - 150, y: yPos + 15 },
    color: COLORS.primary,
    thickness: 1,
  });

  return page;
}

/**
 * Génère une page de continuation (uniquement le tableau des stagiaires)
 * Pour les pages 2, 3, 4... quand il y a plus de 4 stagiaires
 */
export async function generateEmargementContinuationPage(
  doc: PDFDocument,
  nombreStagiaires = 4
): Promise<PDFPage> {
  const page = doc.addPage([PAGE.width, PAGE.height]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let yPos = PAGE.height - PAGE.margin - 40;

  // Titre simple en haut
  page.drawText("FEUILLE DE PRÉSENCE (suite)", {
    x: PAGE.margin,
    y: yPos,
    size: FONTS.title,
    font: fontBold,
    color: COLORS.darkGray,
  });

  yPos -= 50;

  // === SECTION: STAGIAIRES - TABLEAU ===
  const section3HeaderHeight = 25;
  page.drawRectangle({
    x: PAGE.margin,
    y: yPos - section3HeaderHeight,
    width: PAGE.width - 2 * PAGE.margin,
    height: section3HeaderHeight,
    color: COLORS.primary,
    borderColor: COLORS.primary,
    borderWidth: 2,
  });

  page.drawText("STAGIAIRES (suite)", {
    x: PAGE.margin + 15,
    y: yPos - 18,
    size: FONTS.sectionTitle,
    font: fontBold,
    color: COLORS.white,
  });

  yPos -= section3HeaderHeight + 10;

  // Tableau des stagiaires
  const tableHeaderHeight = 25;
  const tableRowHeight = 50;

  // Colonnes du tableau
  const col1Width = 120; // Nom
  const col2Width = 120; // Prénom
  const col3Width = 90; // Date de naissance
  const col4Width = 150; // Signature
  const tableWidth = col1Width + col2Width + col3Width + col4Width;

  const tableX = PAGE.margin;

  // Ombre du tableau
  page.drawRectangle({
    x: tableX + 2,
    y: yPos - tableHeaderHeight - 2,
    width: tableWidth,
    height: tableHeaderHeight,
    color: rgb(0.85, 0.85, 0.85),
    borderWidth: 0,
  });

  // En-tête du tableau avec couleur primaire
  page.drawRectangle({
    x: tableX,
    y: yPos - tableHeaderHeight,
    width: tableWidth,
    height: tableHeaderHeight,
    color: rgb(0.9, 0.93, 0.98),
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  });

  // Titres des colonnes
  page.drawText("Nom", {
    x: tableX + 10,
    y: yPos - 17,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });

  page.drawText("Prénom", {
    x: tableX + col1Width + 10,
    y: yPos - 17,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });

  page.drawText("Date de naissance", {
    x: tableX + col1Width + col2Width + 5,
    y: yPos - 17,
    size: FONTS.small,
    font: fontBold,
    color: COLORS.black,
  });

  page.drawText("Signature", {
    x: tableX + col1Width + col2Width + col3Width + 10,
    y: yPos - 17,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });

  // Lignes verticales de l'en-tête
  page.drawLine({
    start: { x: tableX + col1Width, y: yPos },
    end: { x: tableX + col1Width, y: yPos - tableHeaderHeight },
    color: COLORS.border,
    thickness: 1,
  });

  page.drawLine({
    start: { x: tableX + col1Width + col2Width, y: yPos },
    end: { x: tableX + col1Width + col2Width, y: yPos - tableHeaderHeight },
    color: COLORS.border,
    thickness: 1,
  });

  page.drawLine({
    start: { x: tableX + col1Width + col2Width + col3Width, y: yPos },
    end: {
      x: tableX + col1Width + col2Width + col3Width,
      y: yPos - tableHeaderHeight,
    },
    color: COLORS.border,
    thickness: 1,
  });

  yPos -= tableHeaderHeight;

  // Génération dynamique des lignes pour chaque stagiaire
  let currentYPos = yPos;

  for (let i = 0; i < nombreStagiaires; i++) {
    const rowY = currentYPos - tableRowHeight;

    // Ombre de la ligne
    page.drawRectangle({
      x: tableX + 2,
      y: rowY - 2,
      width: tableWidth,
      height: tableRowHeight,
      color: rgb(0.85, 0.85, 0.85),
      borderWidth: 0,
    });

    // Ligne principale
    drawBox(page, tableX, rowY, tableWidth, tableRowHeight, {
      borderColor: COLORS.primary,
      borderWidth: 1.5,
    });

    // Lignes verticales de la ligne de données
    page.drawLine({
      start: { x: tableX + col1Width, y: currentYPos },
      end: { x: tableX + col1Width, y: rowY },
      color: COLORS.border,
      thickness: 1,
    });

    page.drawLine({
      start: { x: tableX + col1Width + col2Width, y: currentYPos },
      end: { x: tableX + col1Width + col2Width, y: rowY },
      color: COLORS.border,
      thickness: 1,
    });

    page.drawLine({
      start: { x: tableX + col1Width + col2Width + col3Width, y: currentYPos },
      end: { x: tableX + col1Width + col2Width + col3Width, y: rowY },
      color: COLORS.border,
      thickness: 1,
    });

    currentYPos = rowY;
  }

  yPos = currentYPos - 10;

  // Note RGPD sous le tableau
  page.drawText(
    "Par la signature de cette fiche de présence, vous donnez votre accord pour l'utilisation de vos données personnelles transmises dans le cadre de cette formation",
    {
      x: PAGE.margin,
      y: yPos,
      size: FONTS.tiny,
      font,
      color: COLORS.mediumGray,
      maxWidth: PAGE.width - 2 * PAGE.margin,
      lineHeight: 10,
    }
  );

  return page;
}

/**
 * Génère le document complet d'émargement
 * @param nombrePages Nombre de pages à générer (1 par session)
 * @param nombreStagiairesContinuation Nombre de stagiaires pour les pages de continuation (10 max)
 */
export async function generateEmargementTemplate(
  nombrePages = 1,
  nombreStagiairesContinuation = 10
): Promise<PDFDocument> {
  const doc = await PDFDocument.create();

  // Première page : page complète avec toutes les infos - MAX 4 LIGNES
  await generateEmargementPage(doc, 4);

  // Pages suivantes : uniquement le tableau (pages de continuation) - MAX 10 LIGNES
  for (let i = 1; i < nombrePages; i++) {
    await generateEmargementContinuationPage(doc, nombreStagiairesContinuation);
  }

  return doc;
}

/**
 * Génère et sauvegarde le template en tant que Buffer
 */
export async function getEmargementTemplateBuffer(
  nombrePages = 1,
  nombreStagiaires = 1
): Promise<Buffer> {
  const doc = await generateEmargementTemplate(nombrePages, nombreStagiaires);
  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}
