import {
  Card,
  Stack,
  Group,
  Image,
  Text,
  Title,
  Badge,
  Divider,
  List,
  ThemeIcon,
} from "@mantine/core";
import { IconBook, IconBulb, IconTarget, IconCircleCheck } from "@tabler/icons-react";
import type { MentalModelModel } from "~/features/mental-models/api/model";

export function MentalModelDetail({
  mentalModel,
}: Record<"mentalModel", MentalModelModel.response>) {
  const { book } = mentalModel;

  const getAnswerList = (answers: string[]) => {
    return answers.filter((a) => a.trim() !== "");
  };

  const whyReadAnswers = getAnswerList([
    mentalModel.whyReadAnswer1,
    mentalModel.whyReadAnswer2,
    mentalModel.whyReadAnswer3,
  ]);

  const whatToGainAnswers = getAnswerList([
    mentalModel.whatToGainAnswer1,
    mentalModel.whatToGainAnswer2,
    mentalModel.whatToGainAnswer3,
  ]);

  const goalAfterReadingAnswers = getAnswerList([
    mentalModel.goalAfterReadingAnswer1,
    mentalModel.goalAfterReadingAnswer2,
    mentalModel.goalAfterReadingAnswer3,
  ]);

  return (
    <Stack gap="md">
      {/* Book Info */}
      <Card withBorder p="md">
        <Group gap="md" wrap="nowrap" align="flex-start">
          <Image
            src={book.thumbnailUrl}
            alt={book.title}
            w={80}
            h={120}
            fit="cover"
            radius="sm"
            fallbackSrc="https://placehold.co/80x120?text=No+Image"
          />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Group justify="space-between" align="flex-start">
              <Title order={4} lineClamp={2}>
                {book.title}
              </Title>
              <Badge color={mentalModel.status === "completed" ? "green" : "blue"} variant="light">
                {mentalModel.status === "completed" ? "完了" : "読書中"}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              {book.authors ?? "著者不明"}
            </Text>
            {book.description && (
              <Text size="xs" c="dimmed" lineClamp={3}>
                {book.description}
              </Text>
            )}
          </Stack>
        </Group>
      </Card>

      <Divider />

      {/* Q1: Why read this book? */}
      <Card withBorder p="md">
        <Group gap="xs" mb="sm">
          <ThemeIcon color="blue" variant="light" size="md">
            <IconBook size={16} />
          </ThemeIcon>
          <Title order={5}>なぜこの本を読もうと思ったか？</Title>
        </Group>
        {whyReadAnswers.length > 0 ? (
          <List
            spacing="xs"
            size="sm"
            icon={
              <ThemeIcon color="blue" size={20} radius="xl" variant="light">
                <IconCircleCheck size={12} />
              </ThemeIcon>
            }
          >
            {whyReadAnswers.map((answer, index) => (
              <List.Item key={index}>{answer}</List.Item>
            ))}
          </List>
        ) : (
          <Text size="sm" c="dimmed" fs="italic">
            回答なし
          </Text>
        )}
      </Card>

      {/* Q2: What to gain from this book? */}
      <Card withBorder p="md">
        <Group gap="xs" mb="sm">
          <ThemeIcon color="yellow" variant="light" size="md">
            <IconBulb size={16} />
          </ThemeIcon>
          <Title order={5}>この本から何が得られそうか？</Title>
        </Group>
        {whatToGainAnswers.length > 0 ? (
          <List
            spacing="xs"
            size="sm"
            icon={
              <ThemeIcon color="yellow" size={20} radius="xl" variant="light">
                <IconCircleCheck size={12} />
              </ThemeIcon>
            }
          >
            {whatToGainAnswers.map((answer, index) => (
              <List.Item key={index}>{answer}</List.Item>
            ))}
          </List>
        ) : (
          <Text size="sm" c="dimmed" fs="italic">
            回答なし
          </Text>
        )}
      </Card>

      {/* Q3: Goal after reading */}
      <Card withBorder p="md">
        <Group gap="xs" mb="sm">
          <ThemeIcon color="green" variant="light" size="md">
            <IconTarget size={16} />
          </ThemeIcon>
          <Title order={5}>この本を読んだ後どうなっていたいか？</Title>
        </Group>
        {goalAfterReadingAnswers.length > 0 ? (
          <List
            spacing="xs"
            size="sm"
            icon={
              <ThemeIcon color="green" size={20} radius="xl" variant="light">
                <IconCircleCheck size={12} />
              </ThemeIcon>
            }
          >
            {goalAfterReadingAnswers.map((answer, index) => (
              <List.Item key={index}>{answer}</List.Item>
            ))}
          </List>
        ) : (
          <Text size="sm" c="dimmed" fs="italic">
            回答なし
          </Text>
        )}
      </Card>

      {/* Metadata */}
      <Text size="xs" c="dimmed" ta="right">
        作成日: {new Date(mentalModel.createdAt).toLocaleDateString("ja-JP")}
        {mentalModel.createdAt !== mentalModel.updatedAt && (
          <> | 更新日: {new Date(mentalModel.updatedAt).toLocaleDateString("ja-JP")}</>
        )}
      </Text>
    </Stack>
  );
}
