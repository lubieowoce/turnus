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
import { EntryWithImages } from './entry-with-images';

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
            <EntryWithImages
              link={`./${imageSetSummary.id}`}
              description={
                <Box>
                  <Heading as='h2'>{imageSetSummary.title}</Heading>
                  <Heading as='h3'>{imageSetSummary.author}</Heading>
                  <br />
                  <Paragraph sx={{ fontSize: 0 }}>{imageSetSummary.summary} ⟶</Paragraph>
                </Box>
              }
              images={Object.values(imageSetSummary.media)}
              key={id}
            />
          )}
        </Flex>
      </Box>
    </Box>
  );
})



const CloseButton = ({ onClick }) => (
  <Close onClick={onClick} sx={{ cursor: 'pointer' }} />
)
