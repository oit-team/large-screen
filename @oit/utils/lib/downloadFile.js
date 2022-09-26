import bufferToURL from './bufferToURL'
/**
 * 下载文件
 * @param {ArrayBuffer} buffer
 * @param {string} fileName
 */
function downloadFile(buffer, fileName) {
  const url = bufferToURL(buffer)
  const downloadElement = document.createElement('a')
  downloadElement.style.display = 'none'
  downloadElement.href = url
  downloadElement.download = fileName
  downloadElement.click()
  window.URL.revokeObjectURL(url)
}
export default downloadFile
