import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { getAuth, getSignInUrl } from "@workos/authkit-tanstack-react-start";
import { Button, Container, Group, Stack, Text, Title, Card, Avatar } from "@mantine/core";
import { IconBook, IconBrain, IconArrowRight } from "@tabler/icons-react";

export const Route = createFileRoute("/")({
  loader: async () => {
    const { user } = await getAuth();

    if (!user) {
      const signInUrl = await getSignInUrl();
      throw redirect({ href: signInUrl });
    }

    return { user };
  },
  component: Home,
});

function Home() {
  const { user } = Route.useLoaderData();

  return (
    <Container size="md" py="xl">
      <Stack gap="xl" align="center">
        <Stack gap="xs" align="center">
          <Group gap="xs">
            <IconBook size={40} color="var(--mantine-color-blue-6)" />
            <IconBrain size={40} color="var(--mantine-color-violet-6)" />
          </Group>
          <Title order={1} ta="center">
            読書メンタルモデル
          </Title>
        </Stack>

        <Text c="dimmed" ta="center" size="lg" maw={500}>
          読書の目的を明確にし、3つの質問に答えることで より効果的な学習を実現するアプリです。
        </Text>

        <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
          <Stack gap="md" align="center">
            <Avatar src={user.profilePictureUrl} alt={user.firstName ?? ""} size="xl" radius="xl" />
            <Text fw={500} size="lg">
              ようこそ、{user.firstName} {user.lastName} さん！
            </Text>
            <Text c="dimmed" size="sm">
              {user.email}
            </Text>
            <Group>
              <Button
                component={Link}
                to="/mental-models"
                rightSection={<IconArrowRight size={16} />}
              >
                メンタルモデルを見る
              </Button>
              <Button component="a" href="/logout" variant="outline" color="red">
                ログアウト
              </Button>
            </Group>
          </Stack>
        </Card>

        <Card shadow="xs" padding="lg" radius="md" withBorder w="100%">
          <Stack gap="md">
            <Title order={3} ta="center">
              3つの質問で読書の効果を最大化
            </Title>
            <Stack gap="sm">
              <Card withBorder p="sm">
                <Group gap="sm">
                  <Text fw={700} c="blue">
                    Q1.
                  </Text>
                  <Text>なぜこの本を読もうと思ったか？</Text>
                </Group>
              </Card>
              <Card withBorder p="sm">
                <Group gap="sm">
                  <Text fw={700} c="yellow">
                    Q2.
                  </Text>
                  <Text>この本から何が得られそうか？</Text>
                </Group>
              </Card>
              <Card withBorder p="sm">
                <Group gap="sm">
                  <Text fw={700} c="green">
                    Q3.
                  </Text>
                  <Text>この本を読んだ後どうなっていたいか？</Text>
                </Group>
              </Card>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
