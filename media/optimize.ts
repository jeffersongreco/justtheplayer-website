import sharp from "sharp";
import { glob } from "glob";
import * as fs from "node:fs/promises";
import * as path from "node:path";

// --- CONFIGURAÇÃO ---

const INPUT_DIR = "./media/src";
const OUTPUT_DIR = "./media/dist";

// Estratégia de Tamanhos (Otimizada para Retina e Telas Modernas)
// 640w:  Mobile @1x / Small Mobile @2x
// 1280w: Mobile @2x / Tablet / Laptop @1x
// 2560w: Desktop 4K / MacBook Retina @2x
const WIDTHS = [640, 1280, 2560];

// Configuração AVIF (Texto Nítido e Texturas)
// Doc: https://sharp.pixelplumbing.com/api-output#avif
const AVIF_CONFIG: sharp.AvifOptions = {
  quality: 80, // 80 é ideal para manter textura sem artefatos de "banding"
  effort: 9, // 0-9. 9 = Mais lento, melhor compressão.
  chromaSubsampling: "4:4:4", // Crucial para texto colorido. Impede o "borrão" nas bordas de cores.
};

// Configuração WebP (Fallback)
// Doc: https://sharp.pixelplumbing.com/api-output#webp
const WEBP_CONFIG: sharp.WebpOptions = {
  quality: 85, // WebP requer qualidade um pouco maior que AVIF para mesma fidelidade visual
  effort: 6, // 0-6 (Diferente do AVIF). 6 = Máxima compressão.
  smartSubsample: true, // Reduz ruído em áreas de alto contraste
  lossless: false, // Garante modo lossy (fotos), mude para true se forem ícones/vetores convertidos
};

// --- PIPELINE ---

async function optimizeImages() {
  console.log("🚀 Iniciando otimização (Sharp API Corrected)...");
  const startTime = performance.now();

  // Busca imagens recursivamente
  const files = await glob(`${INPUT_DIR}/**/*.{jpg,jpeg,png,tiff,webp}`);

  if (files.length === 0) {
    console.warn(`⚠️  Nenhuma imagem encontrada em ${INPUT_DIR}`);
    return;
  }

  // Cria diretório raiz se não existir
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  let processedCount = 0;

  for (const file of files) {
    const filename = path.basename(file, path.extname(file));
    const relativeDir = path.dirname(file).replace(INPUT_DIR, "");
    const outDir = path.join(OUTPUT_DIR, relativeDir);

    await fs.mkdir(outDir, { recursive: true });

    console.log(`📸 Processando: ${filename}`);

    // 1. Carrega imagem mantendo metadados (Display P3, etc)
    const image = sharp(file).keepIccProfile();
    const metadata = await image.metadata();
    const originalWidth = metadata.width || 0;

    for (const width of WIDTHS) {
      // Pula se a imagem original for menor que o alvo (evita upscale borrado)
      if (width > originalWidth) continue;

      // Opções de Redimensionamento
      // Doc: https://sharp.pixelplumbing.com/api-resize
      const resizeOptions: sharp.ResizeOptions = {
        width: width,
        withoutEnlargement: true,
        // Lanczos3 preserva detalhes finos melhor que bicubic
        kernel: sharp.kernel.lanczos3,
      };

      const outFileBase = path.join(outDir, `${filename}-${width}w`);

      // GERA AVIF
      await image
        .clone()
        .resize(resizeOptions)
        .avif(AVIF_CONFIG)
        .toFile(`${outFileBase}.avif`);

      // GERA WEBP
      await image
        .clone()
        .resize(resizeOptions)
        .webp(WEBP_CONFIG)
        .toFile(`${outFileBase}.webp`);
    }
    processedCount++;
  }

  const endTime = performance.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log(`\n✅ ${processedCount} imagens processadas em ${duration}s.`);
}

optimizeImages().catch(console.error);
