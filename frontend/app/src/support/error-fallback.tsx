import { Flex } from "theme-ui";
import { ErrorBoundary } from 'react-error-boundary'
import { PropsWithChildren } from "react";

export const DefaultErrorBoundary = ({ children }: PropsWithChildren<{}>) => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      {children}
    </ErrorBoundary>
  )
}

export const ErrorFallback = ({ minHeight = '10em' }) => (
  <Flex
    sx={{
      width: '100%',
      height: '100%',
      minHeight,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    Something went wrong!
  </Flex>
)