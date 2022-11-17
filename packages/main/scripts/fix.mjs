import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'

const css = resolve('node_modules/@formily/element/esm/__builtins__/styles/common.scss')

const content = readFileSync(css, 'utf8')
// FIXME: 移除波浪号，因为在vite中无法识别，也许有更好的方法
// eslint-disable-next-line @typescript-eslint/quotes
const replaced = content.replace(`@import '~element-ui`, `@import 'element-ui`)

writeFileSync(css, replaced)
