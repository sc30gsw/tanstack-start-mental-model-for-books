import { Stack, Card, Skeleton, Group } from "@mantine/core";

function MentalModelCardSkeleton() {
  return (
    <Card withBorder p="md" shadow="sm">
      <Stack gap="md">
        <Group gap="md" align="flex-start">
          <Skeleton w={80} h={120} radius="xs" />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={4}>
                <Skeleton height={24} width={200} />
                <Skeleton height={16} width={150} />
              </Stack>
              <Skeleton height={24} width={60} radius="xl" />
            </Group>
            <Skeleton height={16} width="100%" />
            <Skeleton height={16} width="80%" />
            <Skeleton height={20} width={120} />
          </Stack>
        </Group>
      </Stack>
    </Card>
  );
}

export function MentalModelsListSkeleton() {
  return (
    <Stack gap="md">
      <MentalModelCardSkeleton />
      <MentalModelCardSkeleton />
      <MentalModelCardSkeleton />
    </Stack>
  );
}
