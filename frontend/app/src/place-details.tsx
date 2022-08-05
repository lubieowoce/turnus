import { memo } from 'react';
import {
  Box,
  Heading,
  Paragraph,
  Close,
  Image,
  Text,
  Flex,
} from 'theme-ui';

import { ImageMediaObject, ImageSet as ImageSetType, PlaceDetails as PlaceDetailsType } from "./api";
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
    <Flex sx={{ flexDirection: 'column', alignItems: 'stretch', height: '100%', paddingBottom: ['2em', 'unset'] }}>
      <Flex py='1em' px={PADDING_BODY.horizontal} mb='1em' sx={{ flex: 'none'}}>
        <Heading as='h2' sx={{ flex: '1 1 auto' }}>
          {place.name}
        </Heading>
        <CloseButton onClick={close} />
      </Flex>
      <Box sx={{ flex: '1 auto'}}>
        {!imageSets.length && (
          <Text sx={{ fontStyle: 'italic' }}>{'Nie ma tu jeszcze żadnych prac.'}</Text>
        )}
        <Flex
          sx={{
            minHeight: '100%',
            gap: ['4em', '2em'],
            flexDirection: ['column', 'row'],
            alignItems: 'stretch',
            overflowX: [undefined, 'auto'],
            overflowY: [undefined, 'hidden'],
            paddingLeft: PADDING_BODY.horizontal,
            paddingRight: PADDING_BODY.horizontal,
          }}>
          {imageSets.map(([id, imageSetSummary]) => {
            const link = `./${imageSetSummary.id}`;
            return (
              <VerticalEntry
                link={link}
                image={Object.values(imageSetSummary.media)[0]}
                description={
                  <Link variant='reset' to={link}>
                    <Box mt='1em'>
                      <Heading as='h2'>{imageSetSummary.title}</Heading>
                      <Heading as='h3'>{imageSetSummary.author}</Heading>
                      <br />
                      <Paragraph sx={{ fontSize: 0, maxHeight: `${4 * 1.5}em`, overflow: 'hidden', textOverflow: 'ellipsis' }}>{imageSetSummary.summary} ⟶</Paragraph>
                    </Box>
                  </Link>
                }
                key={id}
              />
            )
          })}
        </Flex>
      </Box>
    </Flex>
  );
})



const CloseButton = ({ onClick }) => (
  <Close onClick={onClick} sx={{ cursor: 'pointer' }} />
)


const imageWidths = ['100%', `20em`, `25em`];

const VerticalEntry = ({ image, link, description }: { image: ImageMediaObject, link: string, description: React.ReactNode }) => {
  return (
    <Box sx={{ width: imageWidths, flex: 'none' }}>
      <Link variant='reset' key={image.url} to={link}>
        <Image
          src={image.url}
          sx={{
            objectFit: 'cover',
            width: imageWidths,
            // height: imageDims.height,
            backgroundColor: 'lightgray',
            aspectRatio: '4 / 3',
          }}
        />
      </Link>
      {description}
    </Box>
  )
}
