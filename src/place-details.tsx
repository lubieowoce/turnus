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

import { ImageSet as ImageSetType, PlaceDetails as PlaceDetailsType } from "./api";
import { useGoBack } from './utils';

export const PlaceDetails = memo(({
  place,
}: {
  place: PlaceDetailsType,
}) => {
  const close = useGoBack();
  const imageSet = Object.values(place.imageSets)[0] ?? null
  return (
    <>
      <Flex>
        <Heading as='h1' sx={{ flex: '1 1 auto' }}>
          {place.name}
        </Heading>
        <CloseButton onClick={close} />
      </Flex>
      {imageSet &&
        <Box>
          <Box sx={{ fontFamily: 'body' }} dangerouslySetInnerHTML={{ __html: place.description }} />
          <Divider />
          <LightGalleryProvider>
            <ImageSetPreview imageSet={imageSet} />
          </LightGalleryProvider>
        </Box>
      }
    </>
  );
})

const galleryGroupId = (imageSet: ImageSetType) => `gallery-group-${imageSet.id}`

const ImageSetPreview = ({ imageSet }: { imageSet: ImageSetType }) => {
  const GALLERY_GROUP = galleryGroupId(imageSet);
  const { openGallery } = useLightGallery();
  // if (!collection) {
  //   return (
  //     <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  //       <Spinner />
  //     </Box>
  //   )
  // }
  return (
    <Box>
      <Paragraph mb="1em">{imageSet.summary}</Paragraph>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px 10px',
        pb: '3',
      }}>
        {Object.values(imageSet.media).map(({ url }, index) =>
          <LightGalleryItem src={url} key={url} group={GALLERY_GROUP}>
            <AspectRatio ratio={1 / 1}>
              <Image
                src={url}
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
