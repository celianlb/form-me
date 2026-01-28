/**
 * Génération programmatique du template de Convention
 * Ce fichier crée un template PDF à partir de zéro avec pdf-lib
 * Avantages: plus de contrôle, pas de masquage de placeholders, facilité de maintenance
 */
import { PDFDocument, PDFPage, rgb, RGB, StandardFonts } from "pdf-lib";

// Constantes de style
const COLORS = {
  black: rgb(0, 0, 0),
  darkGray: rgb(0.3, 0.3, 0.3),
  mediumGray: rgb(0.5, 0.5, 0.5),
  lightGray: rgb(0.9, 0.9, 0.9),
  white: rgb(1, 1, 1),
  primary: rgb(0.2, 0.4, 0.8), // Bleu
  border: rgb(0.7, 0.7, 0.7),
} as const;

const PAGE = {
  width: 595, // A4
  height: 842, // A4
  margin: 50,
} as const;

const FONTS = {
  title: 14,
  subtitle: 12,
  normal: 10,
  small: 9,
} as const;

/**
 * Dessine une ligne (horizontale ou verticale)
 */
function drawLine(
  page: PDFPage,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: RGB = COLORS.border,
  thickness = 1
) {
  page.drawLine({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    color,
    thickness,
  });
}

/**
 * Dessine un rectangle (bordure)
 */
function drawBox(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  borderColor: RGB = COLORS.border
) {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    borderColor,
    borderWidth: 1,
    color: COLORS.white,
  });
}

/**
 * Génère la PAGE 1 du template Convention
 */
