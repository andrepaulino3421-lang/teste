import fs from 'node:fs';
import path from 'node:path';

const outputDir = path.resolve('dist');
const outputFile = path.join(outputDir, 'precificapro-replit.zip');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

let archiver;
try {
  archiver = (await import('archiver')).default;
} catch {
  console.error('Erro: dependência "archiver" não encontrada.');
  console.error('Alternativas:');
  console.error('mac/linux: zip -r precificapro-replit.zip . -x "node_modules/*" ".next/*" ".git/*" ".env*" "dist/*" "prisma/dev.db"');
  console.error('windows powershell: Compress-Archive -Path * -DestinationPath precificapro-replit.zip -Force');
  process.exit(1);
}

const output = fs.createWriteStream(outputFile);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => console.log(`ZIP criado: ${outputFile} (${archive.pointer()} bytes)`));
archive.on('error', (err) => {
  console.error('Falha ao gerar ZIP:', err.message);
  process.exit(1);
});

archive.pipe(output);
archive.glob('**/*', {
  dot: true,
  ignore: [
    'node_modules/**',
    '.next/**',
    '.git/**',
    '.env*',
    'prisma/dev.db',
    'logs/**',
    'tmp/cache/**',
    'dist/**'
  ]
});

await archive.finalize();
