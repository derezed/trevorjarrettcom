#!/usr/bin/env node
require('esbuild').build({
    entryPoints: ['src/scripts/index.js'],
    outfile: './web/assets/index.js',
    bundle: true,
    watch: {
        onRebuild(error, result) {
          if (error) console.error('watch build failed:', error)
          else console.log('watch build succeeded:', result)
        },
      },
}).then(() => {
    console.log('js watching...');
});
