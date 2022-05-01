import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { useQuery } from 'react-query';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  Box,
  Heading,
  Paragraph,
  Divider,
  Flex,
  Close,
  Spinner,
  Image,
  AspectRatio,
  Text,
} from 'theme-ui';
import { useTheme } from '@emotion/react';

import {
  LightgalleryProvider as LightGalleryProvider,
  LightgalleryItem as LightGalleryItem,
  useLightgallery as useLightGallery
} from "react-lightgallery";
import "lightgallery.js/dist/css/lightgallery.css";

import { FeatureCollection, getImageCollection, PointFeature } from "./api";
import { keyBy } from "lodash";
import { useBoundingclientrect as useBoundingClientRect } from 'rooks';
import { useResponsiveValue } from "@theme-ui/match-media";



export const MapView = () => {
  const capitals = useQuery({
    queryFn: async () => {
      const res = await fetch(process.env.PUBLIC_URL + "/data/capitals.json")
      const collection: FeatureCollection = await res.json();
      return keyBy(
        collection.features.filter((feature) => feature.properties.city !== undefined),
        'id'
      )
    },
    queryKey: process.env.PUBLIC_URL + "/data/capitals.json",
  })
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = useBoundingClientRect(containerRef);

  const desktop = { left: 0, top: 0, height: '100%', width: '30ch' }
  const mobile = { left: 0, bottom: 0, width: '100%' }
  const detailsLayoutStyle = useResponsiveValue([mobile, desktop])

  return (
    <Box ref={containerRef} sx={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Box sx={{ position: 'absolute', zIndex: 10, height: '100%', overflow: 'hidden' }}>
        <Map
          width={containerRect?.width ?? 1280}
          height={containerRect?.height ?? 768}
          capitals={capitals.data}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </Box>
      <Box
        sx={{
          position: 'absolute', zIndex: 20,
          ...detailsLayoutStyle,
          background: 'background',
          padding: '3',
          border: '1px solid',
          borderColor: 'gray.2',
          overflowY: 'auto', maxHeight: '100%'
        }}
        style={{ display: selectedId ? 'block' : 'none' }}>
        {capitals.data && selectedId &&
          <Details selectedId={selectedId} setSelectedId={setSelectedId} capitals={capitals.data} />
        }
      </Box>
    </Box>
  );
}

export const Map = memo(({
  width,
  height,
  capitals,
  selectedId,
  setSelectedId,
}: {
  width: number,
  height: number,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void,
  capitals: Record<string, PointFeature> | undefined
}) => {
  const theme: any = useTheme();
  const colors = useMemo(() => ({
    default: theme.colors.cyanDark,
    selected: theme.colors.cyanLight
  }), [theme]);
  return (
    <ComposableMap
      projection="geoMercator"
      width={width}
      height={height}
      style={{ height: '100%' }}
    >
      <ZoomableGroup zoom={1}>
        <Geographies geography={process.env.PUBLIC_URL + "/data/world-110m.json"}>
          {useCallback(({ geographies }) => geographies.map(geo => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#EAEAEC"
              stroke="#D6D6DA"
              strokeWidth="0.5" />
          )), [])}
        </Geographies>
        {useMemo(() => (
          capitals && Object.values(capitals).map(
            ({ id, properties, geometry: { coordinates } }, index) => <Marker key={id} coordinates={coordinates}>
              <g
                onClick={() => setSelectedId(id)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <circle
                  r={2}
                  fill={id === selectedId ? colors.selected : colors.default}
                  stroke="#fff"
                  strokeWidth={0.25}
                />
                <text
                  style={{ fontSize: '1pt', fontWeight: id === selectedId ? 'bold' : 'normal' }}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#333"
                >
                  {index + 1}
                </text>
              </g>
              <text y={-2.5} style={{ fontSize: '1pt', userSelect: 'none' }} textAnchor="middle" fill="#333">
                {properties.city}
              </text>
            </Marker>
          )
        ), [capitals, selectedId, setSelectedId, colors])}
      </ZoomableGroup>
    </ComposableMap>
  )
});

const Details = memo(({
  selectedId,
  setSelectedId,
  capitals
}: {
  selectedId: string,
  setSelectedId: (id: string | null) => void,
  capitals: Record<string, PointFeature>
}) => {
  const feature = capitals[selectedId];
  const number = useMemo(() => Object.keys(capitals).indexOf(selectedId), [capitals, selectedId]);
  const deselect = useCallback(() => setSelectedId(null), [setSelectedId]);
  return (
    <>
      <Flex>
        <Heading sx={{ flex: '1 1 auto' }}>
          <Text sx={{ fontWeight: 'light' }}>{number}.</Text> {feature.properties.city}</Heading>
        <CloseButton onClick={deselect} />
      </Flex>
      <Box>
        <Paragraph>{feature.properties.country}</Paragraph>
        <Divider />
        <LightGalleryProvider>
          <ImageCollection id={selectedId} />
        </LightGalleryProvider>
      </Box>
    </>
  );
})

const ImageCollection = ({ id }) => {
  const GALLERY_GROUP = `gallery-group-${id}`;
  const { data: collection } = useQuery({
    queryFn: () => getImageCollection({ id }),
    queryKey: `collections/${id}`,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const { openGallery } = useLightGallery();
  if (!collection) {
    return (
      <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </Box>
    )
  }
  return (
    <Box>
      <Paragraph mb="1em">{collection.description}</Paragraph>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px 10px',
        pb: '3',
      }}>
        {collection.items.map(({ imageUrl }, index) =>
          <LightGalleryItem src={imageUrl} key={`${imageUrl}-${index}`}>
            <AspectRatio ratio={1 / 1}>
              <Image
                src={imageUrl}
                sx={{ objectFit: 'cover', height: '100%', width: '100%', cursor: 'pointer' }}
                onClick={() => openGallery(GALLERY_GROUP, index)}
              />
            </AspectRatio>
          </LightGalleryItem>
        )}
      </Box>
    </Box>
  )
}

const CloseButton = ({ onClick }) => (
  <Close onClick={onClick} sx={{ cursor: 'pointer' }} />
)
