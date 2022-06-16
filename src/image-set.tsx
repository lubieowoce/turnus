import { memo } from 'react';
import {
  Box,
  Heading,
  Flex,
  Close,
  Image,
  AspectRatio,
  Container,
} from 'theme-ui';

import {
  ImageSetDetails as ImageSetDetailsType,
} from "./api";

export const ImageSetDetails = memo(({
  imageSet,
}: {
  imageSet: ImageSetDetailsType,
}) => {
  return (
    <Container>
      <Heading as='h1' sx={{ flex: '1 1 auto' }}>
        {imageSet.title}
      </Heading>
      <Heading as='h3' sx={{ flex: '1 1 auto' }}>
        {imageSet.author}
      </Heading>
      <Box>
        <Box
          sx={{ fontFamily: 'body' }}
          dangerouslySetInnerHTML={{ __html: imageSet.content }}
        />
        <ImageSetGallery imageSet={imageSet} />
      </Box>
    </Container>
  );
})

const ImageSetGallery = ({ imageSet }: { imageSet: ImageSetDetailsType }) => {
  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px 10px',
      pb: '3',
    }}>
      {Object.values(imageSet.media).map(({ url }) =>
        <AspectRatio ratio={1 / 1} key={url}>
          <Image
            src={url}
            sx={{ objectFit: 'cover', height: '100%', width: '100%' }}
          />
        </AspectRatio>
      )}
    </Box>
  )
}

const CloseButton = ({ onClick }) => (
  <Close onClick={onClick} sx={{ cursor: 'pointer' }} />
)
