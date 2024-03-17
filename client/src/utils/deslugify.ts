import capitalize from 'capitalize'

const deslugify = (str: string) => {
  return capitalize.words(str.replace(/-/g, ' '))
}

export default deslugify
