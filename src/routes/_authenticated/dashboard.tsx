import { Link, createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@workos/authkit-tanstack-react-start/client";
import { Avatar, Badge, Button, Card, Container, Group, Stack, Text, Title } from "@mantine/core";
import { PendingComponent } from "~/components/pending";
import { ErrorComponent } from "~/components/error";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
});

function DashboardPage() {
  const { user, organizationId, role, signOut } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={1}>ダッシュボード</Title>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group>
            <Avatar src={user.profilePictureUrl} alt={user.firstName ?? ""} size="lg" radius="xl" />
            <Stack gap="xs">
              <Text fw={500} size="lg">
                {user.firstName} {user.lastName}
              </Text>
              <Text c="dimmed" size="sm">
                {user.email}
              </Text>
              {user.emailVerified && (
                <Badge color="green" variant="light" size="sm">
                  メール認証済み
                </Badge>
              )}
            </Stack>
          </Group>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="sm">
            <Title order={3}>アカウント情報</Title>
            <Group>
              <Text c="dimmed">ユーザーID:</Text>
              <Text>{user.id}</Text>
            </Group>
            {organizationId && (
              <Group>
                <Text c="dimmed">組織ID:</Text>
                <Text>{organizationId}</Text>
              </Group>
            )}
            {role && (
              <Group>
                <Text c="dimmed">ロール:</Text>
                <Badge>{role}</Badge>
              </Group>
            )}
          </Stack>
        </Card>

        <Group>
          <Button component={Link} to="/" variant="light">
            ホームに戻る
          </Button>
          <Button color="red" variant="outline" onClick={() => signOut()}>
            ログアウト
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
