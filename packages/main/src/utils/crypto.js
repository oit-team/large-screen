import * as crypto from 'crypto-js'

const KEY = 'F7FA3CB95EFDB120'

export default {
  /**
   * 加密
   * @param string word 要加密的文本
   * @param string keyStr 密钥
   * @returns 结果
   */
  encrypt(word, keyStr) {
    keyStr = keyStr || KEY
    const key = crypto.enc.Utf8.parse(keyStr)
    const str = crypto.enc.Utf8.parse(word)
    const encrypted = crypto.AES.encrypt(str, key, {
      mode: crypto.mode.ECB,
      padding: crypto.pad.Pkcs7,
    })
    return encrypted.toString()
  },
  /**
   * 解密
   * @param string word 要解密的文本
   * @param string keyStr 密钥
   * @returns 结果
   */
  decrypt(word, keyStr) {
    keyStr = keyStr || KEY
    const key = utf8.parse(keyStr)
    const decrypt = AES.decrypt(word, key, {
      mode: ecbMode,
      padding: pkcs7,
    })
    return utf8.stringify(decrypt).toString()
  },
}
