import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { logger } from "../../core/utils/logger";

export class FfmpegRepository {
  static async extractFrames(filePath: string, fps = 1): Promise<string> {
    logger.info(`⛏️ Initializing .`, JSON.stringify({ filePath, fps }));
    const outputDir = path.join(process.cwd(), "temp", "frames");
    return await new Promise(async (resolve, reject) => {
      if (!fs.existsSync(outputDir))
        fs.mkdirSync(outputDir, { recursive: true });

      ffmpeg(filePath)
        .output(path.join(outputDir, "frame-%04d.jpeg"))
        .outputOptions([`-vf fps=${fps}`])
        .on("end", () => {
          logger.info(`✅ Frames extract in: ${outputDir}`);
          resolve(outputDir);
        })
        .on("error", (err) => {
          logger.error(`😿 Error frames:`, JSON.stringify(err));
          reject(err);
        })
        .run();
    });
  }
}
