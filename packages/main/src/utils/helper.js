/*
图片加载为缩略图
*/
export function convertImageSize(img, size = 's') {
  return img && img.replace(/(.*)\./, `$1_${size}.`)
}
