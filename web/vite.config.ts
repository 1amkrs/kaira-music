import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function youtubeSearchPlugin(): Plugin {
  const handler = async (req: any, res: any, next: any) => {
    const url = req.url || '';
    if (url.startsWith('/api/yt-search')) {
      try {
        const parsedUrl = new URL(url, 'http://localhost');
        const q = parsedUrl.searchParams.get('q') || '';
        if (!q.trim()) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ videoId: null, videoIds: [] }));
          return;
        }

        const ytRes = await fetch(
          'https://www.youtube.com/youtubei/v1/search?key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
            body: JSON.stringify({
              context: {
                client: {
                  clientName: 'WEB',
                  clientVersion: '2.20240101.00.00',
                },
              },
              query: q,
            }),
          }
        );

        if (!ytRes.ok) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ videoId: null, videoIds: [] }));
          return;
        }

        const text = await ytRes.text();
        const matches = [...text.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)];
        const uniqueIds: string[] = [];
        for (const match of matches) {
          const id = match[1];
          if (!uniqueIds.includes(id)) {
            uniqueIds.push(id);
          }
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            videoId: uniqueIds[0] || null,
            videoIds: uniqueIds.slice(0, 5),
          })
        );
      } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ videoId: null, videoIds: [] }));
      }
      return;
    }
    next();
  };

  return {
    name: 'youtube-search-proxy',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), youtubeSearchPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});
