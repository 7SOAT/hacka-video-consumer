import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

export class ZipRepository {    
    static async zipDirectory(sourceDir: string): Promise<string> {
        console.log(`📦 Compactando frames em arquivo .zip: ${sourceDir}`)
        return new Promise((resolve, reject) => {
            const outputFilePath = path.join(process.cwd(), "temp", "frames.zip");
            const output = fs.createWriteStream(outputFilePath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => {
                console.log(`✅ .zip criado com sucesso: ${outputFilePath}/frames.zip`);
                resolve(outputFilePath)                 
            });
            archive.on('error', (err) => {
                console.log(`😿 Erro ao compactar arquivo .zip: ${outputFilePath}/frames.zip`, JSON.stringify(err));
                reject(err)
            });

            archive.pipe(output);
            archive.directory(sourceDir, false);
            archive.finalize();
        });
    }
}