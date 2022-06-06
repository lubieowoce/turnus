import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import { useCallback, useEffect, useState } from 'react';
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
import { usePlace, usePlaces } from './api';
import { PlaceDetails } from './place-details';
import { useGoBack } from './utils';


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


const MainLayout = () => {
  const linksLeft = [
    <Link style={fancyTextStyle} to={'/miejscowosci'}>Miejscowości</Link>,
    <Link style={fancyTextStyle} to={'/mapa'}>Mapa</Link>,
    <Link style={fancyTextStyle} to={'/wystawy'}>Wystawy</Link>,
  ]
  const linksRight = [
    <Link style={fancyTextStyle} to={'/info'}>Info</Link>
  ]
  return (
    <div>
      <Flex>
        {linksLeft.map((el) => <Box p='1em'>{el}</Box>)}
        <div style={{ flex: '1 auto' }} />
        {linksRight.map((el) => <Box p='1em'>{el}</Box>)}
      </Flex>
      <Outlet />
    </div>
  )
}

const fancyTextStyle = {
  fontFamily: theme?.fonts?.['heading'],
  fontSize: '1.66rem',
}

const PlacesIndex = () => {
  const places = usePlaces();
  return (
    <Flex style={{ padding: '1em', flexWrap: 'wrap'}}>
      {places.isLoading && <Spinner />}
      {places.isSuccess && (
        Object.values(places.data.items).map((place) =>
          <Link style={fancyTextStyle} key={place.id} to={`/miejscowosci/${place.id}`}>
            <Box p='1em'>{place.name}</Box>
          </Link>
        )
      )}
    </Flex>
  )
}

const PlaceDetailsRoute = () => {
  const { params: { placeId } } = useMatch();
  useEffect(() => console.log('PlaceDetails', placeId), [placeId]);
  // const places = usePlaces();
  const place = usePlace({ id: placeId });
  return (
    <div style={{ padding: '1em', flexWrap: 'wrap' }}>
      {place.data ? (
        <PlaceDetails place={place.data} />
      ) : <Spinner />}
    </div>
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


const routes: Route[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'miejscowosci',
        children: [
          {
            path: '/',
            element: <PlacesIndex />,
          },
          {
            path: ':placeId',
            element: <PlaceDetailsRoute />,
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




