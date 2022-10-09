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
import { useLocation, useSearch, useNavigate } from '@tanstack/react-location';


export const ImageSetDetails = memo(({
  imageSet,
}: {
  imageSet: ImageSetDetailsType,
}) => {
  const images = useMemo(() =>
    Object.entries(imageSet.media).map(([id, m]) => ({ id, ...m })),
    [imageSet.media]
  );
  const indexToImageId = (index: number) => images[index].id
  const imageIdToIndex = (id: string) => images.findIndex((m) => m.id === id)
  
  const searchToState = (search): State => ({
    isOpen: search.modal === 'image',
    imageIndex: (search.image ? imageIdToIndex(search.image as string) : undefined) ?? 0,
  })

  const stateToSearch = (state: State) => (
    (state.isOpen ? { modal: 'image', image: indexToImageId(state.imageIndex) } : {})
  )

  type State = { isOpen: boolean, imageIndex: number }
  type Updater<T> = State | ((prev: State) => State)

  const location = useLocation();
  const search = useSearch();
  const lightbox = searchToState(search)
  const navigate = useNavigate();

  const setLightbox = (updater: Updater<State>) => {
    const newState = typeof updater === 'function' ? updater(lightbox) : updater;
    const shouldPush = !lightbox.isOpen
    if (!newState.isOpen) {
      onClose()
    }
    navigate({
      to: location.current.pathname,
      search: stateToSearch(newState),
      // fromCurrent: !lightbox.isOpen,
      replace: !shouldPush
    });
  }

  const onClose = useEventCallback(() => {
    const el = document.getElementsByClassName(lightboxClass).item(0);
    if (!el) {
      // something weird happened, make sure we're not stuck with a locked scroll
      clearAllBodyScrollLocks()
      return;
    }
    enableBodyScroll(el);
  })

  useEffect(() => {
    // if the view state was changed by the router (i.e. a "back" navigation),
    // onCloseRequest won't fire. so we need to do it ourselves :(
    if (!lightbox.isOpen) {
      onClose();
    }
  }, [lightbox.isOpen, onClose]);

  useEffect(() => {
    // always clear scroll lock when exiting this route, just in case
    // (if the lighttbox was exited with a router-level "back",
    //  we'd be stuck with a locked scroll)
    return () => {
      onClose();
    }
  }, [onClose]);

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

  return (
    <Box>
      <Heading as='h2' sx={{ flex: '1 1 auto' }}>
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
            nextSrc={images[lightbox.imageIndex + 1]?.url}
            prevSrc={images[lightbox.imageIndex - 1]?.url}
            reactModalProps={{ shouldFocusAfterRender: false }}
            onAfterOpen={lockScroll}
            onCloseRequest={() => { setLightbox({ isOpen: false, imageIndex: 0 }) }}
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
      {images.map(({ sizes: { thumbnail: url } }, index) => {
        return (
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
        )
      })}
    </Box>
  )
}

const CloseButton = ({ onClick }) => (
  <Close onClick={onClick} sx={{ cursor: 'pointer' }} />
)
