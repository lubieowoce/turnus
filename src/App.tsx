import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import {
  Flex,
  Heading,
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
} from '@tanstack/react-location'


const Root = () => {
  const [queryClient] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          cacheTime: Infinity,
          staleTime: Infinity,
        }
      }
    })
  );
  const [location] = useState(() => new ReactLocation());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
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
    <Link to={'/miejscowosci'}>Miejscowości</Link>,
    <Link to={'/mapa'}>Mapa</Link>,
    <Link to={'/wystawy'}>Wystawy</Link>,
  ]
  const linksRight = [
    <Link to={'/info'}>Info</Link>
  ]
  return (
    <div>
      <Flex>
        {linksLeft.map((el) => <div style={{ padding: '1em'}}>{el}</div>)}
        <div style={{ flex: '1 auto' }} />
        {linksRight.map((el) => <div style={{ padding: '1em'}}>{el}</div>)}
      </Flex>
      <Outlet />
    </div>
  )
}

const routes: Route[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'miejscowosci',
        element: <Heading>Miejscowości</Heading>
      },
      {
        path: 'mapa',
        element:  <Heading>Mapa</Heading>
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


const App = () => {
  return (
    <div className="App">
      <MapView />
    </div>
  );
}




