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
import { PADDING_BODY } from './config';
import { Link } from './support/themed-link';

export const PlaceDetails = memo(({
  place,
}: {
  place: PlaceDetailsType,
}) => {
  const close = useGoBack();
  const imageSets = Object.entries(place.imageSets);
  return (
    <Box sx={{ marginBottom: '2em' }}>
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
        <Flex sx={{ gap: '2em', flexDirection: 'column', alignItems: 'stretch' }}>
          {imageSets.map(([id, imageSetSummary]) =>
            <ImageSetSummary key={id} imageSet={imageSetSummary} />
          )}
        </Flex>
      </Box>
    </Box>
  );
})

const ImageSetSummary = ({ imageSet }: { imageSet: ImageSetType }) => {
  const imageHeightEm = 20;
  const imageWidthEm = (4/3) * imageHeightEm;
  const imageHeight = `${imageHeightEm}em`;
  const imageWidth = `${imageWidthEm}em`;
  return (
    <Flex sx={{ width: '100%', maxWidth: '100%', height: imageHeight }}>
      <Link variant='reset' to={`./${imageSet.id}`} sx={{ display: 'block', flex: '0 0 40ch' }}>
        <Box>
          <Heading as='h2'>{imageSet.title}</Heading>
          <Heading as='h3'>{imageSet.author}</Heading>
          <br />
          <Paragraph sx={{ fontSize: 0 }}>{imageSet.summary}</Paragraph>
        </Box>
      </Link>
      <Spacer />
      <Flex sx={{ overflowY: 'clip', overflowX: 'auto', gap: '1em', flex: '1 auto' }}>
        {Object.values(imageSet.media).map(({ url }) =>
          <Link variant='reset' key={url} to={`./${imageSet.id}`} sx={{ flex: 'none' }}>
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
