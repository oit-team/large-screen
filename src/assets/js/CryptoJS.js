//封装加解密方法
import CryptoJS from "crypto-js";
/**
  * 
  * 第一个参数word是待加密或者解密的字符串；
  * 第二个参数keyStr是aes加密需要用到的16位字符串的key,keyStr 的长度要不小于14位，否则解密时会显示空白；
  * 
  * 如果想对一个js对象加密，需要先把该对象转成json字符串。 
  */
export default {
  // // 加密
  // encrypt(word, keyStr) {
  //   keyStr = keyStr ? keyStr : "21ssadad23223123dsaddas";
  //   let key = CryptoJS.enc.Utf8.parse(keyStr);
  //   let srcs = CryptoJS.enc.Utf8.parse(word);
  //   let encrypted = CryptoJS.AES.encrypt(srcs, key, {
  //     mode: CryptoJS.mode.ECB,
  //     padding: CryptoJS.pad.Pkcs7
  //   });
  //   return encrypted.toString();
  // },
  // // 解密
  // decrypt(word, keyStr) {
  //   keyStr = keyStr ? keyStr : "21ssadad23223123dsaddas";
  //   var key = CryptoJS.enc.Utf8.parse(keyStr);
  //   var decrypt = CryptoJS.AES.decrypt(word, key, {
  //     mode: CryptoJS.mode.ECB,
  //     padding: CryptoJS.pad.Pkcs7
  //   });
  //   return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  // }


  // 加密
  encrypt(word, keyStr) {
    keyStr = keyStr ? keyStr : "F7FA3CB95EFDB120";
    let key = CryptoJS.enc.Utf8.parse(keyStr);
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  },
  // 解密
  decrypt(word, keyStr) {
    keyStr = keyStr ? keyStr : "F7FA3CB95EFDB120";
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var decrypt = CryptoJS.AES.decrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  }

  // let encJson = cryptoJS.AES.encrypt(JSON.stringify(newUserInfo), 'aes').toString();
  // //对加密数据进行base64处理, 原理：就是先将字符串转换为utf8字符数组，再转换为base64数据
  // let encData = cryptoJS.enc.Base64.stringify(cryptoJS.enc.Utf8.parse(encJson));

  // //将数据先base64还原，再转为utf8数据
  // let decData = cryptoJS.enc.Base64.parse(sessionStorage.getItem('userInfo')).toString(cryptoJS.enc.Utf8);
  // //解密数据
  // let decJson = cryptoJS.AES.decrypt(decData, 'aes').toString(cryptoJS.enc.Utf8);



};
