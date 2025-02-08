import archiver from 'archiver';
import fs from 'fs';

export class ZipRepository {
    static async zipDirectory(sourceDir: string, outputFilePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream(outputFilePath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => resolve(outputFilePath));
            archive.on('error', (err) => reject(err));

            archive.pipe(output);
            archive.directory(sourceDir, false);
            archive.finalize();
        });
    }
}