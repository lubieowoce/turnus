import { keyBy } from 'lodash'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  Box,
  Heading,
  merge,
  Paragraph,
  Theme,
  ThemeProvider,
  Text,
  Divider,
  Flex,
  IconButton,
} from 'theme-ui';
import { useResponsiveValue } from '@theme-ui/match-media';
import baseTheme from 'theme-ui-preset-geist';
import { useBoundingclientrect as useBoundingClientRect } from 'rooks';
import { useTheme } from '@emotion/react';

const theme: Theme = merge(baseTheme as Theme, {
  styles: {
    root: {
      height: '100%',
    }
  }
})

const Root = () => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme as Theme}>
        <App />
      </ThemeProvider>
    </QueryClientProvider >
  );
}

export default Root;


const App = () => {
  return (
    <div className="App">
      <MapView />
    </div>
  );
}

type PointFeature = {
  "properties": {
    "country": string,
    "city": string,
    "tld": string,
    "iso3": string,
    "iso2": string,
  },
  "geometry": {
    "coordinates": [lon: number, lat: number],
    "type": "Point"
  },
  "id": string,
}
type FeatureCollection = {
  "type": "FeatureCollection",
  "features": PointFeature[]
}

const MapView = () => {
  const capitals = useQuery({
    queryFn: async () => {
      const res = await fetch(process.env.PUBLIC_URL + "/data/capitals.json")
      const collection: FeatureCollection = await res.json();
      return keyBy(collection.features, 'id')
    }
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
        <MapThingy
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
        }}
        style={{ display: selectedId ? 'block' : 'none' }}>
        {capitals.data && selectedId &&
          <Details selectedId={selectedId} setSelectedId={setSelectedId} capitals={capitals.data} />
        }
      </Box>
    </Box>
  );
}

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
        <Heading sx={{ flex: '1 1 auto' }}>{feature.properties.city}</Heading>
        <CloseButton onClick={deselect} />
      </Flex>
      <Paragraph>{feature.properties.country}</Paragraph>
      <Divider />
      <FakeImage seed={number} text={selectedId} />
      <Paragraph mt={"0.5em"}>Lorem ipsum, dolor sit amet</Paragraph>
    </>
  );
})

const CloseButton = ({ onClick }) => (
  <IconButton onClick={onClick} sx={{ cursor: 'pointer' }}>
    <text style={{ fontSize: '1.5em', verticalAlign: 'center' }}>&times;</text>
  </IconButton>
)

const FakeImage = ({ seed, text }) => {
  const colors = [
    'success',
    'warning',
    'cyan',
    'violetLight',
    'magenta',
  ]
  const color = colors[seed % colors.length]
  return (
    <Box bg={color} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Text sx={{ color: 'rgba(255,255,255, 0.3)', fontSize: '5em' }}>{text}</Text>
    </Box>
  )

}

const MapThingy = memo(({
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
  const colors = {
    default: theme.colors.cyanDark,
    selected: theme.colors.cyanLight
  }
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
                  style={{ fontSize: '1pt' }}
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
        ), [capitals, selectedId, setSelectedId])}
      </ZoomableGroup>
    </ComposableMap>
  )
});

