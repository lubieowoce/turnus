import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import { useCallback, useState } from 'react';
import {
  Box,
  Flex,
  ThemeProvider,
} from 'theme-ui';
import { MapView } from './map'
import { theme } from './theme';
import {
  Outlet,
  ReactLocation,
  Route,
  Router,
  useMatch,
  useNavigate,
  useLocation,
  useSearch,
} from '@tanstack/react-location'
import { ReactLocationDevtools } from '@tanstack/react-location-devtools';

import { useEventDetails, useEvents, useImageSet, usePlace, usePlaces } from './api';
import { PlaceDetails } from './place-details';
import { useGoBack } from './utils';
import { CenterSpinner } from './support/center-spinner';
import { ImageSetDetails } from './image-set';
import { DefaultErrorBoundary, ErrorFallback } from './support/error-fallback';
import { fancyTextStyle, HEADER_HEIGHT, PADDING_BODY } from './config';
import { PlaceList } from './place-list';
import { DialogDisclosure, useDialogState } from 'reakit/Dialog';
import { InfoPopup } from './info-popup';
import { Link } from './support/themed-link';
import { MainNav } from './nav';
import { EventList } from './event-list';
import { EventDetails } from './event-details';
import { Landing } from './landing-page';

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
        {/* <ReactQueryDevtools /> */}
        <Router
          location={location}
          routes={routes}
        />
      </ThemeProvider>
    </QueryClientProvider >
  );
}

const linkColors = [
  '#01c4ff',
  '#ff7600',
  '#02ff09',
  '#ffff02'
]

const navLinks = [
  {
    to: '/miejscowosci',
    label: 'miejscowości',
    color: linkColors[0],
    illustration: `${process.env.PUBLIC_URL}/assets/menu/miejscowosci.svg`,
    exact: true,
  },
  {
    to: '/mapa',
    label: 'mapa',
    color: linkColors[1],
    illustration: `${process.env.PUBLIC_URL}/assets/menu/mapa.svg`,
  },
  {
    to: '/wystawy',
    label: 'wystawy',
    color: linkColors[2],
    illustration: `${process.env.PUBLIC_URL}/assets/menu/wystawy.svg`,
  },
]



const MainLayout = () => {
  const infoPopup = useDialogState();
  const location = useLocation();
  const isModalOpen = useSearch().modal === 'info';
  const navigate = useNavigate();
  const closeModal = () => navigate({
    to: location.current.pathname,
    search: ({ modal, ...prev } = {}) => prev,
  })

  const linksRight = [
    <DialogDisclosure
      as={Link}
      to={location.current.pathname}
      search={{ modal: 'info' }}
      noActive
      sx={fancyTextStyle} {...infoPopup}
    >
      info
    </DialogDisclosure>
  ];
  return (
    <>
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}>
        <Flex as='nav' sx={{ flex: `0 0 ${HEADER_HEIGHT}`, backgroundColor: 'background' }}>
          <MainNav links={navLinks} />
          <div style={{ flex: '1 auto' }} />
          {linksRight.map((el, i) =>
            <Box key={el.props.to ?? `${i}`} py='1em' px={PADDING_BODY.horizontal}>{el}</Box>)
          }
        </Flex>
        <main style={{ flex: '1 auto' }}>
          <Outlet />
        </main>
      </div>
      <InfoPopup {...infoPopup} visible={isModalOpen} hide={closeModal} />
      {process.env.NODE_ENV === 'development' && <ReactLocationDevtools />}
    </>
  )
}



const PlacesIndex = () => {
  const places = usePlaces();
  const background = `${process.env.PUBLIC_URL}/assets/dots-sparse.svg`;
  return (
    <Box sx={{ height: '100%', backgroundImage: `url(${background})`, backgroundPosition: 'center' }}>
      {places.isLoading && <CenterSpinner />}
      {places.isSuccess && (
        <PlaceList places={places.data} />
      )}
    </Box>
  )
}



const PlaceDetailsRoute = () => {
  const { params: { placeId } } = useMatch();
  const place = usePlace({ id: placeId });
  return (
    place.isSuccess ? (
      <PlaceDetails place={place.data} />
    ) : (
      <CenterSpinner />
    )
  )
}

const ImageSetDetailsRoute = () => {
  const { params: { placeId, imageSetId } } = useMatch();
  const imageSet = useImageSet({ placeId, imageSetId });
  return (
    imageSet.isSuccess ? (
      <Box py='1em' px={PADDING_BODY.horizontal} sx={{ flexWrap: 'wrap' }}>
        <ImageSetDetails imageSet={imageSet.data} />
      </Box>
    ) : (
      <CenterSpinner />
    )
  )
}

const EventsListRoute = () => {
  const eventList = useEvents();
  return (
    eventList.isSuccess ? (
      <EventList eventList={eventList.data} />
    ) : (
      <CenterSpinner />
    )
  )
}

const EventDetailsRoute = () => {
  const { params: { eventId } } = useMatch();
  const event = useEventDetails({ eventId });
  return (
    event.isSuccess ? (
      <Box py='1em' px={PADDING_BODY.horizontal} sx={{ flexWrap: 'wrap' }}>
        <EventDetails event={event.data} />
      </Box>
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
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
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
        children: [
          {
            path: '/',
            element: <EventsListRoute />,
            errorElement: <ErrorFallback />
          },
          {
            path: ':eventId',
            element: <EventDetailsRoute />,
            errorElement: <ErrorFallback />,
          },
        ],
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