async function generatePage1(doc: PDFDocument): Promise<PDFPage> {
  const page = doc.addPage([PAGE.width, PAGE.height]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let yPos = PAGE.height - PAGE.margin;

  // === EN-TÊTE ===
  page.drawText("CONVENTION DE FORMATION", {
    x: PAGE.margin,
    y: yPos,
    size: FONTS.title,
    font: fontBold,
    color: COLORS.primary,
  });

  yPos -= 30;

  // Ligne de séparation
  drawLine(
    page,
    PAGE.margin,
    yPos,
    PAGE.width - PAGE.margin,
    yPos,
    COLORS.primary,
    2
  );
  yPos -= 20;

  // === PRÉAMBULE ===
  page.drawText("Entre les soussignés:", {
    x: PAGE.margin,
    y: yPos,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });

  yPos -= 20;

  // Organisme de formation
  page.drawText(
    "1 - Form Me, organisme de formation déclaré sous le numéro 11756406775 auprès du",
    {
      x: PAGE.margin,
      y: yPos,
      size: FONTS.normal,
      font,
      color: COLORS.black,
    }
  );
  yPos -= 12;
  page.drawText(
    "préfet de la région Île-de-France, ayant son siège social au 7 Rue de Belfort, 75011 Paris,",
    {
      x: PAGE.margin,
      y: yPos,
      size: FONTS.normal,
      font,
      color: COLORS.black,
    }
  );
  yPos -= 12;
  page.drawText("représenté par M. Fabien GARNIER, en qualité de Gérant.", {
    x: PAGE.margin,
    y: yPos,
    size: FONTS.normal,
    font,
    color: COLORS.black,
  });

  yPos -= 12;

  // Entreprise cliente (ligne dynamique)
  page.drawText("2 - ", {
    x: PAGE.margin,
    y: yPos,
    size: FONTS.normal,
    font,
    color: COLORS.black,
  });
  // Le reste sera rempli dynamiquement

  yPos -= 20;
  drawLine(
    page,
    PAGE.margin,
    yPos,
    PAGE.width - PAGE.margin,
    yPos,
    COLORS.lightGray
  );
  yPos -= 20;

  // === ARTICLE 1: OBJET DE LA CONVENTION ===
  page.drawText("ARTICLE 1 : OBJET DE LA CONVENTION", {
    x: PAGE.margin,
    y: yPos,
    size: FONTS.subtitle,
    font: fontBold,
    color: COLORS.black,
  });

  yPos -= 20;

  page.drawText(
    "La présente convention a pour objet la réalisation de la formation suivante:",
    {
      x: PAGE.margin,
      y: yPos,
      size: FONTS.normal,
      font,
      color: COLORS.black,
    }
  );

  yPos -= 20;

  // Encadré pour les informations de formation
  const infoBoxHeight = 110;
  const infoBoxY = yPos - infoBoxHeight;
  drawBox(
    page,
    PAGE.margin,
    infoBoxY,
    PAGE.width - 2 * PAGE.margin,
    infoBoxHeight,
    COLORS.primary
  );

  // Coordonnées pour les labels dans l'encadré
  let infoYPos = yPos - 15;
  const labelX = PAGE.margin + 10;

  // Intitulé du stage
  page.drawText("Intitulé du stage:", {
    x: labelX,
    y: infoYPos,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });
  // Valeur dynamique sera ajoutée à droite du label

  infoYPos -= 28;

  // Durée
  page.drawText("Durée:", {
    x: labelX,
    y: infoYPos,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });
  // Valeur dynamique sera ajoutée à droite du label

  infoYPos -= 20;

  // Lieu
  page.drawText("Lieu (adresse exacte):", {
    x: labelX,
    y: infoYPos,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });
  // Valeur dynamique sera ajoutée à droite du label

  infoYPos -= 15;

  // Dates et horaires
  page.drawText("Dates et horaires:", {
    x: labelX,
    y: infoYPos,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });
  // Valeur dynamique sera ajoutée à droite du label

  yPos = infoBoxY - 20;

  // === ARTICLE 2: EFFECTIF FORMÉ ===
  page.drawText("ARTICLE 2 : EFFECTIF FORMÉ", {
    x: PAGE.margin,
    y: yPos,
    size: FONTS.subtitle,
    font: fontBold,
    color: COLORS.black,
  });

  yPos -= 20;

  page.drawText("L'organisme Form Me accueillera les personnes suivantes:", {
    x: PAGE.margin,
    y: yPos,
    size: FONTS.normal,
    font,
    color: COLORS.black,
  });

  yPos -= 20;

  // Tableau des stagiaires - En-têtes
  const tableStartY = yPos;
  const tableX = PAGE.margin + 40;
  const colWidth = 140;
  const headerHeight = 20;

  // Rectangle pour l'en-tête du tableau
  page.drawRectangle({
    x: tableX,
    y: tableStartY - headerHeight,
    width: colWidth * 3,
    height: headerHeight,
    color: COLORS.lightGray,
    borderColor: COLORS.border,
    borderWidth: 1,
  });

  // En-têtes de colonnes
  page.drawText("Nom", {
    x: tableX + 10,
    y: tableStartY - 14,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });

  page.drawText("Prénom", {
    x: tableX + colWidth + 10,
    y: tableStartY - 14,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });

  page.drawText("Date de naissance", {
    x: tableX + colWidth * 2 + 10,
    y: tableStartY - 14,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });

  // Bordures verticales
  drawLine(
    page,
    tableX + colWidth,
    tableStartY,
    tableX + colWidth,
    tableStartY - headerHeight,
    COLORS.border
  );
  drawLine(
    page,
    tableX + colWidth * 2,
    tableStartY,
    tableX + colWidth * 2,
    tableStartY - headerHeight,
    COLORS.border
  );

  // Zone pour les données (sera remplie dynamiquement)
  // On dessine juste les bordures du tableau
  const tableBodyHeight = 120; // Espace pour ~8 stagiaires
  drawBox(
    page,
    tableX,
    tableStartY - headerHeight - tableBodyHeight,
    colWidth * 3,
    tableBodyHeight,
    COLORS.border
  );

  // Lignes verticales du corps du tableau
  drawLine(
    page,
    tableX + colWidth,
    tableStartY - headerHeight,
    tableX + colWidth,
    tableStartY - headerHeight - tableBodyHeight,
    COLORS.border
  );
  drawLine(
    page,
    tableX + colWidth * 2,
    tableStartY - headerHeight,
    tableX + colWidth * 2,
    tableStartY - headerHeight - tableBodyHeight,
    COLORS.border
  );

  yPos = tableStartY - headerHeight - tableBodyHeight - 20;

  // === ARTICLE 3: DISPOSITIONS FINANCIÈRES ===
  page.drawText("ARTICLE 3 : DISPOSITIONS FINANCIÈRES", {
    x: PAGE.margin,
    y: yPos,
    size: FONTS.subtitle,
    font: fontBold,
    color: COLORS.black,
  });

  yPos -= 20;

  // Paragraphe d'introduction
  page.drawText(
    "En contrepartie de cette action de formation, l'employeur s'acquittera des coûts suivants:",
    {
      x: PAGE.margin,
      y: yPos,
      size: FONTS.normal,
      font,
      color: COLORS.black,
      maxWidth: PAGE.width - 2 * PAGE.margin,
      lineHeight: 12,
    }
  );

  yPos -= 18;

  // Ligne "Frais de formation : coût unitaire/stagiaire Net de TVA: [valeur]"
  const tarifLabelY = yPos;
  page.drawText("Frais de formation : coût unitaire/stagiaire Net de TVA:", {
    x: PAGE.margin,
    y: tarifLabelY,
    size: FONTS.normal,
    font,
    color: COLORS.black,
  });
  // Valeur dynamique sera ajoutée après ce texte

  yPos -= 18;

  // Ligne "TOTAL GENERAL : [valeur]"
  const totalLabelY = yPos;
  page.drawText("TOTAL GENERAL :", {
    x: PAGE.margin,
    y: totalLabelY,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });
  // Valeur dynamique sera ajoutée après ce texte

  // Retourner les coordonnées pour le remplissage dynamique
  // Ces valeurs seront utilisées dans generateConvention.ts
  // tarifLabelY et totalLabelY sont les positions Y exactes

  return page;
}

/**
 * Génère la PAGE 2 du template Convention
 */
async function generatePage2(doc: PDFDocument): Promise<PDFPage> {
  const page = doc.addPage([PAGE.width, PAGE.height]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let yPos = PAGE.height - PAGE.margin;

  // === ARTICLE 4: MODALITÉS DE DÉROULEMENT ===
  page.drawText("ARTICLE 4 : MODALITÉS DE DÉROULEMENT", {
    x: PAGE.margin,
    y: yPos,
    size: FONTS.subtitle,
    font: fontBold,
    color: COLORS.black,
  });

  yPos -= 20;

  const modalites = [
    "La formation se déroulera conformément au programme et aux modalités définies dans l'offre de formation.",
    "Les horaires et dates indiqués à l'article 1 pourront faire l'objet de modifications en cas de force majeure.",
    "L'organisme de formation s'engage à fournir tous les moyens pédagogiques nécessaires au bon déroulement de la formation.",
  ];

  modalites.forEach((text, index) => {
    page.drawText(`${index + 1}. ${text}`, {
      x: PAGE.margin,
      y: yPos,
      size: FONTS.normal,
      font,
      color: COLORS.black,
      maxWidth: PAGE.width - 2 * PAGE.margin,
      lineHeight: 12,
    });
    yPos -= 25;
  });

  yPos -= 10;

  // === ARTICLE 5: DOCUMENTS REMIS ===
  page.drawText("ARTICLE 5 : DOCUMENTS REMIS", {
    x: PAGE.margin,
    y: yPos,
    size: FONTS.subtitle,
    font: fontBold,
    color: COLORS.black,
  });

  yPos -= 20;

  page.drawText(
    "À l'issue de la formation, il sera remis à chaque stagiaire:",
    {
      x: PAGE.margin,
      y: yPos,
      size: FONTS.normal,
      font,
      color: COLORS.black,
    }
  );

  yPos -= 20;

  const documents = [
    "Une attestation de formation",
    "Un certificat de réalisation",
    "Les supports pédagogiques utilisés",
  ];

  documents.forEach((doc) => {
    page.drawText(`• ${doc}`, {
      x: PAGE.margin + 20,
      y: yPos,
      size: FONTS.normal,
      font,
      color: COLORS.black,
    });
    yPos -= 15;
  });

  yPos -= 20;

  // === ARTICLE 6: RÉSILIATION ===
  page.drawText("ARTICLE 6 : RÉSILIATION", {
    x: PAGE.margin,
    y: yPos,
    size: FONTS.subtitle,
    font: fontBold,
    color: COLORS.black,
  });

  yPos -= 20;

  page.drawText(
    "En cas d'annulation de la formation par l'une ou l'autre des parties, celle-ci devra en informer l'autre partie par lettre recommandée avec accusé de réception au moins 15 jours avant le début de la formation.",
    {
      x: PAGE.margin,
      y: yPos,
      size: FONTS.normal,
      font,
      color: COLORS.black,
      maxWidth: PAGE.width - 2 * PAGE.margin,
      lineHeight: 12,
    }
  );

  yPos -= 50;

  // === SIGNATURES ===
  yPos -= 50;
  drawLine(
    page,
    PAGE.margin,
    yPos,
    PAGE.width - PAGE.margin,
    yPos,
    COLORS.border
  );
  yPos -= 20;

  page.drawText("SIGNATURES", {
    x: PAGE.width / 2 - 40,
    y: yPos,
    size: FONTS.subtitle,
    font: fontBold,
    color: COLORS.black,
  });

  yPos -= 30;

  // Deux colonnes pour les signatures
  const col1X = PAGE.margin;
  const col2X = PAGE.width / 2 + 20;

  // Colonne 1: Pour l'organisme de formation
  page.drawText("Pour Form Me", {
    x: col1X,
    y: yPos,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });

  page.drawText("Date:", {
    x: col1X,
    y: yPos - 60,
    size: FONTS.small,
    font,
    color: COLORS.darkGray,
  });

  page.drawText("Signature et cachet:", {
    x: col1X,
    y: yPos - 75,
    size: FONTS.small,
    font,
    color: COLORS.darkGray,
  });

  // Cadre pour la signature
  drawBox(page, col1X, yPos - 150, 200, 60);

  // Colonne 2: Pour l'entreprise cliente
  page.drawText("Pour l'entreprise", {
    x: col2X,
    y: yPos,
    size: FONTS.normal,
    font: fontBold,
    color: COLORS.black,
  });

  page.drawText("Date:", {
    x: col2X,
    y: yPos - 60,
    size: FONTS.small,
    font,
    color: COLORS.darkGray,
  });

  page.drawText("Signature et cachet:", {
    x: col2X,
    y: yPos - 75,
    size: FONTS.small,
    font,
    color: COLORS.darkGray,
  });

  // Cadre pour la signature
  drawBox(page, col2X, yPos - 150, 200, 60);

  // Pied de page
  yPos = PAGE.margin;
  page.drawText(
    "Form Me - 7 Rue de Belfort, 75011 Paris - SIRET: 123 456 789 00012",
    {
      x: PAGE.width / 2 - 160,
      y: yPos,
      size: FONTS.small,
      font,
      color: COLORS.mediumGray,
    }
  );

  page.drawText("Numéro de déclaration d'activité: 11756406775", {
    x: PAGE.width / 2 - 100,
    y: yPos - 12,
    size: FONTS.small,
    font,
    color: COLORS.mediumGray,
  });

  return page;
}

/**
 * Génère le template complet (2 pages)
 */
export async function generateConventionTemplate(): Promise<PDFDocument> {
  const doc = await PDFDocument.create();

  await generatePage1(doc);
  await generatePage2(doc);

  return doc;
}

/**
 * Génère et sauvegarde le template en tant que Buffer
 */
export async function getConventionTemplateBuffer(): Promise<Buffer> {
  const doc = await generateConventionTemplate();
  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}
