import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import {
  ThemeProvider,
} from 'theme-ui';
import { MapView } from './map'
import { theme } from './theme';


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
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
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




