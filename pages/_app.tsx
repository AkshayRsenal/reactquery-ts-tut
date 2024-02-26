// _app.tsx
import '@styles/globals.css';

import { FC, useState } from 'react';
import { AppProps } from 'next/app';
import { QueryClientProvider, QueryClient, Hydrate } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'

const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20 * 1000,
    }
  }
});

const MyApp: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 20 * 1000
          }
        }
      })
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <QueryClientProvider client={reactQueryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
};

export default MyApp;
