import { Palette, PatternParams } from '@/types';
import { renderWallpaper } from './index';

export interface ExportOptions {
  patternId: string;
  palette: Palette;
  params: PatternParams;
  width: number;
  height: number;
  filename?: string;
  format?: 'png' | 'jpeg';
  quality?: number;
}

/**
 * Renders wallpaper on a detached offscreen canvas at native target resolution
 * and triggers direct browser file download.
 */
export async function exportWallpaper(options: ExportOptions): Promise<void> {
  const {
    patternId,
    palette,
    params,
    width,
    height,
    filename = 'wallogen-wallpaper',
    format = 'png',
    quality = 0.95,
  } = options;

  // Create native offscreen canvas at exact export resolution (e.g. 3840x2160)
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to obtain 2D canvas context for export.');
  }

  // Render pure pattern at target resolution
  renderWallpaper(ctx, width, height, patternId, palette, params);

  // Convert canvas to Blob and initiate download
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to generate image blob from canvas.'));
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}_${width}x${height}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Revoke URL after short delay
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        resolve();
      },
      mimeType,
      quality
    );
  });
}
