import { useState } from "react";
import { Stack, Title, Text, Card, Textarea, Group, Button, ActionIcon } from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import type { ActionPlanModel } from "~/features/action-plans/api/model";
import { useActionPlansQuery } from "~/features/action-plans/hooks/use-action-plans-query";

export function ActionPlansTab({ mentalModelId }: Pick<ActionPlanModel.response, "mentalModelId">) {
  const [editingActionPlanId, setEditingActionPlanId] = useState<
    ActionPlanModel.response["id"] | null
  >(null);
  const [newActionPlanContent, setNewActionPlanContent] = useState("");

  const { actionPlans, collection } = useActionPlansQuery(mentalModelId);
  const actionPlansArray = Array.from(actionPlans.values());

  const handleCreateActionPlan = () => {
    if (!newActionPlanContent.trim()) {
      return;
    }

    collection.insert({
      mentalModelId,
      content: newActionPlanContent,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setNewActionPlanContent("");
  };

  const handleUpdateActionPlan = (
    id: ActionPlanModel.response["id"],
    content: ActionPlanModel.response["content"],
  ) => {
    if (!content.trim()) return;

    collection.update(id, (draft) => {
      draft.content = content;
    });
    setEditingActionPlanId(null);
  };

  const handleDeleteActionPlan = (id: ActionPlanModel.response["id"]) => {
    collection.delete(id);
  };

  return (
    <Stack gap="md">
      <Title order={5}>アクションプラン</Title>
      <Text size="sm" c="dimmed">
        読書完了後の具体的なアクションプランを登録してください。
      </Text>

      <Stack gap="sm">
        {actionPlansArray.map((actionPlan) => (
          <Card key={actionPlan.id} withBorder p="sm">
            {editingActionPlanId === actionPlan.id ? (
              <Stack gap="xs">
                <Textarea
                  defaultValue={actionPlan.content}
                  onBlur={(e) => {
                    if (e.target.value.trim()) {
                      handleUpdateActionPlan(actionPlan.id, e.target.value);
                    } else {
                      setEditingActionPlanId(null);
                    }
                  }}
                />
              </Stack>
            ) : (
              <Group justify="space-between" align="flex-start">
                <Text size="sm" style={{ flex: 1 }}>
                  {actionPlan.content}
                </Text>
                <Group gap="xs">
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    size="sm"
                    onClick={() => setEditingActionPlanId(actionPlan.id)}
                  >
                    <IconEdit size={14} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    onClick={() => handleDeleteActionPlan(actionPlan.id)}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </Group>
              </Group>
            )}
          </Card>
        ))}
      </Stack>

      <Card withBorder p="sm">
        <Stack gap="xs">
          <Textarea
            placeholder="新しいアクションプランを入力..."
            value={newActionPlanContent}
            onChange={(e) => setNewActionPlanContent(e.target.value)}
            rows={3}
          />
          <Group justify="flex-end">
            <Button
              size="sm"
              leftSection={<IconPlus size={16} />}
              onClick={handleCreateActionPlan}
              disabled={!newActionPlanContent.trim()}
            >
              追加
            </Button>
          </Group>
        </Stack>
      </Card>
    </Stack>
  );
}
