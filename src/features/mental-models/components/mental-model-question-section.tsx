import { Card, Group, Title, List, ThemeIcon, Text } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import type { ReactNode } from "react";

type MentalModelQuestionSectionProps = {
  icon: ReactNode;
  title: string;
  answers: string[];
  iconColor: string;
};

export function MentalModelQuestionSection({
  icon,
  title,
  answers,
  iconColor,
}: MentalModelQuestionSectionProps) {
  return (
    <Card withBorder p="md">
      <Group gap="xs" mb="sm">
        <ThemeIcon color={iconColor} variant="light" size="md">
          {icon}
        </ThemeIcon>
        <Title order={5}>{title}</Title>
      </Group>
      {answers.length > 0 ? (
        <List
          spacing="xs"
          size="sm"
          icon={
            <ThemeIcon color={iconColor} size={20} radius="xl" variant="light">
              <IconCircleCheck size={12} />
            </ThemeIcon>
          }
        >
          {answers.map((answer, index) => (
            <List.Item key={index}>{answer}</List.Item>
          ))}
        </List>
      ) : (
        <Text size="sm" c="dimmed" fs="italic">
          回答なし
        </Text>
      )}
    </Card>
  );
}
