import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const uploadDir = path.join(process.env.UPLOAD_PATH || "./uploads", "covers");
const tempDir = path.join(uploadDir, "temp");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, `temp-${uniqueSuffix}${extension}`);
    },
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/webp"
    ) {
        cb(null, true);
    } else {
        cb(
            new Error("Tipo de arquivo não suportado. Use JPG, PNG ou WebP"),
            false
        );
    }
};

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 15 * 1024 * 1024,
    },
    fileFilter: fileFilter,
});

/**
 * Comprime e otimiza a imagem de capa do livro
 * - Redimensiona se necessário (máximo 1200px na maior dimensão)
 * - Comprime com qualidade alta (85-90%)
 * - Converte para WebP (melhor compressão) ou JPEG
 * - Remove metadados EXIF para reduzir tamanho
 *
 * @param tempFilePath - Caminho do arquivo temporário
 * @param format - 'webp' ou 'jpeg' (padrão: 'webp')
 * @returns Caminho do arquivo final comprimido
 */
export async function compressBookCover(
    tempFilePath: string,
    format: "webp" | "jpeg" = "webp"
): Promise<string> {
    try {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = format === "webp" ? ".webp" : ".jpg";
        const finalFilename = `book-cover-${uniqueSuffix}${extension}`;
        const finalPath = path.join(uploadDir, finalFilename);

        const image = sharp(tempFilePath);
        const metadata = await image.metadata();

        console.info(
            `image: ${metadata.width}x${metadata.height} (${metadata.format})`
        );

        const maxDimension = 1200;
        let resizeOptions = {};

        if (metadata.width && metadata.height) {
            if (
                metadata.width > maxDimension ||
                metadata.height > maxDimension
            ) {
                resizeOptions = {
                    width:
                        metadata.width > metadata.height
                            ? maxDimension
                            : undefined,
                    height:
                        metadata.height > metadata.width
                            ? maxDimension
                            : undefined,
                    fit: "inside" as const,
                    withoutEnlargement: true,
                };
                console.info(
                    `Redimensionando para ${maxDimension}px na maior dimensão`
                );
            }
        }

        let pipeline = image.resize(resizeOptions);

        if (format === "webp") {
            pipeline = pipeline.webp({
                quality: 90,
                effort: 4,
            });
        } else {
            pipeline = pipeline.jpeg({
                quality: 90,
                progressive: true,
                mozjpeg: true,
            });
        }

        await pipeline
            .withMetadata({ orientation: metadata.orientation })
            .toFile(finalPath);

        const originalSize = fs.statSync(tempFilePath).size;
        const compressedSize = fs.statSync(finalPath).size;
        const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(
            1
        );

        console.info(
            `   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`
        );
        console.info(
            `   Comprimido: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`
        );
        console.info(`   Redução: ${reduction}%`);

        fs.unlinkSync(tempFilePath);

        return `covers/${finalFilename}`;
    } catch (error) {
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
        console.error("Erro ao processar imagem:", error);
        throw new Error("Falha ao processar imagem");
    }
}
