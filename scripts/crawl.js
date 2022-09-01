#!/usr/bin/env node
const HOST = 'http://skadinad.turnusik.com'
const API_ROOT = `${HOST}/backend/api`

const placesUrl = () => `${API_ROOT}/places.json`
const placeUrl = ({ placeId }) => `${API_ROOT}/places/${placeId}.json`
const imageSetUrl = ({ placeId, imageSetId }) => `${API_ROOT}/places/${placeId}/${imageSetId}.json`

const main = async () => {
  const { items: places } = await (await fetch(placesUrl())).json();
  const numPlaces = Object.keys(places).length
  console.log(`fetched ${numPlaces} places`);
  let i = 0
  for (const placeId in places) {
    console.log(`[${i + 1}/${numPlaces}]\t${placeId}`);
    const placeDetails = await (await fetch(placeUrl({ placeId }))).json();
    for (const imageSetId in placeDetails.imageSets) {
      const url = imageSetUrl({ placeId, imageSetId })
      console.log(`\t${imageSetId} - ${url}`)
      const imageSet = await (await fetch(imageSetUrl({ placeId, imageSetId }))).json();
      const imageCount = Object.keys(imageSet.media).length
      console.log(`\t\t${imageCount} images`)
    }
    i++;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
})