import { Suspense, useState } from "react";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { valibotValidator } from "@tanstack/valibot-adapter";
import {
  Container,
  Title,
  Stack,
  Text,
  Group,
  Button,
  Paper,
  ScrollArea,
  Table,
  Skeleton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MentalModelTable } from "~/features/mental-models/components/mental-model-table";
import { useMentalModelsQuery } from "~/features/mental-models/hooks/use-mental-models-query";
import {
  mentalModelDefaultSearchParams,
  mentalModelSearchSchema,
} from "~/features/mental-models/types/schemas/search-params/mental-model-search-schema";
import { IconPlus } from "@tabler/icons-react";
import { MentalModelSearchGroup } from "~/features/mental-models/components/mental-model-search-group";
import type { MentalModelModel } from "~/features/mental-models/api/model";
import { mentalModelsCollection } from "~/features/mental-models/mental-models-collections";
import { MentalModelModal } from "~/features/mental-models/components/mental-model-modal";
import type {
  MentalModelFormData,
  MentalModelUpdateData,
} from "~/features/mental-models/types/schemas/mental-model-schema";
import { useAuth } from "@workos/authkit-tanstack-react-start/client";
import { ErrorComponent } from "~/components/error";
import { PendingComponent } from "~/components/pending";

export const Route = createFileRoute("/_authenticated/mental-models/")({
  ssr: false,
  component: MentalModelsPage,
  validateSearch: valibotValidator(mentalModelSearchSchema),
  search: {
    middlewares: [stripSearchParams(mentalModelDefaultSearchParams)],
  },
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
});

function MentalModelsPage() {
  return <MentalModelsPageContentContainer />;
}

function MentalModelsPageContentContainer() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Title order={1}>読書メンタルモデル</Title>
        <Text c="dimmed">読書の前に目的を明確にし、より効果的な学習を実現しましょう。</Text>

        <MentalModelsPageContent />
      </Stack>
    </Container>
  );
}

function MentalModelsPageContent() {
  const { user } = useAuth();

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editingMentalModel, setEditingMentalModel] = useState<MentalModelModel.response | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"basic" | "actionPlans">("basic");

  const handleOpenCreateModal = () => {
    setEditingMentalModel(null);
    setActiveTab("basic");
    openModal();
  };

  const handleOpenEditModal = (mentalModel: MentalModelModel.response) => {
    setEditingMentalModel(mentalModel);
    setActiveTab(mentalModel.status === "completed" ? "actionPlans" : "basic");
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
    setEditingMentalModel(null);
    setActiveTab("basic");
  };

  const handleSubmit = async (
    data:
      | MentalModelFormData
      | { id: MentalModelModel.response["id"]; data: MentalModelUpdateData },
  ) => {
    if ("id" in data && "data" in data) {
      mentalModelsCollection.update(data.id, (draft) => {
        Object.assign(draft, data.data);
      });
    } else if (user) {
      mentalModelsCollection.insert({
        ...data,
        userId: user.id,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        book: {
          id: data.bookId,
          title: "",
          googleBookId: "",
          authors: null,
          thumbnailUrl: null,
          description: null,
        },
        likedByCurrentUser: false,
        likesCount: 0,
      });
    }

    handleCloseModal();
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" wrap="wrap">
        <MentalModelSearchGroup />
        <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreateModal}>
          新規作成
        </Button>
      </Group>
      <Suspense
        fallback={
          <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
            <ScrollArea type="scroll">
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ width: 50 }} />
                    <Table.Th style={{ width: 60 }} />
                    <Table.Th>
                      <Skeleton height={20} width={80} />
                    </Table.Th>
                    <Table.Th>
                      <Skeleton height={20} width={60} />
                    </Table.Th>
                    <Table.Th>
                      <Skeleton height={20} width={100} />
                    </Table.Th>
                    <Table.Th>
                      <Skeleton height={20} width={90} />
                    </Table.Th>
                    <Table.Th>
                      <Skeleton height={20} width={40} />
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>
                        <Skeleton height={24} width={24} circle />
                      </Table.Td>
                      <Table.Td>
                        <Skeleton height={60} width={40} radius="xs" />
                      </Table.Td>
                      <Table.Td>
                        <Skeleton height={16} width={200} />
                      </Table.Td>
                      <Table.Td>
                        <Skeleton height={16} width={120} />
                      </Table.Td>
                      <Table.Td>
                        <Skeleton height={16} width={60} radius="xl" />
                      </Table.Td>
                      <Table.Td>
                        <Skeleton height={16} width={100} />
                      </Table.Td>
                      <Table.Td>
                        <Group gap="lg" wrap="nowrap">
                          <Skeleton height={16} width={24} circle />
                          <Skeleton height={16} width={24} circle />
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Paper>
        }
      >
        <MentalModelTableContainer onOpenEditModal={handleOpenEditModal} />
      </Suspense>
      <MentalModelModal
        opened={modalOpened}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        mentalModel={editingMentalModel}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </Stack>
  );
}

function MentalModelTableContainer({
  onOpenEditModal,
}: Record<"onOpenEditModal", (mentalModel: MentalModelModel.response) => void>) {
  const { mentalModels } = useMentalModelsQuery();

  const mentalModelsArray: MentalModelModel.response[] = Array.from(mentalModels.values());

  //? データの変更を検知するためのkeyを生成（各アイテムのidとupdatedAtの組み合わせ）
  const tableKey = mentalModelsArray.map((m) => `${m.id}-${m.updatedAt}`).join(",");

  return (
    <MentalModelTable
      key={tableKey}
      data={mentalModelsArray}
      onEdit={onOpenEditModal}
      onDelete={(id) => mentalModelsCollection.delete(id)}
    />
  );
}
