function convertURI(host: string) {
  try {
    const uri = new URL(host)
    return `${uri.protocol}//www.${uri.host}`
  } catch (error) {
    console.log(error)
    return host
  }
}

export default convertURI
