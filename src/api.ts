import { keyBy, sample } from "lodash"
import { useQuery } from "react-query"

const API_ROOT = 'http://localhost:3000'
// const API_ROOT = 'https://localhost:8000'

export type PlaceId = string;

export type Place = {
  "name": string,
  "id": PlaceId,
  "description": string,
  "coordinates": {
    "lat": number,
    "lon": number,
  },
}

export type PlaceDetails = {
  "name": string,
  "id": PlaceId,
  "description": string,
  "coordinates": {
    "lat": number,
    "lon": number,
  },
}

export type Places = {
  "meta": Record<string, any>,
  "count": number,
  "items": Record<PlaceId, Place>,
}

export const usePlaces = () => {
  const url = `${API_ROOT}/places.json`
  return useQuery({
    queryFn: async () => {
      const res = await fetch(url)
      return await res.json() as Places;
    },
    queryKey: url,
  })
}

export type Geography = {
  type: "Topology",
  [key: string]: any,
}

export const useMapGeography = () => {
  const url = `${process.env.PUBLIC_URL}/data/world-110m.json`
  return useQuery({
    queryFn: async () => {
      const res = await fetch(url);
      return await res.json() as Geography;
    },
    queryKey: url,
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

