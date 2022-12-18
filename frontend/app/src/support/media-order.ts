import { isEmpty } from "lodash";
import { useMemo } from "react";
import { ImageMediaObject } from "../api";

type WithId<T> = T & { id: string }

export const firstByMediaOrder = <Item extends ImageMediaObject>(
  media: Record<string, Item>,
  order: string[]
): WithId<Item> | null => {
  for (const [id, value] of iterByOrder(media, order)) {
    return { ...value, id };
  }
  return null;
} 

export const sortByMediaOrder = <Item>(media: Record<string, Item>, order: string[]): WithId<Item>[] => {
  const res: WithId<Item>[] = [];
  for (const [id, value] of iterByOrder(media, order)) {
    res.push({ ...value, id });
  }
  return res;
}

export const useOrderedMedia = <Item>(media: Record<string, Item>, order: string[]): WithId<Item>[] => {
  return useMemo(() => [...sortByMediaOrder(media, order)], [media, order])
}

export function* iterByOrder<T>(items: Record<string, T>, order: string[]): IterableIterator<[name: string, value: T]> {
  const source = { ...items };
  for (const name of order) {
    if (!(name in source)) {
      continue
    }
    const val = source[name];
    yield [name, val];
    delete source[name];
  }
  // on the off-chance something's not in the media order,
  // it'll still be left over in source.
  // there's not much we can do except add it in at the end
  if (!isEmpty(source)) {
    yield* (Object.entries(source))
  }
}