import {
  QueryClient,
  defaultShouldDehydrateQuery,
  environmentManager,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we set staleTime above 0 to avoid refetching immediately on client hydration
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      dehydrate: {
        // Include pending queries in dehydration to support React 19 & Next.js App Router streaming
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        shouldRedactErrors: () => {
          // Do not catch Next.js server errors (redirects, notFound, dynamic page bailouts)
          return false;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (environmentManager.isServer()) {
    // Server: always make a new query client per request to prevent cross-request cache leakage
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is critical so we don't re-make a new client if React suspends during initial render
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}
