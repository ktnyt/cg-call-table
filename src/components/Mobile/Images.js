const importAll = r => {
  const images = {}
  r.keys().forEach((item, index) => { images[item.replace('./', '').replace('.jpg', '')] = r(item) })
  return images
}

const Images = importAll(require.context('../../img', false, /\.jpg/))

export default Images
