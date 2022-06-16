import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box, Container, Spinner,
} from 'theme-ui';
import { useTheme } from '@emotion/react';

import { Place, PlaceId, usePlaces, Geography as GeographyType, useMapGeography } from "./api";
import { useDimensions } from "./support/layout-context";



export const MapView = ({ selectedId, setSelectedId }) => {
  const places = usePlaces();
  const geography = useMapGeography();

  const dimensions = useDimensions();
  const { mainWidth: width, mainHeight, headerHeight } = dimensions
  const height = (mainHeight !== null && headerHeight !== null) ? Math.floor(mainHeight - headerHeight) : null;

  const headerHeightRounded = headerHeight !== null ? Math.ceil(headerHeight) : null;
  // The dimension calculations don't come out exactly, so add an extra maxHeight
  // to make sure we don't overflow
  const style = useMemo(() => (
    headerHeightRounded !== null ? {
      maxHeight: `calc(100vh - ${headerHeightRounded}px)`,
    } : {}
  ), [headerHeightRounded]);

  useEffect(() => {
    console.log('dimensions', { width, height }, dimensions)
  }, [width, height, dimensions]);
  return (
    <Box style={style} sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
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
        <Container>
          <Spinner />
        </Container>
      }
    </Box>
  );
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
  const theme: any = useTheme();
  useEffect(() => {
    console.log('Map', { width, height })
  }, [width, height])
  const colors = useMemo(() => ({
    default: 'black',
    selected: 'black',
    mapFill: 'rgb(194, 231, 254)',
    mapOutline: 'rgb(179, 216, 238)',
  }), [theme]);
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
      style={{ height: '100%', backgroundColor: 'rgba(0,0,0,0.025)' }}
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
