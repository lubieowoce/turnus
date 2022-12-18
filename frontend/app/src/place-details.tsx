import { memo, useMemo } from 'react';
import {
  Box,
  Heading,
  Paragraph,
  Close,
  Image,
  Text,
  Flex,
  ParagraphProps,
} from 'theme-ui';

import { ImageMediaObject, ImageSet as ImageSetType, PlaceDetails as PlaceDetailsType } from "./api";
import { useGoBack } from './utils';
import { IMAGE_FALLBACK_COLOR, PADDING_BODY } from './config';
import { Link } from './support/themed-link';
import { useApplyTheme } from './support/use-apply-theme';
import { firstByMediaOrder } from './support/media-order';

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
                key={id}
                link={link}
                image={firstByMediaOrder(imageSetSummary.media, imageSetSummary.media_order)}
                description={
                  <Link variant='reset' to={link}>
                    <Box my='1em'>
                      <Heading as='h2'>{imageSetSummary.title}</Heading>
                      <Heading as='h3'>{imageSetSummary.author}</Heading>
                      <br />
                      {/* <Paragraph
                        sx={{
                          fontSize: 0,
                          ...maxLinesStyle(4),
                          textOverflow: "ellipsis",
                        }}
                      >
                        {imageSetSummary.summary}
                      </Paragraph> */}
                      <ParagraphWithReadMore lines={4} backgroundColor={'background'} fontSize={0}>
                        {imageSetSummary.summary}
                      </ParagraphWithReadMore>
                    </Box>
                  </Link>
                }
              />
            )
          })}
        </Flex>
      </Box>
    </Flex>
  );
})

type ParagraphWithReadMoreProps = React.PropsWithChildren<
  {
    lines: number,
    backgroundColor: string,
    fontSize?: number
  } & Omit<ParagraphProps, 'children'>
>

const ParagraphWithReadMore = memo(({ children, lines, backgroundColor, fontSize, ...props }: ParagraphWithReadMoreProps) => {
  const applyTheme = useApplyTheme();
  const resolvedBackgroundColor = applyTheme({ backgroundColor }).backgroundColor!;
  return (
    <Paragraph {...props} sx={{
      position: 'relative',
      ...maxLinesStyle(lines),
      textOverflow: "ellipsis",
      fontSize,
    }}>
      {children}
      <Box sx={{
        position: 'absolute',
        zIndex: '10',
        right: 0,
        bottom: 0,
      }}>
        <Flex>
          <Box sx={{
            // in theory all this could be done with `text-overflow: fade`,
            // but that's not supported almost anywhere yet
            background: `linear-gradient(90deg, transparent 0%, ${resolvedBackgroundColor} 100%)`,
            width: '5ch',
          }} />
          <Box sx={{ paddingLeft: '1ch', paddingRight: '2ch', backgroundColor }}>⟶</Box>
        </Flex>
      </Box>
    </Paragraph>
  )
})

const maxLinesStyle = (nLines: number) => ({
  display: '-webkit-box',
  '-webkit-box-orient': 'vertical',
  '-webkit-line-clamp': `${nLines}`,
  lineClamp: `${nLines}`,
  overflow: 'hidden',
} as const);

const CloseButton = ({ onClick }) => (
  <Close onClick={onClick} sx={{ cursor: 'pointer' }} />
)


const imageWidths = ['100%', `20em`, `25em`];

const dummyImage = () => (
  'data:image/svg+xml;base64,' + btoa(`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="400px"
      height="300px"
      style="background-color: ${IMAGE_FALLBACK_COLOR}"
    >
    </svg>
  `)
)

const VerticalEntry = ({ image, link, description }: { image: ImageMediaObject | null, link: string, description: React.ReactNode }) => {
  const imageSrc = useMemo(() => image ? image.sizes.thumbnail : dummyImage(), [image])
  return (
    <Box sx={{ width: imageWidths, flex: 'none' }}>
      <Link variant='reset' to={link}>
        <Image
          src={imageSrc}
          sx={{
            objectFit: 'cover',
            width: imageWidths,
            // height: imageDims.height,
            backgroundColor: IMAGE_FALLBACK_COLOR,
            aspectRatio: '4 / 3',
          }}
        />
      </Link>
      {description}
    </Box>
  )
}
