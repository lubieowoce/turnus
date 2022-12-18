import React, { memo, useEffect, useMemo, useState } from 'react';
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

import { useResponsiveValue } from '@theme-ui/match-media';

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
import { maxBy, minBy, chunk as toChunks } from 'lodash';
import { Clickable } from 'reakit/Clickable';
import { useOrderedMedia } from './support/media-order';


export const ImageSetDetails = memo(({
  imageSet,
}: {
  imageSet: ImageSetDetailsType,
}) => {
  const images = useOrderedMedia(imageSet.media, imageSet.media_order);
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
  type Updater<T> = T | ((prev: T) => T)

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

  const contents = useMemo(() => (
    <Box
      sx={{
        fontFamily: 'body',
        marginBottom: '2em',
        maxWidth: ['100%', 'small'],
      }}
      dangerouslySetInnerHTML={{ __html: imageSet.content }}
    />
  ), [imageSet.content]);

  const onImageClick = useEventCallback((imageIndex) => setLightbox({ isOpen: true, imageIndex }))

  return (
    <Box>
      <Heading as='h2' sx={{ flex: '1 1 auto' }}>
        {imageSet.title}
      </Heading>
      <Heading as='h3' sx={{ flex: '1 1 auto' }}>
        {imageSet.author}
      </Heading>
      <Box>
        <Layout
          contents={contents}
          images={images}
          onImageClick={onImageClick}
        />
        {/* <Box
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
        /> */}
        {lightbox.isOpen && (
          <Lightbox
            wrapperClassName={lightboxClass}
            mainSrc={images[lightbox.imageIndex].url}
            nextSrc={images[lightbox.imageIndex + 1]?.url}
            prevSrc={images[lightbox.imageIndex - 1]?.url}
            reactModalProps={{ shouldFocusAfterRender: false }}
            onAfterOpen={lockScroll}
            onCloseRequest={() => { setLightbox({ isOpen: false, imageIndex: 0 }) }}
            onMoveNextRequest={() => setLightbox((p) => ({ ...p, imageIndex: plusMod(p.imageIndex, +1, images.length) }))}
            onMovePrevRequest={() => setLightbox((p) => ({ ...p, imageIndex: plusMod(p.imageIndex, -1, images.length) }))}
          />
        )}
      </Box>
    </Box>
  );
});

type GridBoxDef = { top: number, left: number, width: number, height: number }
type GridBox = { top: number, left: number, bottom: number, right: number }

const gridBox = ({ top, left, width, height }: GridBoxDef): GridBox => ({
  top, left, bottom: top + height, right: left + width,
})

const extents = (boxes: GridBox[]): GridBox => {
  if (boxes.length === 0) {
    throw new Error('Empty boxes array passed to extents')
  }
  return {
    top: minBy(boxes, (b) => b.top)!.top,
    left: minBy(boxes, (b) => b.left)!.left,
    bottom: maxBy(boxes, (b) => b.bottom)!.bottom,
    right: maxBy(boxes, (b) => b.right)!.right,
  }
}

type LayoutDef = ReturnType<typeof makeLayout>

const makeLayout = (props: { contents: GridBoxDef, first: GridBoxDef, repeated: GridBoxDef[] }) => {
  return {
    contents: gridBox(props.contents),
    first: gridBox(props.first),
    repeated: props.repeated.map(gridBox),
  }
}

const layout1 = makeLayout({
  contents: { top: 1, left: 1, width: 5, height: 8 },
  first: { top: 1, left: 7, width: 6, height: 8 },
  repeated: [
    { top: 9 - 7, left: 1, width: 6, height: 3 },
    { top: 10 - 7, left: 8, width: 4, height: 5 },
    { top: 14 - 7, left: 2, width: 5, height: 4 },
    { top: 17 - 7, left: 7, width: 5, height: 3 },
    { top: 23 - 7, left: 1, width: 4, height: 4 },
    { top: 21 - 7, left: 6, width: 5, height: 5 },
  ]
});

type LaidOut<T> = { box: GridBox, val: T }

