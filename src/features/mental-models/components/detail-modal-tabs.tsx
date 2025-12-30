import { Group, UnstyledButton, Text } from "@mantine/core";

type DetailModalTabsProps = {
  activeTab: "detail" | "actionPlans";
  onTabChange: (tab: "detail" | "actionPlans") => void;
};

export function DetailModalTabs({ activeTab, onTabChange }: DetailModalTabsProps) {
  return (
    <Group gap={0} wrap="nowrap" style={{ width: "100%" }}>
      <UnstyledButton
        onClick={() => onTabChange("detail")}
        style={{
          padding: "8px 16px",
          cursor: "pointer",
          borderRadius: "8px 0 0 8px",
          backgroundColor: activeTab === "detail" ? "var(--mantine-color-blue-1)" : "transparent",
          transition: "background-color 0.2s",
          flex: 1,
          textAlign: "center",
        }}
      >
        <Text
          size="sm"
          fw={activeTab === "detail" ? 600 : 400}
          c={activeTab === "detail" ? "var(--mantine-color-blue-7)" : undefined}
        >
          メンタルモデル詳細
        </Text>
      </UnstyledButton>

      <UnstyledButton
        onClick={() => onTabChange("actionPlans")}
        style={{
          padding: "8px 16px",
          cursor: "pointer",
          borderRadius: "0 8px 8px 0",
          backgroundColor:
            activeTab === "actionPlans" ? "var(--mantine-color-blue-1)" : "transparent",
          transition: "background-color 0.2s",
          flex: 1,
          textAlign: "center",
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
    </Group>
  );
}
