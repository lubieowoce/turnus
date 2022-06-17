import { memo } from 'react';
import {
  Box,
  Heading,
  Paragraph,
  Flex,
  Close,
  Image,
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
  const imageSets = Object.entries(place.imageSets);
  return (
    <>
      <Flex py='1em' px={PADDING_BODY.horizontal} mb='3em'>
        <Heading as='h1' sx={{ flex: '1 1 auto' }}>
          {place.name}
        </Heading>
        <CloseButton onClick={close} />
      </Flex>
      <Box sx={{ paddingLeft: PADDING_BODY.horizontal }}>
        {!imageSets.length && (
          <Text sx={{ fontStyle: 'italic' }}>{'Nie ma tu jeszcze żadnych prac.'}</Text>
        )}
        {imageSets.map(([id, imageSetSummary]) =>
          <ImageSetSummary key={id} imageSet={imageSetSummary} />
        )}
      </Box>
    </>
  );
})

const ImageSetSummary = ({ imageSet }: { imageSet: ImageSetType }) => {
  const imageHeightEm = 20;
  const imageWidthEm = (4/3) * imageHeightEm;
  const imageHeight = `${imageHeightEm}em`;
  const imageWidth = `${imageWidthEm}em`;
  return (
    <Flex sx={{ width: '100%', maxWidth: '100%', height: imageHeight }}>
      <Link to={`./${imageSet.id}`} style={{ display: 'block', flex: '0 0 40ch', textDecoration: 'none  ' }}>
        <Box>
          <Heading as='h2'>{imageSet.title}</Heading>
          <Heading as='h3'>{imageSet.author}</Heading>
          <br />
          <Paragraph sx={{ fontFamily: 'heading' }}>{imageSet.summary}</Paragraph>
        </Box>
      </Link>
      <Spacer />
      <Flex sx={{ overflowY: 'clip', overflowX: 'auto', gap: '1em', flex: '1 auto' }}>
        {Object.values(imageSet.media).map(({ url }) =>
          <Link key={url} to={`./${imageSet.id}`} style={{ flex: 'none' }}>
            <Image
              src={url}
              sx={{
                objectFit: 'cover',
                width: imageWidth,
                height: imageHeight,
                backgroundColor: 'lightgray'
              }}
            />
          </Link>
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
