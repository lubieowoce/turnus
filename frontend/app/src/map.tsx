import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
  useZoomPanContext,
} from "react-simple-maps";
import { memo, RefCallback, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import {
  Box, Container, Spinner,
} from 'theme-ui';
import { css } from '@emotion/react';

import { Place, PlaceId, usePlaces, Geography as GeographyType, useMapGeography, placesQuery, mapGeographyQuery } from "./api";
import { useDebounce, useOnWindowResize } from "rooks";
import { COLORS_ACCENT, HEADER_HEIGHT } from "./config";
import { CenterSpinner } from "./support/center-spinner";
import { sortBy } from "lodash";
import { useSearch } from "@tanstack/react-location";
import { QueryClient } from "react-query";

export const preloadMapView = async (queryClient: QueryClient) => {
  await Promise.all([
    queryClient.prefetchQuery(placesQuery()),
    queryClient.prefetchQuery(mapGeographyQuery()),
  ]);
}

export const MapView = ({ selectedId, setSelectedId }) => {
  const places = usePlaces();
  const geography = useMapGeography();
  useFullscreenBody();

  const [size, containerRef] = useSize();
  
  const { width = null, height = null } = size || {}

  const style = useMemo(() => ({
    height: `calc(100vh - ${HEADER_HEIGHT})`,
    maxHeight: `calc(100vh - ${HEADER_HEIGHT})`,
  }), []);

  return (
    <Box ref={containerRef} style={style} sx={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {(geography.isSuccess && width && height) ? (
        <Map
          width={width}
          height={height}
          places={places.data?.items}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          geography={geography.data}
        />
      ) : (
        <CenterSpinner />
      )}
      {places.isLoading && (
        <>
        <Box sx={{ backgroundColor: 'background', ...absoluteFull, zIndex: 10, opacity: 0.5 }}>
        </Box>
        <Box sx={{ ...absoluteFull, zIndex: 20 }}>
          <CenterSpinner />
        </Box>
        </>
      )}
    </Box>
  );
}

const absoluteFull = { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 } as const

type ElementSize = { width: number, height: number }

const getSize = (element: HTMLElement): ElementSize => {
  const { width, height } = element.getBoundingClientRect();
  return { width, height }
}

const useSize = (): [size: ElementSize | null, ref: RefCallback<HTMLElement>] => {
  const [size, setSize] = useState<ElementSize | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const callbackRef = useCallback((element: HTMLElement) => {
    elementRef.current = element;
    if (element) {
      setSize(getSize(element));
    } else {
      setSize(null);
    }
  }, []);

  const onResize = useDebounce(() => {
    setSize(elementRef.current ? getSize(elementRef.current) : null);
  }, 100);

  useOnWindowResize(onResize);

  return [size, callbackRef]
}

const fullscreenClass = css`
  height: 100vh;
  overflow: hidden;
`

const useFullscreenBody = () => {
  useLayoutEffect(() => {
    document.body.classList.add(fullscreenClass.name)
    return () => {
      document.body.classList.remove(fullscreenClass.name)
    }
  }, []);
}

type Point = [lon: number, lat: number]
const MAP_CENTER: Point = [19.2525, 52.0652]


type MapColors = typeof colorsBlue

const colorsBlue = {
  default: 'black',
  selected: 'black',
  mapFill: 'rgb(194, 231, 254)',
  markerOutline: null as string | null,
  mapOutline: 'rgb(179, 216, 238)',
}


const colorsLight: MapColors = {
  default: 'black',
  selected: 'black',
  mapFill: '#f9f8f6',
  // mapFill: '#f9f9f9',
  markerOutline: 'black',
  mapOutline: 'lightgray',
}

const colorsTransparent: MapColors = {
  ...colorsLight,
  mapFill: 'transparent',
}

const colorVariants = {
  'blue': colorsBlue,
  'light': colorsLight,
  'transparent': colorsTransparent,
}

const fontVariants = {
  'default': 'Arial',
  'experimental': 'Junicode Condensed'
}

const BASE_SIZE_MARKER = 4
const BASE_SIZE_LABEL = 8

enum SizeClass {
  Tiny = 0,
  Small = 1,
  Medium = 2,
  Large = 3,
} 

const BASE_SIZES_MARKER = {
  [SizeClass.Large]: BASE_SIZE_MARKER * 1.3,
  [SizeClass.Medium]: BASE_SIZE_MARKER,
  [SizeClass.Small]: BASE_SIZE_MARKER * 0.6,
  [SizeClass.Tiny]: BASE_SIZE_MARKER * 0.6,
}

const BASE_SIZES_LABEL = {
  [SizeClass.Large]: BASE_SIZE_LABEL * 1.2,
  [SizeClass.Medium]: BASE_SIZE_LABEL,
  [SizeClass.Small]: BASE_SIZE_LABEL * 0.8,
  [SizeClass.Tiny]: BASE_SIZE_LABEL * 0.8,
}

const sizes = {
  marker: (zoomLevel: number, size: SizeClass) => {
    // const base = BASE_SIZES_MARKER[size];
    return (
      zoomLevel < 0.75 ? BASE_SIZES_MARKER[SizeClass.Small] :
      zoomLevel < 1.5 ? BASE_SIZES_MARKER[SizeClass.Medium] :
      BASE_SIZES_MARKER[SizeClass.Large]
      // zoomLevel < 0.75 ? (0.75 * base) :
      // zoomLevel < 1.5 ? (1 * base) :
      // (1.5 * base)
    );
  },
  label: (zoomLevel: number, size: SizeClass) => {
    const base = BASE_SIZES_LABEL[size];
    return (
      zoomLevel < 0.75 ? (0.75 * base) :
      zoomLevel < 1.5 ? (1 * base) :
      (1.5 * base)
    )
  },
}

const getSizeClass = (population: number | null): SizeClass => (
  (population === null || population < 10_000) ? SizeClass.Tiny :
  (population < 50_000) ? SizeClass.Small :
  (population < 150_000) ? SizeClass.Medium :
  SizeClass.Large
)

const visibility = {
  label: (zoomLevel: number, size: SizeClass) => (
    zoomLevel < 0.75 ? (size >= SizeClass.Large) :
    zoomLevel < 1.5 ? (size >= SizeClass.Medium) :
    zoomLevel < 3.0 ? (size >= SizeClass.Small) :
    true
  ),
}

const renderGeography = (colors: MapColors) => ({ geographies }) => geographies.map(geo => (
  <Geography
    key={geo.rsmKey}
    geography={geo}
    style={Object.fromEntries(['default', 'hover', 'active'].map((v) => [v, { fill: `var(${vars.mapFill})`}]))}
    // fill={colors.mapFill}
    stroke={colors.mapOutline}
    strokeWidth="1"
  />
))

const vars = {
  mapFill: '--map-fill-color'
}

export const Map = memo(({
  width,
  height,
  places,
  selectedId,
  setSelectedId,
  geography,
}: {
  width: number,
  height: number,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void,
  places: Record<PlaceId, Place> | undefined,
  geography: GeographyType,
}) => {
  const { mapColors: mapColorsSetting, mapFont: mapFontSetting } = useSearch()
  const currentColors: MapColors = colorVariants[mapColorsSetting as string] ?? colorsLight
  const currentFont: string = fontVariants[mapFontSetting as string] ?? fontVariants['default']
  const render = useMemo(() =>
    renderGeography(currentColors),
    [currentColors]
  )
  return (<>
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 3000
      }}
      width={width}
      height={height}
      style={{ height: '100%', [vars.mapFill]: currentColors.mapFill }}
    >
      <ZoomableGroup minZoom={0.25} maxZoom={10} /* zoom={8} minZoom={8} maxZoom={16} */ center={MAP_CENTER}>
        {useMemo(() => (
          <Geographies geography={geography}>
            {render}
          </Geographies>
        ), [geography, render])}
        <MapItems
          colors={currentColors}
          font={currentFont}
          places={places}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </ZoomableGroup>
    </ComposableMap>
    {/* <div
      id={DEBUG_DIV_ID}
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        height: '1em',
        padding: '0.5em',
        outline: '1px solid black',
        backgroundColor: 'white',
      }}
    /> */}
  </>)
});

