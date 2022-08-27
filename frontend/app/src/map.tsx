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

import { Place, PlaceId, usePlaces, Geography as GeographyType, useMapGeography } from "./api";
import { useDebounce, useOnWindowResize } from "rooks";
import { HEADER_HEIGHT } from "./config";
import { CenterSpinner } from "./support/center-spinner";
import { sortBy } from "lodash";



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
    <Box ref={containerRef} style={style} sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {(geography.isSuccess && width && height) ?
        <Map
          width={width}
          height={height}
          places={places.data?.items}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          geography={geography.data}
        />
        :
        <CenterSpinner />
      }
    </Box>
  );
}

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

const colors = {
  default: 'black',
  selected: 'black',
  mapFill: 'rgb(194, 231, 254)',
  mapOutline: 'rgb(179, 216, 238)',
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

const renderGeography = ({ geographies }) => geographies.map(geo => (
  <Geography
    key={geo.rsmKey}
    geography={geo}
    fill={colors.mapFill}
    stroke={colors.mapOutline}
    strokeWidth="1"
  />
))

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
  return (<>
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 3000
      }}
      width={width}
      height={height}
      style={{ height: '100%' }}
    >
      <ZoomableGroup minZoom={0.25} maxZoom={10} /* zoom={8} minZoom={8} maxZoom={16} */ center={MAP_CENTER}>
        {useMemo(() => (
          <Geographies geography={geography}>
            {renderGeography}
          </Geographies>
        ), [geography])}
        <MapItems
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
  places,
  selectedId,
  setSelectedId,
}: {
  places: Record<PlaceId, Place> | undefined,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void,
}) => {
  const { k: rawZoomFactor } = useZoomPanContext() as ZoomPanContextValue;
  const zoomFactor = rounded(rawZoomFactor);
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
              fill={id === selectedId ? colors.selected : colors.default}
            />
          </g>
        </Marker>
      )
    }) }
    { sortedPlaces && sortedPlaces.map(({ id, coordinates: { lat, lon }, population, name }) => {
      const sizeClass = getSizeClass(population);
      const markerSize = sizes.marker(zoomFactor, sizeClass) 
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
                fontSize: `${sizes.label(zoomFactor, sizeClass)}pt`,
                fontFamily: 'Arial',
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
  </>), [places, selectedId, setSelectedId, zoomFactor]);
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
