import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

export class FfmpegRepository {
    static async extractFrames(filePath: string, fps = 1) {
        const outputDir = path.join(process.cwd(), "temp", "frames");
        return new Promise(async (resolve, reject) => {
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
            const ffmpegPath = path.join(process.cwd(), "../devops/installers/ffmpeg.dll");
            const ffprobePath = path.join(process.cwd(), "../devops/installers/ffprobe.dll");
            ffmpeg.setFfmpegPath(ffmpegPath);
            ffmpeg.setFfprobePath(ffprobePath);
            ffmpeg(filePath)
                .output(path.join(outputDir, "frame-%04d.jpeg"))
                .outputOptions([`-vf fps=${fps}`])
                .on("end", () => {
                    console.log(`✅ Frames extraídos em: ${outputDir}`);
                    resolve(outputDir);
                })
                .on("error", (err) => {
                    console.error("❌ Erro ao extrair frames:", err);
                    reject(err);
                })
                .run();
        })
    }
}