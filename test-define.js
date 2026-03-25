import { build } from 'vite';
build({
  configFile: false,
  root: '.',
  build: { outDir: 'dist-test', minify: false },
  define: {
    'process.env.GEMINI_API_KEY': JSON.stringify(undefined),
  }
}).then(() => console.log('build success')).catch(e => console.error(e));
