import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);
const existsAsync = promisify(fs.exists);

class UploadService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = process.env.UPLOAD_PATH || 'uploads';
    this.ensureUploadDirectories();
  }

  // Ensure upload directories exist
  private ensureUploadDirectories(): void {
    const directories = [
      this.uploadDir,
      path.join(this.uploadDir, 'avatars'),
      path.join(this.uploadDir, 'venues'),
      path.join(this.uploadDir, 'reviews')
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created upload directory: ${dir}`);
      }
    });
  }

  // Delete file
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      // Remove leading slash if present
      const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
      const fullPath = path.join(process.cwd(), cleanPath);

      if (await existsAsync(fullPath)) {
        await unlinkAsync(fullPath);
        console.log(`🗑️ File deleted: ${fullPath}`);
        return true;
      } else {
        console.log(`⚠️ File not found: ${fullPath}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Error deleting file:', error);
      return false;
    }
  }

  // Get file info
  getFileInfo(filePath: string): any {
    try {
      const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
      const fullPath = path.join(process.cwd(), cleanPath);
      
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        return {
          exists: true,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime,
          extension: path.extname(fullPath),
          filename: path.basename(fullPath)
        };
      }
      
      return { exists: false };
    } catch (error) {
      console.error('Error getting file info:', error);
      return { exists: false, error: (error as Error).message };
    }
  }

  // Validate file type
  isValidImageType(mimetype: string): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];
    return allowedTypes.includes(mimetype);
  }

  // Validate file size
  isValidFileSize(size: number, maxSize?: number): boolean {
    const maxFileSize = maxSize || parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default
    return size <= maxFileSize;
  }

  // Generate unique filename
  generateUniqueFilename(originalName: string, prefix?: string): string {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
    const prefixPart = prefix ? `${prefix}_` : '';
    
    return `${prefixPart}${cleanBaseName}_${timestamp}_${random}${extension}`;
  }

  // Clean up old files (utility function)
  async cleanupOldFiles(directory: string, maxAge: number = 30): Promise<void> {
    try {
      const dirPath = path.join(process.cwd(), this.uploadDir, directory);
      
      if (!fs.existsSync(dirPath)) {
        return;
      }

      const files = fs.readdirSync(dirPath);
      const now = Date.now();
      const maxAgeMs = maxAge * 24 * 60 * 60 * 1000; // Convert days to milliseconds

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (now - stats.mtime.getTime() > maxAgeMs) {
          await unlinkAsync(filePath);
          console.log(`🧹 Cleaned up old file: ${filePath}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old files:', error);
    }
  }

  // Get upload statistics
  getUploadStats(): any {
    try {
      const stats: {
        totalFiles: number;
        totalSize: number;
        directories: { [key: string]: any };
      } = {
        totalFiles: 0,
        totalSize: 0,
        directories: {}
      };

      const scanDirectory = (dirPath: string, dirName: string) => {
        if (!fs.existsSync(dirPath)) {
          return { files: 0, size: 0 };
        }

        const files = fs.readdirSync(dirPath);
        let dirFiles = 0;
        let dirSize = 0;

        files.forEach(file => {
          const filePath = path.join(dirPath, file);
          const fileStat = fs.statSync(filePath);
          
          if (fileStat.isFile()) {
            dirFiles++;
            dirSize += fileStat.size;
          }
        });

        return { files: dirFiles, size: dirSize };
      };

      // Scan main directories
      const directories = ['avatars', 'venues', 'reviews'];
      
      directories.forEach(dir => {
        const dirPath = path.join(process.cwd(), this.uploadDir, dir);
        const dirStats = scanDirectory(dirPath, dir);
        
        stats.directories[dir] = dirStats;
        stats.totalFiles += dirStats.files;
        stats.totalSize += dirStats.size;
      });

      return stats;
    } catch (error) {
      console.error('Error getting upload stats:', error);
      return { error: (error as Error).message };
    }
  }
}

// Export singleton instance
export const uploadService = new UploadService();
export default uploadService;