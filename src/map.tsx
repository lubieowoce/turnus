import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  Box,
} from 'theme-ui';
import { useTheme } from '@emotion/react';

import { PointFeature, usePlaces } from "./api";
import { useBoundingclientrect as useBoundingClientRect } from 'rooks';



export const MapView = ({ selectedId, setSelectedId }) => {
  const places = usePlaces();
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = useBoundingClientRect(containerRef);

  return (
    <Box ref={containerRef} sx={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Box sx={{ position: 'absolute', zIndex: 10, height: '100%', overflow: 'hidden' }}>
        <Map
          width={containerRect?.width ?? 1280}
          height={containerRect?.height ?? 768}
          places={places.data}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
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
}: {
  width: number,
  height: number,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void,
  places: Record<string, PointFeature> | undefined
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
          places && Object.values(places).map(
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
        ), [places, selectedId, setSelectedId, colors])}
      </ZoomableGroup>
    </ComposableMap>
  )
});
