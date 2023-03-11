import { readdir, stat } from 'node:fs';
import { promisify } from 'node:util';
import { join } from 'node:path';

const readdirAsync = promisify(readdir);
const statAsync = promisify(stat);

class HarddiskRepository {
  public async getFilesInformation(path: string) {
    const files = await readdirAsync(path);

    const filesInfo = files.map(async (file) => {
      const filePath = `${path}/${file}`;

      const stats = await statAsync(filePath);

      return {
        name: file,
        size: stats.size,
        updatedAt: stats.mtime
      }
    })

    return Promise.all(filesInfo);
  }

  public getUploadFilesPath(): string {
    const uploadPath = join(__dirname, '..', '..', 'upload');

    return uploadPath;
  }
}

export default HarddiskRepository;
