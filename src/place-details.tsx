import { useQuery } from 'react-query';
import { memo, useCallback, useMemo } from 'react';
import {
  Box,
  Heading,
  Paragraph,
  Flex,
  Close,
  Image,
  AspectRatio,
  Text,
} from 'theme-ui';

import { ImageSet as ImageSetType, PlaceDetails as PlaceDetailsType } from "./api";
import { useGoBack } from './utils';
import { Link } from '@tanstack/react-location';
import { PADDING_BODY } from './config';

export const PlaceDetails = memo(({
  place,
}: {
  place: PlaceDetailsType,
}) => {
  const close = useGoBack();
  return (
    <>
      <Flex py='1em' px={PADDING_BODY.horizontal} mb='3em'>
        <Heading as='h1' sx={{ flex: '1 1 auto' }}>
          {place.name}
        </Heading>
        <CloseButton onClick={close} />
      </Flex>
      <Box sx={{ paddingLeft: PADDING_BODY.horizontal }}>
        {Object.entries(place.imageSets).map(([id, imageSetSummary]) => 
          <ImageSetSummary key={id} imageSet={imageSetSummary} />
        )}
      </Box>
    </>
  );
})

const ImageSetSummary = ({ imageSet }: { imageSet: ImageSetType }) => {
  const imageHeight = 20
  const imageWidth = (4/3) * imageHeight;
  return (
    <Flex sx={{ width: '100%', maxWidth: '100%', height: `${imageHeight}em` }}>
      <Link to={`./${imageSet.id}`} style={{ display: 'block', flex: '0 0 40ch', textDecoration: 'none  ' }}>
        <Box>
          <Heading as='h2'>{imageSet.title}</Heading>
          <Heading as='h3'>{imageSet.author}</Heading>
          <br />
          <Paragraph sx={{ fontFamily: 'heading' }}>{imageSet.summary}</Paragraph>
        </Box>
      </Link>
      <Spacer />
      <Flex sx={{ overflowY: 'auto', gap: '1em', flex: '1 auto' }}>
        {Object.values(imageSet.media).map(({ url, meta }, index) =>
          // <AspectRatio ratio={4 / 3} sx={{ outline: '1px solid darkgreen', flex: 'none' }}>
            <Image
              src={url}
              sx={{
                objectFit: 'cover',
                width: `${imageWidth}em`,
                height: `${imageHeight}em`,
                cursor: 'pointer',
                flex: 'none',
                backgroundColor: 'lightgray'
              }}
            />
          // </AspectRatio>
        )}
        <Spacer />
      </Flex>
    </Flex>
  )
}

const Spacer = () => <Box sx={{ flex: '0 0 1em' }} />

const CloseButton = ({ onClick }) => (
  <Close onClick={onClick} sx={{ cursor: 'pointer' }} />
)
