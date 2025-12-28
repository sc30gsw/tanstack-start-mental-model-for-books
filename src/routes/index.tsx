import { Link, createFileRoute } from "@tanstack/react-router";
import { getAuth, getSignInUrl, getSignUpUrl } from "@workos/authkit-tanstack-react-start";
import { Button, Container, Group, Stack, Text, Title, Card, Avatar } from "@mantine/core";

export const Route = createFileRoute("/")({
  loader: async () => {
    const { user } = await getAuth();
    const signInUrl = await getSignInUrl();
    const signUpUrl = await getSignUpUrl();

    return { user, signInUrl, signUpUrl };
  },
  component: Home,
});

function Home() {
  const { user, signInUrl, signUpUrl } = Route.useLoaderData();

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl" align="center">
        <Title order={1} ta="center">
          TanStack Start + WorkOS AuthKit
        </Title>

        <Text c="dimmed" ta="center" size="lg">
          安全で簡単な認証システム
        </Text>

        {user ? (
          <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
            <Stack gap="md" align="center">
              <Avatar
                src={user.profilePictureUrl}
                alt={user.firstName ?? ""}
                size="xl"
                radius="xl"
              />
              <Text fw={500} size="lg">
                ようこそ、{user.firstName} {user.lastName} さん！
              </Text>
              <Text c="dimmed" size="sm">
                {user.email}
              </Text>
              <Group>
                <Button component={Link} to="/dashboard">
                  ダッシュボードへ
                </Button>
                <Button component="a" href="/logout" variant="outline">
                  ログアウト
                </Button>
              </Group>
            </Stack>
          </Card>
        ) : (
          <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
            <Stack gap="md" align="center">
              <Text ta="center">アカウントにサインインまたは新規登録してください</Text>
              <Group>
                <Button component="a" href={signInUrl}>
                  サインイン
                </Button>
                <Button component="a" href={signUpUrl} variant="outline">
                  新規登録
                </Button>
              </Group>
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  );
}
