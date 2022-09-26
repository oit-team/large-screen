function bufferToURL(buffer: ArrayBuffer) {
  const blob = new Blob([buffer], { type: 'application/octet-stream' })
  return window.URL.createObjectURL(blob)
}

export default bufferToURL
