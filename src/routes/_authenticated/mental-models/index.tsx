import { useState, Suspense } from "react";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { valibotValidator } from "@tanstack/valibot-adapter";
import { Container, Title, Stack, Loader, Center, Text, Group, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "@workos/authkit-tanstack-react-start/client";
import { MentalModelTable } from "~/features/mental-models/components/mental-model-table";
import { MentalModelModal } from "~/features/mental-models/components/mental-model-modal";
import { useMentalModelsQuery } from "~/features/mental-models/hooks/use-mental-models-query";
import {
  mentalModelDefaultSearchParams,
  mentalModelSearchSchema,
} from "~/features/mental-models/types/schemas/search-params/search-schema";
import type {
  MentalModelFormData,
  MentalModelUpdateData,
} from "~/features/mental-models/types/schemas/mental-model-schema";
import { IconPlus } from "@tabler/icons-react";
import { MentalModelSearchGroup } from "~/features/mental-models/components/mental-model-search-group";
import type { MentalModelModel } from "~/features/mental-models/api/model";
import { mentalModelsCollection } from "~/features/mental-models/mental-models-collections";

export const Route = createFileRoute("/_authenticated/mental-models/")({
  ssr: false,
  component: MentalModelsPage,
  validateSearch: valibotValidator(mentalModelSearchSchema),
  search: {
    middlewares: [stripSearchParams(mentalModelDefaultSearchParams)],
  },
});

function MentalModelsPage() {
  return <MentalModelsPageContentContainer />;
}

function LoadingFallback() {
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

function MentalModelsPageContentContainer() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Title order={1}>読書メンタルモデル</Title>
        <Text c="dimmed">読書の前に目的を明確にし、より効果的な学習を実現しましょう。</Text>

        <Suspense fallback={<LoadingFallback />}>
          <MentalModelsPageContent />
        </Suspense>
      </Stack>
    </Container>
  );
}

function MentalModelsPageContent() {
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editingModel, setEditingModel] = useState<MentalModelModel.response | null>(null);

  const handleOpenCreateModal = () => {
    setEditingModel(null);
    openModal();
  };

  const handleOpenEditModal = (mentalModel: MentalModelModel.response) => {
    setEditingModel(mentalModel);
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
    setEditingModel(null);
  };

  return (
    <>
      <Stack gap="md">
        <Group justify="space-between" wrap="wrap">
          <MentalModelSearchGroup />
          <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreateModal}>
            新規作成
          </Button>
        </Group>
        <MentalModelTableContainer onOpenEditModal={handleOpenEditModal} />
      </Stack>
      <MentalModelModalContainer
        opened={modalOpened}
        editingModel={editingModel}
        onClose={handleCloseModal}
      />
    </>
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

type MentalModelModalContainerProps = {
  opened: boolean;
  editingModel: MentalModelModel.response | null;
  onClose: () => void;
};

function MentalModelModalContainer({
  opened,
  editingModel,
  onClose,
}: MentalModelModalContainerProps) {
  const { user } = useAuth();
  const userId = user?.id ?? "";

  const handleSubmit = async (
    data:
      | MentalModelFormData
      | { id: MentalModelModel.response["id"]; data: MentalModelUpdateData },
  ) => {
    if ("id" in data && "data" in data) {
      mentalModelsCollection.update(data.id, (draft) => {
        Object.assign(draft, data.data);
      });
    } else {
      mentalModelsCollection.insert({
        ...data,
        userId,
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
      });

      onClose();
    }
  };

  return (
    <MentalModelModal
      opened={opened}
      onClose={onClose}
      onSubmit={handleSubmit}
      mentalModel={editingModel}
    />
  );
}
