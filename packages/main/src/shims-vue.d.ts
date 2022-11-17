declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '@oit/element-ui-extend' {
  import { TablePage, Upload } from '@oit/element-ui-extend'
  export const TablePage: TablePage
  export const Upload: Upload
}
