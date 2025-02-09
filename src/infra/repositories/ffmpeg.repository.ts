import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

export class FfmpegRepository {
    static async extractFrames(filePath: string, fps = 1): Promise<string> {
        console.log(`⛏️ Iniciando extracao dos frames.`, JSON.stringify({ filePath, fps }))
        const outputDir = path.join(process.cwd(), "temp", "frames");
        return await new Promise(async (resolve, reject) => {
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
            
            ffmpeg(filePath)
            .output(path.join(outputDir, "frame-%04d.jpeg"))
            .outputOptions([`-vf fps=${fps}`])
            .on("end", () => {
                console.log(`✅ Frames extraidos em: ${outputDir}`);
                resolve(outputDir);
            })
            .on("error", (err) => {
                console.error("😿 Erro ao extrair frames:", JSON.stringify(err));
                reject(err);
            })
            .run();            
        })
    }
}