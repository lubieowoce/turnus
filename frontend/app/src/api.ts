import { keyBy, sample } from "lodash"
import { useQuery } from "react-query"

// const API_ROOT = 'http://localhost:3000'
const API_ROOT = '/api'

export type PlaceId = string;
export type ImageSetId = string;

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
  "imageSets": Record<ImageSetId, ImageSet>,
}

export type ImageSet = {
  "title": string,
  "author": string,
  "id": string,
  "summary": string,
  "media": Record<string, ImageMediaObject>,
}

export type ImageSetDetails = {
  "title": string,
  "author": string,
  "id": string,
  "content": string,
  "media": Record<string, ImageMediaObject>,
}

export type ImageMediaObject = {
  url: string,
  meta: ImageMediaObjectMeta,
}

export type ImageMediaObjectMeta = {
  "type": "image",
  "thumb": string,
  "mime": string,
  "image": Record<string, any>,
  "filepath": string,
  "filename": string,
  "basename": string,
  "extension": string,
  "path": string, // absolute filepath
  "modified": number, // timestamp
  "thumbnails": {
    "default": string // absolute filepath,
    "media": string // absolute filepath
  },
  "size": number,
  "debug": boolean,
  "width": number,
  "height": number
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

export const usePlace = ({ id }: { id: string }) => {
  const url = `${API_ROOT}/places/${id}.json`
  return useQuery({
    queryFn: async () => {
      const res = await fetch(url)
      return await res.json() as PlaceDetails;
    },
    queryKey: url,
  })
}

export const useImageSet = ({ placeId, imageSetId }: { placeId: string, imageSetId: string }) => {
  const url = `${API_ROOT}/places/${placeId}/${imageSetId}.json`
  return useQuery({
    queryFn: async () => {
      const res = await fetch(url)
      return await res.json() as ImageSetDetails;
    },
    queryKey: url,
  })
}

export type Geography = {
  type: "Topology",
  [key: string]: any,
}

export const useMapGeography = () => {
  const url = `${process.env.PUBLIC_URL}/data/wojewodztwa-min.geojson`
  return useQuery({
    queryFn: async () => {
      const res = await fetch(url);
      return await res.json() as Geography;
    },
    queryKey: url,
  })
}

