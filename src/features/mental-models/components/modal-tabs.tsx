import { Group, UnstyledButton, Text, Tooltip } from "@mantine/core";

type ModalTabsProps = {
  activeTab: "basic" | "actionPlans";
  onTabChange: (tab: "basic" | "actionPlans") => void;
  isEditing: boolean;
  canAccessActionPlans: boolean;
};

export function ModalTabs({
  activeTab,
  onTabChange,
  isEditing,
  canAccessActionPlans,
}: ModalTabsProps) {
  if (!isEditing) {
    return null;
  }

  return (
    <div style={{ position: "relative" }}>
      <Group gap={4} wrap="nowrap">
        <UnstyledButton
          onClick={() => onTabChange("basic")}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            borderRadius: "8px",
            backgroundColor: activeTab === "basic" ? "var(--mantine-color-blue-1)" : "transparent",
            transition: "background-color 0.2s",
          }}
        >
          <Text
            size="sm"
            fw={activeTab === "basic" ? 600 : 400}
            c={activeTab === "basic" ? "var(--mantine-color-blue-7)" : undefined}
          >
            基本情報
          </Text>
        </UnstyledButton>

        <Tooltip
          label={canAccessActionPlans ? "アクションプラン" : "読書完了後に登録できます"}
          disabled={canAccessActionPlans}
        >
          <UnstyledButton
            onClick={() => canAccessActionPlans && onTabChange("actionPlans")}
            disabled={!canAccessActionPlans}
            style={{
              padding: "8px 16px",
              cursor: canAccessActionPlans ? "pointer" : "not-allowed",
              opacity: canAccessActionPlans ? 1 : 0.5,
              borderRadius: "8px",
              backgroundColor:
                activeTab === "actionPlans" ? "var(--mantine-color-blue-1)" : "transparent",
              transition: "background-color 0.2s",
            }}
          >
            <Text
              size="sm"
              fw={activeTab === "actionPlans" ? 600 : 400}
              c={activeTab === "actionPlans" ? "var(--mantine-color-blue-7)" : undefined}
            >
              アクションプラン
            </Text>
          </UnstyledButton>
        </Tooltip>
      </Group>
    </div>
  );
}
