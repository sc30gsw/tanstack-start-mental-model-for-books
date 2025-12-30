import { Suspense, useState } from "react";
import { Card, Stack, Group, Image, Text, Title, Badge, Divider, Skeleton } from "@mantine/core";
import { IconBook, IconBulb, IconTarget } from "@tabler/icons-react";
import type { MentalModelModel } from "~/features/mental-models/api/model";
import { ActionPlansTab } from "~/features/mental-models/components/action-plans-tab";
import { MentalModelQuestionSection } from "~/features/mental-models/components/mental-model-question-section";
import { DetailModalTabs } from "~/features/mental-models/components/detail-modal-tabs";

export function MentalModelDetail({
  mentalModel,
}: Record<"mentalModel", MentalModelModel.response>) {
  const { book } = mentalModel;
  const [activeTab, setActiveTab] = useState<"detail" | "actionPlans">("detail");
  const canAccessActionPlans = mentalModel.status === "completed";

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

      {/* Tabs */}
      {canAccessActionPlans && (
        <>
          <Divider />
          <DetailModalTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}

      <Divider />

      {activeTab === "detail" && (
        <Stack gap="md">
          <MentalModelQuestionSection
            icon={<IconBook size={16} />}
            title="なぜこの本を読もうと思ったか？"
            answers={whyReadAnswers}
            iconColor="blue"
          />
          <MentalModelQuestionSection
            icon={<IconBulb size={16} />}
            title="この本から何が得られそうか？"
            answers={whatToGainAnswers}
            iconColor="yellow"
          />
          <MentalModelQuestionSection
            icon={<IconTarget size={16} />}
            title="この本を読んだ後どうなっていたいか？"
            answers={goalAfterReadingAnswers}
            iconColor="green"
          />
        </Stack>
      )}

      {activeTab === "actionPlans" && canAccessActionPlans && (
        <Suspense
          fallback={
            <Stack gap="md">
              <Skeleton height={28} width={150} />
              <Skeleton height={20} width={300} />
              <Stack gap="sm">
                <Skeleton height={30} />
                <Skeleton height={30} />
                <Skeleton height={30} />
              </Stack>
              <Card withBorder p="sm">
                <Stack gap="xs">
                  <Skeleton height={80} />
                  <Group justify="flex-end">
                    <Skeleton height={36} width={80} />
                  </Group>
                </Stack>
              </Card>
            </Stack>
          }
        >
          <ActionPlansTab mentalModelId={mentalModel.id} />
        </Suspense>
      )}

      <Text size="xs" c="dimmed" ta="right">
        作成日: {new Date(mentalModel.createdAt).toLocaleDateString("ja-JP")}
        {mentalModel.createdAt !== mentalModel.updatedAt && (
          <> | 更新日: {new Date(mentalModel.updatedAt).toLocaleDateString("ja-JP")}</>
        )}
      </Text>
    </Stack>
  );
}