const performLayout = <T,>(contents: T, images: T[], layout: LayoutDef): LaidOut<T>[] => {
  const offsetVert = (box: GridBox, offsetY: number) => ({
    ...box, top: box.top + offsetY, bottom: box.bottom + offsetY
  })
  const res: LaidOut<T>[] = [{ box: layout.contents, val: contents }];
  const [first, ...rest] = images;
  if (first) {
    res.push({ box: layout.first, val: first });
  }
  if (rest.length > 0) {
    const { bottom: repeatedHeight } = extents(layout.repeated);
    // NOTE: we're 1-based, so the beginning of `repeated` is supposed to be 1.
    // so, we need to subtract 1 to have a `1` in `repeated` be where the top ended.  
    let offsetY = extents([res[0].box, res[1].box]).bottom - 1;
    for (const chunk of toChunks(rest, layout.repeated.length)) {
      for (let i = 0; i < chunk.length; i++) {
        const item = chunk[i];
        const box = layout.repeated[i];
        res.push({ val: item, box: offsetVert(box, offsetY) })
      }
      offsetY += repeatedHeight;
    }
  }
  return res;
}

type LayoutProps = {
  contents: React.ReactNode,
  images: ImageMediaObject[],
  onImageClick?: (index: number) => void,
}

const Layout = (props: LayoutProps) => {
  const shouldBeMessy = useResponsiveValue([false, false, true], { defaultIndex: 0 });
  return shouldBeMessy ? <MessyLayout {...props} /> : <PlainLayout {...props} />
}

const PlainLayout = ({ contents, images, onImageClick }: LayoutProps) => {
  const shouldCrop = useResponsiveValue([false, true], { defaultIndex: 0 });
  return (
    <>
      {contents}
      <ImageGrid
        images={images}
        onImageClick={onImageClick}
        columns={[1, 2]}
        squareCrop={shouldCrop}
      />
    </>
  )
}

const MessyLayout = memo(({ contents, images, onImageClick }: LayoutProps) => {
  const laidOut = useMemo(() => {
    const imageElements = images.map(({ sizes: { thumbnail: url } }, index) =>
      <Clickable
        as={Image}
        src={url}
        sx={{
          objectFit: 'contain',
          height: '100%',
          // height: 'auto',
          width: '100%',
          // maxHeight: '500px',
          maxWidth: '500px',
          cursor: onImageClick ? 'pointer' : 'unset',
          // backgroundColor: IMAGE_FALLBACK_COLOR,
        }}
        onClick={onImageClick && (() => onImageClick(index))}
      />
    );
    return performLayout(contents, imageElements, layout1);
  }, [contents, images, onImageClick]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '1em',
        maxWidth: '1200px',
        gridTemplateRows: `repeat(auto-fill, ${800 / 12}px)`,
      }}
    >
      {laidOut.map(({ box, val }, i) =>
        <Box
          key={i}
          sx={{
            gridColumn: `${box.left} / ${box.right}`,
            gridRow: `${box.top} / ${box.bottom}`,
            /* outline: '1px solid lightgray' */
          }}
        >
          {val}
        </Box>
      )}
    </Box>
  )
})







// (+) with wraparound, for positive and negative values
const plusMod = (n: number, delta: number, mod: number) =>
  ((n % mod) + (delta % mod) + mod) % mod

type ImageGridProps = {
  images: ImageMediaObject[],
  onImageClick?: (index: number) => void,
  columns: (number | null)[],
  squareCrop?: boolean,
  sx?: ThemeUIStyleObject,
}

const ImageGrid = ({ images, onImageClick, columns, sx, squareCrop = true }: ImageGridProps) => {
  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: columns.map((cols) => cols !== null ? `repeat(${cols}, 1fr)` : null),
      gap: '10px 10px',
      paddingBottom: '3em',
      ...sx,
    }}>
      {images.map(({ sizes: { thumbnail: url } }, index) => {
        const imageEl = (
          <Clickable
            as={Image}
            key={url}
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
        )
        return (
          squareCrop ? (
            <AspectRatio ratio={1 / 1} key={url}>
              {imageEl}
            </AspectRatio>
          ) : imageEl
        )
      })}
    </Box>
  )
}

const CloseButton = ({ onClick }) => (
  <Close onClick={onClick} sx={{ cursor: 'pointer' }} />
)
