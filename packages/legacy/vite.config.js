import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import Unocss from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Eslint from 'vite-plugin-eslint'
// import {
//   ElementUiResolver,
// } from 'unplugin-vue-components/resolvers'

const config = defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
    },
  },

  build: {
    minify: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'legacy',
      formats: ['es'],
      // the proper extensions will be added
      fileName: 'legacy',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'vue-router', 'element-ui'],
    },
    cssCodeSplit: true,
  },

  plugins: [
    vue(),
    Unocss(),
    Components({
      resolvers: [
        // ElementUiResolver({
        //   importStyle: false,
        // }),
        // IconsResolver({
        //   componentPrefix: '',
        // }),
      ],
      dts: 'src/components.d.ts',
    }),
    Icons(),
    AutoImport({
      imports: [
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
    }),
    Eslint(),
  ],

  server: {
    port: 3333,
  },
})

export default config
