import { Suspense } from "react";
import { Card, Stack, Group, Image, Text, Badge, Accordion, Skeleton } from "@mantine/core";
import type { MentalModelModel } from "~/features/mental-models/api/model";
import { useActionPlansQuery } from "~/features/action-plans/hooks/use-action-plans-query";

function ActionPlansContent({ id }: Pick<MentalModelModel.response, "id">) {
  const { actionPlans } = useActionPlansQuery(id);
  const actionPlansArray = Array.from(actionPlans.values());

  if (actionPlansArray.length === 0) {
    return null;
  }

  return (
    <Accordion>
      <Accordion.Item value="action-plans">
        <Accordion.Control>
          <Text size="sm" fw={500}>
            アクションプラン ({actionPlansArray.length})
          </Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap="xs">
            {actionPlansArray.map((actionPlan) => (
              <Card key={actionPlan.id} withBorder p="sm" bg="gray.0">
                <Text size="sm">{actionPlan.content}</Text>
              </Card>
            ))}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export function MentalModelCard({ mentalModel }: Record<"mentalModel", MentalModelModel.response>) {
  const isCompleted = mentalModel.status === "completed";

  return (
    <Card withBorder p="md" shadow="sm">
      <Stack gap="md">
        <Group gap="md" align="flex-start">
          <Image
            src={mentalModel.book.thumbnailUrl ?? undefined}
            alt={mentalModel.book.title}
            w={80}
            h={120}
            fit="cover"
            radius="xs"
            fallbackSrc="https://placehold.co/80x120?text=No+Image"
          />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={4}>
                <Text fw={600} size="lg">
                  {mentalModel.book.title}
                </Text>
                <Text size="sm" c="dimmed">
                  {mentalModel.book.authors ?? "著者不明"}
                </Text>
              </Stack>
              <Badge color={mentalModel.status === "completed" ? "green" : "blue"} variant="light">
                {mentalModel.status === "completed" ? "完了" : "読書中"}
              </Badge>
            </Group>

            <Text size="sm" c="dimmed" lineClamp={2}>
              {mentalModel.book.description ?? "説明なし"}
            </Text>

            {isCompleted && (
              <Suspense
                fallback={
                  <Stack gap="xs">
                    <Skeleton height={20} width={150} />
                    <Skeleton height={60} />
                  </Stack>
                }
              >
                <ActionPlansContent id={mentalModel.id} />
              </Suspense>
            )}
          </Stack>
        </Group>
      </Stack>
    </Card>
  );
}
