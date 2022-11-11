import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
// import Components from 'unplugin-vue-components/vite'
// import Icons from 'unplugin-icons/vite'
// import IconsResolver from 'unplugin-icons/resolver'
// import AutoImport from 'unplugin-auto-import/vite'
import Eslint from 'vite-plugin-eslint'
import VueJsx from '@vitejs/plugin-vue2-jsx'
// import {
//   ElementUiResolver,
// } from 'unplugin-vue-components/resolvers'

const config = defineConfig({
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
    },
  },

  build: {
    minify: true,
    sourcemap: true,
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
      external: [
        // 'element-ui',
        'lodash-es',
        'axios',
      ],
    },
    // cssCodeSplit: true,
  },

  plugins: [
    VueJsx(),
    vue(),
    // Components({
    //   resolvers: [
    //     // ElementUiResolver({
    //     //   importStyle: false,
    //     // }),
    //     // IconsResolver({
    //     //   componentPrefix: '',
    //     // }),
    //   ],
    //   dts: 'src/components.d.ts',
    // }),
    // Icons(),
    // AutoImport({
    //   imports: [
    //     '@vueuse/core',
    //   ],
    //   dts: 'src/auto-imports.d.ts',
    // }),
    Eslint(),
  ],

  css: {
    preprocessorOptions: {
      less: {
        charset: false,
      },
    },
  },

  server: {
    port: 3333,
  },
})

export default config
