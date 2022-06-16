import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Spinner,
  ThemeProvider,
} from 'theme-ui';
import { MapView } from './map'
import { theme } from './theme';
import {
  Link,
  Outlet,
  ReactLocation,
  Route,
  Router,
  useMatch,
  useNavigate,
} from '@tanstack/react-location'
import { useImageSet, usePlace, usePlaces } from './api';
import { PlaceDetails } from './place-details';
import { useGoBack } from './utils';
import { LayoutContextProvider, useLayoutCalculator } from './support/layout-context';
import { CenterSpinner } from './support/center-spinner';
import { ImageSetDetails } from './image-set';
import { DefaultErrorBoundary, ErrorFallback } from './support/error-fallback';


const Root = () => {
  const [queryClient] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          cacheTime: Infinity,
          staleTime: Infinity,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
        }
      }
    })
  );
  const [location] = useState(() => new ReactLocation());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <ReactQueryDevtools />
        <Router
          location={location}
          routes={routes}
        />
        {/* <App /> */}
      </ThemeProvider>
    </QueryClientProvider >
  );
}

const fancyTextStyle = {
  fontFamily: theme?.fonts?.['heading'],
  fontSize: '1.66rem',
}

const MainLayout = () => {
  const linksLeft = [
    <Link style={fancyTextStyle} to={'/miejscowosci'}>Miejscowości</Link>,
    <Link style={fancyTextStyle} to={'/mapa'}>Mapa</Link>,
    <Link style={fancyTextStyle} to={'/wystawy'}>Wystawy</Link>,
  ]
  const linksRight = [
    <Link style={fancyTextStyle} to={'/info'}>Info</Link>
  ];
  const mainRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const dimensions = { mainWidth: null, mainHeight: null, headerHeight: null }
  // const dimensions = useLayoutCalculator({ mainRef, headerRef });
  return (
    <div ref={mainRef} style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <Flex as='nav' ref={headerRef} sx={{ flex: 'none' }}>
        <Flex p='1em' sx={{ gap: '7ch' }}>
          {linksLeft.map((el) => <Box key={el.props.to}>{el}</Box>)}
        </Flex>
        <div style={{ flex: '1 auto' }} />
        {linksRight.map((el) => <Box key={el.props.to} p='1em'>{el}</Box>)}
      </Flex>
      <main style={{ flex: '1 auto' }}>
        <LayoutContextProvider dimensions={dimensions}>
          <Outlet />
        </LayoutContextProvider>
      </main>
    </div>
  )
}

const PlacesIndex = () => {
  const places = usePlaces();
  const background = `${process.env.PUBLIC_URL}/assets/dots-sparse.svg`;
  return (
    <Box sx={{ height: '100%', backgroundImage: `url(${background})`, backgroundPosition: 'center' }}>
      <Flex sx={{ padding: '1em', flexWrap: 'wrap', flexDirection: ['column', 'row'] }}>
        {places.isLoading && <Spinner />}
        {places.isSuccess && (
          Object.values(places.data.items).map((place, index, arr) => {
            const isLast = index === arr.length - 1;
            return (
              <Box key={place.id}>
                <Link style={fancyTextStyle} to={`/miejscowosci/${place.id}`}>
                  {place.name}
                </Link>
                {!isLast && <span style={fancyTextStyle}>{','}&nbsp;</span>}
              </Box>
            )
          })
        )}
      </Flex>
    </Box>
  )
}

const PlaceDetailsRoute = () => {
  const { params: { placeId } } = useMatch();
  const place = usePlace({ id: placeId });
  useEffect(() => { console.log('PlaceDetailsRoute', { placeId })}, [placeId]);
  return (
    place.isSuccess ? (
      <div style={{ padding: '1em', flexWrap: 'wrap' }}>
        <PlaceDetails place={place.data} />
      </div>
    ) : (
      <CenterSpinner />
    )
  )
}

const ImageSetDetailsRoute = () => {
  const { params: { placeId, imageSetId } } = useMatch();
  useEffect(() => { console.log('ImageSetDetailsRoute', { placeId, imageSetId }) }, [placeId, imageSetId]);

  const imageSet = useImageSet({ placeId, imageSetId });
  return (
    imageSet.isSuccess ? (
      <div style={{ padding: '1em', flexWrap: 'wrap' }}>
        <ImageSetDetails imageSet={imageSet.data} />
      </div>
    ) : (
      <CenterSpinner />
    )
  )
}

const MapRoute = () => {
  const { params: { placeId } } = useMatch();
  const navigate = useNavigate();
  const goBack = useGoBack();
  const goToPlace = useCallback((placeId: string | null) => {
    if (placeId !== null) {
      navigate({ to: `/miejscowosci/${placeId}` });
    } else {
      goBack();
    }
  }, [navigate, goBack]);
  return <MapView selectedId={placeId} setSelectedId={goToPlace} />
}

const ErrorWrapper = () => {
  return (
    <DefaultErrorBoundary>
      <Outlet />
    </DefaultErrorBoundary>
  )
}

const routes: Route[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'miejscowosci',
        element: <ErrorWrapper />,
        children: [
          {
            path: '/',
            element: <PlacesIndex />,
          },
          {
            path: ':placeId',
            element: <ErrorWrapper />,
            children: [
              {
                path: '/',
                element: <PlaceDetailsRoute />,
                errorElement: <ErrorFallback />
              },
              {
                path: ':imageSetId',
                element: <ImageSetDetailsRoute />,
                errorElement: <ErrorFallback />,
              },
            ]
          },
        ]
      },
      {
        path: 'mapa',
        element: <MapRoute />
      },
      {
        path: 'wystawy',
        element: <Heading>Wystawy</Heading>
      },
      {
        path: 'info',
        element: <Heading>Info</Heading>
      },
    ],
  }
]



export default Root;



// const App = () => {
//   return (
//     <div className="App">
//       <MapView />
//     </div>
//   );
// }




