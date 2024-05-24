function convertURI(host: string) {
  const uri = new URL(host)
  return `${uri.protocol}//www.${uri.host}`
}

export default convertURI;