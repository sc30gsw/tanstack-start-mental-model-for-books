import { Link } from "@tanstack/react-router";
import { Container, Stack, Text, Button, Card, Title, Group } from "@mantine/core";

export function ErrorComponent({ error }: Record<"error", Error>) {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="md" align="center">
        <Card shadow="sm" padding="lg" radius="md" withBorder w="100%" maw={600}>
          <Stack gap="md" align="center">
            <Title order={1} c="red">
              エラーが発生しました
            </Title>
            <Text c="dimmed" ta="center">
              {error.message || "予期しないエラーが発生しました"}
            </Text>
            <Group>
              <Button onClick={handleRetry} variant="filled">
                再読み込み
              </Button>
              <Button component={Link} to="/" variant="outline">
                ホームに戻る
              </Button>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
