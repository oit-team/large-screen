import AES from 'crypto-js/aes'
import utf8 from 'crypto-js/enc-utf8'
import pkcs7 from 'crypto-js/pad-pkcs7'
import ecbMode from 'crypto-js/mode-ecb'

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
    const key = utf8.parse(keyStr)
    const str = utf8.parse(word)
    const encrypted = AES.encrypt(str, key, {
      mode: ecbMode,
      padding: pkcs7,
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
