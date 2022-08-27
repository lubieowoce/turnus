import { memo, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Heading,
  Flex,
  Close,
  Image,
  AspectRatio,
  Container,
  ThemeUIStyleObject,
} from 'theme-ui';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock/lib/bodyScrollLock.esm';

import { IMAGE_FALLBACK_COLOR } from './config'
import {
  ImageMediaObject,
  ImageSetDetails as ImageSetDetailsType,
} from "./api";
import useEventCallback from 'use-event-callback';


export const ImageSetDetails = memo(({
  imageSet,
}: {
  imageSet: ImageSetDetailsType,
}) => {
  const images = useMemo(() => Object.values(imageSet.media), [imageSet.media]);
  const [lightbox, setLightbox] = useState({ imageIndex: 0, isOpen: false });

  // the lightbox doesn't expose a wrapper ref or anything,
  // so we need to do it the old way
  const lightboxClass = `lightbox-wrapper-${imageSet.id}`;

  const lockScroll = useEventCallback(() => {
    const el = document.getElementsByClassName(lightboxClass).item(0);
    if (!el) {
      return;
    }
    disableBodyScroll(el);
  });

  const unlockScroll = useEventCallback(() => {
    const el = document.getElementsByClassName(lightboxClass).item(0);
    if (!el) {
      // something weird happened, make sure we're not stuck with a locked scroll
      clearAllBodyScrollLocks()
      return;
    }
    enableBodyScroll(el);
  })

  useEffect(() => {
    // always clear scroll lock
    // (if the lighttbox was exited with a router-level "back",
    //  we'd be stuck with a locked scroll)
    return () => {
      console.log('clearing scroll')
      unlockScroll();
    }
  }, [unlockScroll]);

  return (
    <Box>
      <Heading as='h1' sx={{ flex: '1 1 auto' }}>
        {imageSet.title}
      </Heading>
      <Heading as='h3' sx={{ flex: '1 1 auto' }}>
        {imageSet.author}
      </Heading>
      <Box>
        <Box
          sx={{
            fontFamily: 'body',
            marginBottom: '2em',
            maxWidth: ['100%', 'small'],
          }}
          dangerouslySetInnerHTML={{ __html: imageSet.content }}
        />
        <ImageSetGallery
          images={images}
          onImageClick={(imageIndex) => setLightbox({ isOpen: true, imageIndex })}
          columns={[1, 2, null, 3]}
          sx={{ maxWidth: ['100%', 'small', null, 'large' ]}}
        />
        {lightbox.isOpen && (
          <Lightbox
            wrapperClassName={lightboxClass}
            mainSrc={images[lightbox.imageIndex].url}
            nextSrc={images[plusMod(lightbox.imageIndex, +1, images.length)].url}
            prevSrc={images[plusMod(lightbox.imageIndex, -1, images.length)].url}
            reactModalProps={{ shouldFocusAfterRender: false }}
            onAfterOpen={lockScroll}
            onCloseRequest={() => { setLightbox({ isOpen: false, imageIndex: 0 }); unlockScroll(); }}
            onMoveNextRequest={() => setLightbox((p) => ({ ...p, imageIndex: plusMod(p.imageIndex, +1, images.length)}))}
            onMovePrevRequest={() => setLightbox((p) => ({ ...p, imageIndex: plusMod(p.imageIndex, -1, images.length)}))}
          />
        )}
      </Box>
    </Box>
  );
});

// (+) with wraparound, for positive and negative values
const plusMod = (n: number, delta: number, mod: number) =>
  ((n % mod) + (delta % mod) + mod) % mod

type ImageSetGalleryProps = {
  images: ImageMediaObject[],
  onImageClick?: (index: number) => void,
  columns: (number | null)[],
  sx?: ThemeUIStyleObject,
}

const ImageSetGallery = ({ images, onImageClick, columns, sx }: ImageSetGalleryProps) => {
  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: columns.map((cols) => cols !== null ? `repeat(${cols}, 1fr)` : null),
      gap: '10px 10px',
      paddingBottom: '3em',
      ...sx,
    }}>
      {images.map(({ url }, index) =>
        <AspectRatio ratio={1 / 1} key={url}>
          <Image
            src={url}
            sx={{
              objectFit: 'cover',
              height: '100%',
              width: '100%',
              cursor: onImageClick ? 'pointer' : 'unset',
              backgroundColor: IMAGE_FALLBACK_COLOR,
            }}
            onClick={onImageClick && (() => onImageClick(index))}
          />
        </AspectRatio>
      )}
    </Box>
  )
}

const CloseButton = ({ onClick }) => (
  <Close onClick={onClick} sx={{ cursor: 'pointer' }} />
)
