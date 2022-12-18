import { useQuery, UseQueryOptions } from "react-query"

// const API_ROOT = 'http://localhost:3000'
const API_ROOT = '/backend/api'

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
  "place_type": 'city',
  "is_capital": boolean | null,
  "population": number | null,
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
  "media_order": string[],
}

export type ImageSetDetails = {
  "title": string,
  "author": string,
  "id": string,
  "content": string,
  "media": Record<string, ImageMediaObject>,
  "media_order": string[],
}

export type ImageMediaObject = {
  url: string,
  sizes: {
    thumbnail: string,
    large: string,
  }
}

// export type ImageMediaObject = {
//   url: string,
//   meta: ImageMediaObjectMeta,
// }

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

export type EventList = {
  "meta": Record<string, any>,
  "count": number,
  "events": Record<string, EventSummary>,
}

export type EventSummary = {
  "title": string,
  "location": string,
  "time": string,
  "id": string,
  "summary": string,
  "media": Record<string, ImageMediaObject>,
  "media_order": string[],
}

export type EventDetails = {
  "title": string,
  "location": string,
  "time": string,
  "id": string,
  "content": string,
  "media": Record<string, ImageMediaObject>,
  "media_order": string[],
}

export type PostsByAuthor = Record<
  string,
  { "path": string, "place": string, "title": string, "author": string }[]
>

type QueryDef<T> = {
  queryKey: string,
  queryFn: () => Promise<T>,
}

export const placesQuery = (): QueryDef<Places> => {
  const url = `${API_ROOT}/places.json`
  return {
    queryFn: async () => {
      const res = await fetch(url)
      return await res.json() as Places;
    },
    queryKey: url,
  }
}


export const usePlaces = () => {
  return useQuery({
    ...placesQuery(),
  })
}

export const useEvents = () => {
  const url = `${API_ROOT}/events.json`
  return useQuery({
    queryFn: async () => {
      const res = await fetch(url)
      return await res.json() as EventList;
    },
    queryKey: url,
  })
}

export const useEventDetails = ({ eventId }: { eventId: string }) => {
  const url = `${API_ROOT}/events/${eventId}.json`
  return useQuery({
    queryFn: async () => {
      const res = await fetch(url)
      return await res.json() as EventDetails;
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

export const mapGeographyQuery = (): QueryDef<Geography> => {
  const url = `${process.env.PUBLIC_URL}/data/wojewodztwa-min.geojson`
  return {
    queryKey: url,
    queryFn: async () => {
      const res = await fetch(url);
      return await res.json() as Geography;
    },
  }
}

export const useMapGeography = () => {
  return useQuery({
    ...mapGeographyQuery(),
  })
}

export const usePostsByAuthor = <T = PostsByAuthor>(options: Partial<UseQueryOptions<PostsByAuthor, unknown, T>>) => {
  const url = `${API_ROOT}/people.json`
  return useQuery({
    queryFn: async () => {
      const res = await fetch(url)
      return await res.json() as PostsByAuthor;
    },
    queryKey: url,
    ...options,
  })
}

export const useAuthors = () => {
  return usePostsByAuthor({ select: (data) => Object.keys(data) })
}
