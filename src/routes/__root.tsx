/// <reference types="vite/client" />
import { HeadContent, Link, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { getAuth } from "@workos/authkit-tanstack-react-start";
import { AuthKitProvider, useAuth } from "@workos/authkit-tanstack-react-start/client";
import appCss from "../styles.css?url";
import "@mantine/core/styles.css";

import {
  AppShell,
  Avatar,
  ColorSchemeScript,
  Group,
  Menu,
  MantineProvider,
  Text,
  Title,
} from "@mantine/core";
import { IconBook, IconLogout } from "@tabler/icons-react";
import { theme } from "~/lib/theme";

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

function Header() {
  const { user } = useAuth();

  const getAvatarInitials = () => {
    if (!user) {
      return "U";
    }

    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }

    if (user.lastName) {
      return user.lastName.charAt(0).toUpperCase();
    }

    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }

    return "U";
  };

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group gap="sm">
          <IconBook size={24} />
          <Title order={4}>読書メンタルモデル</Title>
        </Group>

        {user && (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Group gap="xs" style={{ cursor: "pointer" }}>
                <Avatar
                  src={user.profilePictureUrl ?? undefined}
                  alt={user.firstName ?? user.email ?? "User"}
                  radius="xl"
                >
                  {getAvatarInitials()}
                </Avatar>
              </Group>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>
                <Text size="sm" fw={500}>
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : (user.firstName ?? user.email)}
                </Text>
                {user.email && (
                  <Text size="xs" c="dimmed">
                    {user.email}
                  </Text>
                )}
              </Menu.Label>

              <Menu.Divider />

              <Menu.Item component={Link} to="/mental-models" leftSection={<IconBook size={16} />}>
                メンタルモデル
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                component="a"
                href="/logout"
                leftSection={<IconLogout size={16} />}
                color="red"
              >
                ログアウト
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </AppShell.Header>
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
