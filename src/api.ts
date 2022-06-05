import { keyBy, sample } from "lodash"
import { useQuery } from "react-query"

export type PointFeature = {
  "properties": {
    "country": string,
    "city": string,
    "tld": string,
    "iso3": string,
    "iso2": string,
  },
  "geometry": {
    "coordinates": [lon: number, lat: number],
    "type": "Point"
  },
  "id": string,
}
export type FeatureCollection = {
  "type": "FeatureCollection",
  "features": PointFeature[],
}

export const usePlaces = () => {
  return useQuery({
    queryFn: async () => {
      const res = await fetch(process.env.PUBLIC_URL + "/data/capitals.json")
      const collection: FeatureCollection = await res.json();
      return keyBy(
        collection.features.filter((feature) => feature.properties.city !== undefined),
        'id'
      )
    },
    queryKey: process.env.PUBLIC_URL + "/data/capitals.json",
  })
}

export const getImageCollection = async ({ id }) => {
  const length = 3 + Math.floor(Math.random() * 5)
  const promises: Promise<string>[] = []
  for (let i = 0; i < length; i++) {
    promises.push(getRandomImage())
  }
  const urls = await Promise.all(promises);
  return {
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    items: urls.map((imageUrl) => ({
      imageUrl,
      description: 'Lorem ipsum dolor sit amet.',
    }))
  }
}

export const getRandomImage = async (): Promise<string> => {
  const queries = [
    'city,day',
    'city,night',
    'landscape,day',
    'landscape,sunset',
    'village,mountains',
    'architecure,bright',
    'architecure,dark',
  ]
  const res = await fetch(`https://source.unsplash.com/random/?${sample(queries)}&cacheBust=${Date.now()}`, { cache: 'no-store' });
  return res.url
}