const DEBUG_DIV_ID = 'map-debug-div-id';

const rounded = (num: number) => Math.round((num + Number.EPSILON) * 128) / 128

const MapItems = ({
  font,
  colors,
  places,
  selectedId,
  setSelectedId,
}: {
  font: string
  colors: MapColors,
  places: Record<PlaceId, Place> | undefined,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void,
}) => {
  const { k: rawZoomFactor } = useZoomPanContext() as ZoomPanContextValue;
  const zoomFactor = rounded(rawZoomFactor);

  const placeColors = useMemo(() => {
    if (!places) return null;
    const byName = sortBy(Object.values(places), (place) => place.name);
    return Object.fromEntries(byName.map(({ id }, i) => [id, randomAccentColor(i)]))
  }, [places]);

  const sortedPlaces = useMemo(() =>
    places ? sortBy(Object.values(places), (place) => place.population ?? 0) : null,
    [places]
  )
  const markers = useMemo(() => (<>
    { sortedPlaces && sortedPlaces.map(({ id, coordinates: { lat, lon }, population, name }) => {
      const sizeClass = getSizeClass(population);
      return (
        <Marker key={`${id}-marker`} coordinates={[lon, lat]}>
          <g transform={`scale(${1 / zoomFactor})`}>
            <circle
              r={sizes.marker(zoomFactor, sizeClass)}
              fill={id === selectedId ? colors.selected : placeColors![id]}
              stroke={colors.markerOutline ? colors.markerOutline : undefined}
              strokeWidth={colors.markerOutline ? '0.3' : undefined}
            />
          </g>
        </Marker>
      )
    }) }
    { sortedPlaces && sortedPlaces.map(({ id, coordinates: { lat, lon }, population, name }) => {
      const sizeClass = getSizeClass(population);
      const markerSize = sizes.marker(zoomFactor, sizeClass) 
      const fontAdjust = font !== fontVariants['default'] ? 1.5 : 1
      return (
        <Marker key={`${id}-label`} coordinates={[lon, lat]}>
          <g
            onClick={() => setSelectedId(id)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
            transform={`scale(${1 / zoomFactor})`}
          >
            <circle
              r={`${markerSize * 1.5}pt`}
              fill={id === selectedId ? "rgba(0,0,0,0.1)" : "transparent"}
            />
            <text
              y={-markerSize * 1.5}
              style={{
                display: visibility.label(zoomFactor, sizeClass) ? 'unset' : 'none',
                fontSize: `${sizes.label(zoomFactor, sizeClass) * fontAdjust}pt`,
                fontFamily: font,
                userSelect: 'none'
              }} textAnchor="middle" fill="#333"
              stroke="#fff"
              strokeWidth={'2px'}
              paintOrder="stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {name}
            </text>
          </g>
        </Marker>
      )
    }) }
  </>), [sortedPlaces, selectedId, setSelectedId, zoomFactor, colors, placeColors, font]);
  // const debugDiv = document.getElementById(DEBUG_DIV_ID);
  // return useMemo(() =>
  //   <>
  //     {markers}
  //     {debugDiv && ReactDOM.createPortal(
  //       <span style={{ fontFamily: 'monospace' }}>k: {zoomFactor.toFixed(5)}</span>,
  //       debugDiv,
  //     )}
  //   </>, [markers]
  // );
  return markers
}

type ZoomPanContextValue = { x: number, y: number, k: number, transformString: string }

const ACCENT_COLORS_ARRAY = Object.values(COLORS_ACCENT);
export const randomAccentColor = (n: number) => {
  return ACCENT_COLORS_ARRAY[n % ACCENT_COLORS_ARRAY.length]
}
