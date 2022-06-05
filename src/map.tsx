import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  Box, Container, Spinner,
} from 'theme-ui';
import { useTheme } from '@emotion/react';

import { Place, PlaceId, usePlaces, Geography as GeographyType, useMapGeography } from "./api";
import { useBoundingclientrect as useBoundingClientRect } from 'rooks';



export const MapView = ({ selectedId, setSelectedId }) => {
  const places = usePlaces();
  const geography = useMapGeography();
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = useBoundingClientRect(containerRef);

  return (
    <Box ref={containerRef} sx={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Box sx={{ position: 'absolute', zIndex: 10, height: '100%', overflow: 'hidden' }}>
        {geography.isSuccess ?
          <Map
            width={containerRect?.width ?? 1280}
            height={containerRect?.height ?? 768}
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
    </Box>
  );
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
        <Geographies geography={geography}>
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
          places && Object.values(places).map(
            ({ id, coordinates: { lat, lon }, name }, index) => <Marker key={id} coordinates={[lon, lat]}>
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
                {name}
              </text>
            </Marker>
          )
        ), [places, selectedId, setSelectedId, colors])}
      </ZoomableGroup>
    </ComposableMap>
  )
});
