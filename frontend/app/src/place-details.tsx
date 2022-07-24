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
        <Flex sx={{ gap: ['4em', '2em'], flexDirection: 'column', alignItems: 'stretch' }}>
          {imageSets.map(([id, imageSetSummary]) =>
            <ImageSetSummary key={id} imageSet={imageSetSummary} />
          )}
        </Flex>
      </Box>
    </Box>
  );
})

const makeImageDims = (heightEm) => {
  return {
    height: `${heightEm}em`,
    width: `${(4/3) * heightEm}em`,
  }
}


const _imageDims = [makeImageDims(10), makeImageDims(15), makeImageDims(20)]
const imageDims = {
  width: _imageDims.map((d) => d.width),
  height: _imageDims.map((d) => d.height),
}

const ImageSetSummary = ({ imageSet }: { imageSet: ImageSetType }) => {
  return (
    <Flex sx={{
      flexDirection: ['column-reverse', null, 'row'],
      width: '100%',
      maxWidth: '100%',
      transition: 'all ease-in-out 0.1s',
      background: 'rgba(0,0,0, 0)',
      outline: '1em solid rgba(0,0,0, 0)',
      '&:hover': {
        backgroundColor: 'rgba(0,0,0, 0.05)',
        outlineColor: 'rgba(0,0,0, 0.05)',
      }
    }}>
      <Link
        variant='reset' to={`./${imageSet.id}`}
        sx={{
          display: 'block',
          flex: [null, null, '0 0 40ch'],
          marginRight: [PADDING_BODY.horizontal, null, 'unset'],
        }}
      >
        <Box>
          <Heading as='h2'>{imageSet.title}</Heading>
          <Heading as='h3'>{imageSet.author}</Heading>
          <br />
          <Paragraph sx={{ fontSize: 0 }}>{imageSet.summary} ⟶</Paragraph>
        </Box>
      </Link>
      <Spacer />
      <Flex sx={{
        overflowY: 'clip',
        overflowX: 'auto',
        gap: '1em',
        flex: '1 auto',
        height: imageDims.height,
      }}>
        {Object.values(imageSet.media).map(({ url }) =>
          <Link variant='reset' key={url} to={`./${imageSet.id}`} sx={{ flex: 'none' }}>
            <Image
              src={url}
              sx={{
                objectFit: 'cover',
                width: imageDims.width,
                height: imageDims.height,
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
