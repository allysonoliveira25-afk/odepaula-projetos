import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import QRCode from "qrcode";
import { formatDate } from "@/lib/utils";

export interface CertificatePdfData {
  participantName: string;
  courseName: string;
  workload: string;
  instructor: string;
  eventDate: Date;
  location?: string | null;
  certificateNumber: string;
  validationKey: string;
  issuedAt: Date;
  projectName: string;
  siteUrl: string;
}

/**
 * Gera um PDF de certificado premium, na estética preto/prata/metálica
 * do O De Paula Program, com QR Code apontando para a página pública
 * de validação (/certificados/[chave]).
 */
export async function generateCertificatePdf(data: CertificatePdfData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`Certificado ${data.certificateNumber} — ${data.projectName}`);
  pdfDoc.setAuthor(data.projectName);
  pdfDoc.setSubject("Certificado de participação");

  const page = pdfDoc.addPage([842, 595]); // A4 paisagem
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // ---- Fundo preto profundo -------------------------------------------------
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.03, 0.035, 0.04) });

  // ---- Faixa metálica decorativa (simulando reflexo em aço escovado) --------
  const steps = 60;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const shade = 0.08 + Math.abs(Math.sin(t * Math.PI * 3)) * 0.06;
    page.drawRectangle({
      x: 0,
      y: height - 14 - i * 0.6,
      width,
      height: 0.6,
      color: rgb(shade, shade + 0.005, shade + 0.012),
    });
  }

  // ---- Moldura -----------------------------------------------------------
  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: rgb(0.62, 0.64, 0.68),
    borderWidth: 1.2,
  });
  page.drawRectangle({
    x: 32,
    y: 32,
    width: width - 64,
    height: height - 64,
    borderColor: rgb(0.35, 0.36, 0.4),
    borderWidth: 0.6,
  });

  const silver = rgb(0.78, 0.79, 0.83);
  const platinum = rgb(0.91, 0.92, 0.94);
  const graySoft = rgb(0.58, 0.6, 0.64);

  // ---- Cabeçalho: nome do projeto ----------------------------------------
  const projectName = data.projectName.toUpperCase();
  const titleSize = 20;
  const titleWidth = fontBold.widthOfTextAtSize(projectName, titleSize);
  page.drawText(projectName, {
    x: (width - titleWidth) / 2,
    y: height - 90,
    size: titleSize,
    font: fontBold,
    color: platinum,
    opacity: 0.95,
  });
  page.drawLine({
    start: { x: width / 2 - 90, y: height - 100 },
    end: { x: width / 2 + 90, y: height - 100 },
    thickness: 1,
    color: silver,
    opacity: 0.6,
  });

  // ---- "CERTIFICADO" ------------------------------------------------------
  const label = "CERTIFICADO DE PARTICIPAÇÃO";
  const labelSize = 13;
  const labelWidth = fontRegular.widthOfTextAtSize(label, labelSize);
  page.drawText(label, {
    x: (width - labelWidth) / 2,
    y: height - 130,
    size: labelSize,
    font: fontRegular,
    color: graySoft,
    opacity: 0.9,
  });

  // ---- Texto introdutório --------------------------------------------------
  const intro = "Certificamos que";
  const introSize = 13;
  const introWidth = fontItalic.widthOfTextAtSize(intro, introSize);
  page.drawText(intro, {
    x: (width - introWidth) / 2,
    y: height - 195,
    size: introSize,
    font: fontItalic,
    color: graySoft,
  });

  // ---- Nome do participante em destaque ------------------------------------
  const nameSize = 30;
  let name = data.participantName;
  let nameWidth = fontBold.widthOfTextAtSize(name, nameSize);
  let usedNameSize = nameSize;
  while (nameWidth > width - 160 && usedNameSize > 16) {
    usedNameSize -= 1;
    nameWidth = fontBold.widthOfTextAtSize(name, usedNameSize);
  }
  page.drawText(name, {
    x: (width - nameWidth) / 2,
    y: height - 235,
    size: usedNameSize,
    font: fontBold,
    color: platinum,
  });
  page.drawLine({
    start: { x: width / 2 - nameWidth / 2 - 20, y: height - 248 },
    end: { x: width / 2 + nameWidth / 2 + 20, y: height - 248 },
    thickness: 0.8,
    color: silver,
    opacity: 0.5,
  });

  // ---- Corpo do texto -------------------------------------------------------
  const bodyLines = [
    `participou do curso/workshop "${data.courseName}", com carga horária de ${data.workload},`,
    `ministrado por ${data.instructor}${data.location ? `, realizado em ${data.location}` : ""},`,
    `em ${formatDate(data.eventDate)}.`,
  ];
  const bodySize = 12.5;
  let bodyY = height - 285;
  for (const line of bodyLines) {
    const lw = fontRegular.widthOfTextAtSize(line, bodySize);
    page.drawText(line, {
      x: (width - lw) / 2,
      y: bodyY,
      size: bodySize,
      font: fontRegular,
      color: silver,
    });
    bodyY -= 22;
  }

  // ---- Rodapé: assinatura / dados -------------------------------------------
  const footerY = 110;
  page.drawLine({
    start: { x: 90, y: footerY + 34 },
    end: { x: 300, y: footerY + 34 },
    thickness: 0.8,
    color: graySoft,
  });
  page.drawText(data.instructor, {
    x: 90,
    y: footerY + 18,
    size: 11,
    font: fontBold,
    color: platinum,
  });
  page.drawText("Instrutor(a) responsável", {
    x: 90,
    y: footerY + 4,
    size: 9,
    font: fontRegular,
    color: graySoft,
  });

  page.drawLine({
    start: { x: width - 300, y: footerY + 34 },
    end: { x: width - 90, y: footerY + 34 },
    thickness: 0.8,
    color: graySoft,
  });
  page.drawText(data.projectName, {
    x: width - 300,
    y: footerY + 18,
    size: 11,
    font: fontBold,
    color: platinum,
  });
  page.drawText("Emitido em " + formatDate(data.issuedAt), {
    x: width - 300,
    y: footerY + 4,
    size: 9,
    font: fontRegular,
    color: graySoft,
  });

  // ---- QR Code + chave de validação -----------------------------------------
  const validationUrl = `${data.siteUrl.replace(/\/$/, "")}/certificados/${data.validationKey}`;
  const qrDataUrl = await QRCode.toDataURL(validationUrl, {
    margin: 0,
    color: { dark: "#0b0c0e", light: "#e8eaeeff" },
    width: 240,
  });
  const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  const qrSize = 76;
  const qrX = width / 2 - qrSize / 2;
  const qrY = 46;
  page.drawRectangle({
    x: qrX - 6,
    y: qrY - 6,
    width: qrSize + 12,
    height: qrSize + 12,
    color: rgb(0.94, 0.95, 0.96),
  });
  page.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize });

  const smallInfoSize = 8.5;
  const certLine = `Certificado nº ${data.certificateNumber}  •  Chave de validação: ${data.validationKey}`;
  const certLineWidth = fontRegular.widthOfTextAtSize(certLine, smallInfoSize);
  page.drawText(certLine, {
    x: (width - certLineWidth) / 2,
    y: qrY - 18,
    size: smallInfoSize,
    font: fontRegular,
    color: graySoft,
  });
  const verifyLine = "Valide a autenticidade em " + validationUrl.replace(/^https?:\/\//, "");
  const verifyLineWidth = fontRegular.widthOfTextAtSize(verifyLine, smallInfoSize);
  page.drawText(verifyLine, {
    x: (width - verifyLineWidth) / 2,
    y: qrY - 30,
    size: smallInfoSize,
    font: fontRegular,
    color: graySoft,
  });

  // ---- Marca d'água diagonal sutil -------------------------------------------
  page.drawText(data.projectName.toUpperCase(), {
    x: width / 2 - 260,
    y: height / 2 - 20,
    size: 60,
    font: fontBold,
    color: rgb(1, 1, 1),
    opacity: 0.02,
    rotate: degrees(18),
  });

  return pdfDoc.save();
}
