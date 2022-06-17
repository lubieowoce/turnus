import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
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



export const MapView = ({ selectedId, setSelectedId }) => {
  const places = usePlaces();
  const geography = useMapGeography();
  useFullscreenBody();

  const [size, containerRef] = useSize();
  
  const { width = null, height = null } = size || {}

  const style = useMemo(() => ({
    maxHeight: `calc(100vh - ${HEADER_HEIGHT})`,
  }), []);

  useEffect(() => {
    console.log('dimensions', { width, height });
  }, [width, height]);
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
  useEffect(() => {
    console.log('Map', { width, height })
  }, [width, height])
  const colors = useMemo(() => ({
    default: 'black',
    selected: 'black',
    mapFill: 'rgb(194, 231, 254)',
    mapOutline: 'rgb(179, 216, 238)',
  }), []);
  const sizes = {
    marker: '8'
  }
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 3000
      }}
      width={width}
      height={height}
      style={{ height: '100%' }}
    >
      <ZoomableGroup /* zoom={8} minZoom={8} maxZoom={16} */ center={MAP_CENTER}>
        <Geographies geography={geography}>
          {useCallback(({ geographies }) => geographies.map(geo => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={colors.mapFill}
              stroke={colors.mapOutline}
              strokeWidth="1"
            />
          )), [])}
        </Geographies>
        {useMemo(() => (
          places && Object.values(places).map(
            ({ id, coordinates: { lat, lon }, name }, index) => <Marker key={id} coordinates={[lon, lat]}>
              <g
                onClick={() => setSelectedId(id)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <circle
                  r={sizes.marker}
                  fill={id === selectedId ? colors.selected : colors.default}
                  stroke="#fff"
                  strokeWidth={0.25}
                />
                {/* <text
                  style={{ fontSize: '12pt', fontFamily: 'Arial', fontWeight: id === selectedId ? 'bold' : 'normal' }}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#333"
                >
                  {index + 1}
                </text> */}
              </g>
              <text y={-12} style={{ fontSize: '12pt', fontFamily: 'serif', userSelect: 'none' }} textAnchor="middle" fill="#333">
                {name}
              </text>
            </Marker>
          )
        ), [places, selectedId, setSelectedId, colors])}
      </ZoomableGroup>
    </ComposableMap>
  )
});
