import archiver from "archiver";
import fs from "fs";
import path from "path";
import { logger } from "../../core/utils/logger";

export class ZipRepository {
  static async zipDirectory(sourceDir: string): Promise<string> {
    logger.info(`📦 Initializing compact: ${sourceDir}`);
    return new Promise((resolve, reject) => {
      const outputFilePath = path.join(process.cwd(), "temp", "frames.zip");
      const output = fs.createWriteStream(outputFilePath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", () => {
        logger.info(`✅ Compact file: ${outputFilePath}`);
        resolve(outputFilePath);
      });
      archive.on("error", (err) => {
        logger.error(`😿 Error compact:`, JSON.stringify(err));
        reject(err);
      });

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }
}
