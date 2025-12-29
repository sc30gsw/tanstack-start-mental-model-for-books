/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { getAuth } from "@workos/authkit-tanstack-react-start";
import { AuthKitProvider } from "@workos/authkit-tanstack-react-start/client";
import appCss from "../styles.css?url";
import "@mantine/core/styles.css";

import { AppShell, ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "~/lib/theme";
import { Header } from "~/components/header";

export const Route = createRootRoute({
  loader: async () => {
    const auth = await getAuth();

    return { auth };
  },
  component: RootComponent,
  errorComponent: ErrorComponent,
  head: () => ({
    links: [{ href: appCss, rel: "stylesheet" }],
    meta: [
      { charSet: "utf8" },
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      { title: "TanStack Start Mental Map" },
    ],
  }),
  notFoundComponent: NotFoundComponent,
  pendingComponent: PendingComponent,
});

function RootComponent() {
  const { auth } = Route.useLoaderData();

  return (
    <html lang="ja">
      <head>
        <HeadContent />
        <ColorSchemeScript />
      </head>
      <body>
        <AuthKitProvider
          initialAuth={auth}
          onSessionExpired={() => {
            window.location.href = "/";
          }}
        >
          <MantineProvider theme={theme}>
            <AppShell header={{ height: 60 }}>
              <Header />
              <AppShell.Main>
                <Outlet />
              </AppShell.Main>
            </AppShell>
          </MantineProvider>
        </AuthKitProvider>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundComponent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">404</h1>
      <p>ページが見つかりませんでした。</p>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-red-600">エラー</h1>
      <p>{error.message}</p>
    </div>
  );
}

function PendingComponent() {
  return (
    <div className="p-4">
      <p>読み込み中...</p>
    </div>
  );
}
