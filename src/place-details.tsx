import { useQuery } from 'react-query';
import { memo, useCallback, useMemo } from 'react';
import {
  Box,
  Heading,
  Paragraph,
  Divider,
  Flex,
  Close,
  Spinner,
  Image,
  AspectRatio,
  Text,
} from 'theme-ui';

import {
  LightgalleryProvider as LightGalleryProvider,
  LightgalleryItem as LightGalleryItem,
  useLightgallery as useLightGallery
} from "react-lightgallery";
import "lightgallery.js/dist/css/lightgallery.css";

import { getImageCollection, PointFeature, usePlaces } from "./api";
import { useGoBack } from './utils';

export const PlaceDetails = memo(({
  placeId,
  places,
}: {
  placeId: string,
  places: Record<string, PointFeature>
}) => {
  const feature = places[placeId];
  const number = useMemo(() => Object.keys(places).indexOf(placeId), [places, placeId]);
  const close = useGoBack();
  return (
    <>
      <Flex>
        <Heading sx={{ flex: '1 1 auto' }}>
          <Text sx={{ fontWeight: 'light' }}>{number}.</Text> {feature.properties.city}</Heading>
        <CloseButton onClick={close} />
      </Flex>
      <Box>
        <Paragraph>{feature.properties.country}</Paragraph>
        <Divider />
        <LightGalleryProvider>
          <ImageCollection id={placeId} />
        </LightGalleryProvider>
      </Box>
    </>
  );
})

const ImageCollection = ({ id }) => {
  const GALLERY_GROUP = `gallery-group-${id}`;
  const { data: collection } = useQuery({
    queryFn: () => getImageCollection({ id }),
    queryKey: `collections/${id}`,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const { openGallery } = useLightGallery();
  if (!collection) {
    return (
      <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </Box>
    )
  }
  return (
    <Box>
      <Paragraph mb="1em">{collection.description}</Paragraph>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px 10px',
        pb: '3',
      }}>
        {collection.items.map(({ imageUrl }, index) =>
          <LightGalleryItem src={imageUrl} key={`${imageUrl}-${index}`} group={GALLERY_GROUP}>
            <AspectRatio ratio={1 / 1}>
              <Image
                src={imageUrl}
                sx={{ objectFit: 'cover', height: '100%', width: '100%', cursor: 'pointer' }}
                onClick={() => openGallery(GALLERY_GROUP, index)}
              />
            </AspectRatio>
          </LightGalleryItem>
        )}
      </Box>
    </Box>
  )
}

const CloseButton = ({ onClick }) => (
  <Close onClick={onClick} sx={{ cursor: 'pointer' }} />
)
