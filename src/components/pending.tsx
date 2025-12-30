import { Container, Stack, Loader, Text, Center } from "@mantine/core";

export function PendingComponent() {
  return (
    <Container size="xl" py="xl">
      <Center h={400}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">読み込み中...</Text>
        </Stack>
      </Center>
    </Container>
  );
}
