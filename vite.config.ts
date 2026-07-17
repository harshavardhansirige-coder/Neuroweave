import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to copy generated asset on server run
const copyAssetPlugin = () => ({
  name: 'copy-generated-asset',
  configureServer() {
    const srcPath = 'C:\\Users\\Sirige Harshavardhan\\.gemini\\antigravity\\brain\\bfe3d0ff-b7ea-4f00-b344-62c2753fdf6c\\futuristic_robot_1784291009785.png';
    const destDir = path.resolve('./public');
    const destPath = path.resolve(destDir, 'futuristic_robot.png');

    try {
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log('>>> [LearnForge AI] Successfully copied futuristic_robot.png to public folder.');
      } else {
        console.warn('>>> [LearnForge AI] Source robot image not found at:', srcPath);
      }
    } catch (err) {
      console.error('>>> [LearnForge AI] Failed to copy robot asset:', err);
    }
  }
});

export default defineConfig({
  plugins: [react(), copyAssetPlugin()],
  server: {
    port: 3000,
    host: true
  }
})
