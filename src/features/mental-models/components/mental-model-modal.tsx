import { Suspense, useState } from "react";
import {
  Modal,
  Stack,
  Select,
  Button,
  Group,
  Card,
  Image,
  Text,
  Title,
  Divider,
  ActionIcon,
  Skeleton,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useAppForm } from "~/hooks/use-form";
import { useAuth } from "@workos/authkit-tanstack-react-start/client";
import { BookSearch } from "~/features/mental-models/components/book-search";
import { createOrGetBook } from "~/features/mental-models/utils/create-or-get-book";
import type { BookSearchResult } from "~/features/mental-models/utils/search-google-books";
import {
  mentalModelFormSchemaForForm,
  type MentalModelFormData,
  type MentalModelUpdateData,
} from "~/features/mental-models/types/schemas/mental-model-schema";
import type { GoogleBooksModel } from "~/features/books/api/models";
import type { MentalModelModel } from "~/features/mental-models/api/model";
import { BasicInfoTab } from "~/features/mental-models/components/basic-info-tab";
import { ActionPlansTab } from "~/features/mental-models/components/action-plans-tab";
import { ModalTabs } from "~/features/mental-models/components/modal-tabs";

type MentalModelModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (
    data:
      | MentalModelFormData
      | { id: MentalModelModel.response["id"]; data: MentalModelUpdateData },
  ) => Promise<void>;
  mentalModel?: MentalModelModel.response | null;
  activeTab: "basic" | "actionPlans";
  onTabChange: (tab: "basic" | "actionPlans") => void;
};

export function MentalModelModal({
  opened,
  onClose,
  onSubmit,
  mentalModel,
  activeTab,
  onTabChange,
}: MentalModelModalProps) {
  const isEditing = !!mentalModel;
  const { user } = useAuth();

  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(null);
  const [savedBookId, setSavedBookId] = useState<
    GoogleBooksModel.BookSearchResult["googleBookId"] | null
  >(null);

  const form = useAppForm({
    defaultValues: {
      status: mentalModel?.status ?? "reading",
      whyReadAnswer1: mentalModel?.whyReadAnswer1 ?? "",
      whyReadAnswer2: mentalModel?.whyReadAnswer2 ?? "",
      whyReadAnswer3: mentalModel?.whyReadAnswer3 ?? "",
      whatToGainAnswer1: mentalModel?.whatToGainAnswer1 ?? "",
      whatToGainAnswer2: mentalModel?.whatToGainAnswer2 ?? "",
      whatToGainAnswer3: mentalModel?.whatToGainAnswer3 ?? "",
      goalAfterReadingAnswer1: mentalModel?.goalAfterReadingAnswer1 ?? "",
      goalAfterReadingAnswer2: mentalModel?.goalAfterReadingAnswer2 ?? "",
      goalAfterReadingAnswer3: mentalModel?.goalAfterReadingAnswer3 ?? "",
    },
    validators: {
      onChange: mentalModelFormSchemaForForm,
    },
    onSubmit: async ({ value }) => {
      if (!selectedBook && !isEditing) {
        return;
      }

      let bookId = savedBookId;

      if (!bookId && selectedBook) {
        if (!user?.id) {
          throw new Error("User ID is required");
        }

        const savedBook = await createOrGetBook(
          {
            googleBookId: selectedBook.googleBookId,
            title: selectedBook.title,
            authors: selectedBook.authors ?? undefined,
            thumbnailUrl: selectedBook.thumbnailUrl ?? undefined,
            description: selectedBook.description ?? undefined,
          },
          user.id,
        );
        bookId = savedBook.id;
      }

      if (isEditing && mentalModel) {
        await onSubmit({
          id: mentalModel.id,
          data: value,
        });
      } else if (bookId) {
        await onSubmit({
          bookId,
          ...value,
        });
      }

      form.reset();
      setSelectedBook(null);
      setSavedBookId(null);
      onClose();
    },
  });

  const handleBookSelect = (book: BookSearchResult) => {
    setSelectedBook(book);
    setSavedBookId(null);
  };

  const handleClearBook = () => {
    setSelectedBook(null);
    setSavedBookId(null);
  };

  const canAccessActionPlans = isEditing
    ? activeTab === "actionPlans"
    : form.state.values.status === "completed";

  const handleStatusChange = (value: string | null) => {
    const newStatus = (value as "reading" | "completed") ?? "reading";
    form.setFieldValue("status", newStatus);

    switch (newStatus) {
      case "reading":
        onTabChange("basic");
        break;

      case "completed":
        if (isEditing) {
          onTabChange("actionPlans");
        } else {
          onTabChange("basic");
        }

        break;
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Title order={3}>{isEditing ? "メンタルモデルを編集" : "新しいメンタルモデルを作成"}</Title>
      }
      size="lg"
      centered
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.AppForm>
          <Stack gap="md">
            {!isEditing && !selectedBook && (
              <BookSearch onSelect={handleBookSelect} disabled={form.state.isSubmitting} />
            )}

            {(selectedBook || (isEditing && mentalModel)) && (
              <Card withBorder p="sm">
                <Group gap="sm" wrap="nowrap" justify="space-between">
                  <Group gap="sm" wrap="nowrap">
                    <Image
                      src={
                        selectedBook?.thumbnailUrl ?? mentalModel?.book.thumbnailUrl ?? undefined
                      }
                      alt={selectedBook?.title ?? mentalModel?.book.title ?? ""}
                      w={50}
                      h={75}
                      fit="cover"
                      radius="xs"
                      fallbackSrc="https://placehold.co/50x75?text=No+Image"
                    />
                    <Stack gap={2}>
                      <Text fw={500} lineClamp={2}>
                        {selectedBook?.title ?? mentalModel?.book.title ?? ""}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {selectedBook?.authors ?? mentalModel?.book.authors ?? "著者不明"}
                      </Text>
                    </Stack>
                  </Group>
                  {!isEditing && (
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={handleClearBook}
                      disabled={form.state.isSubmitting}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  )}
                </Group>
              </Card>
            )}

            {/* Status */}
            <form.Field name="status">
              {(field) => (
                <Group align="flex-end" gap="sm">
                  <Select
                    label="ステータス"
                    value={field.state.value}
                    onChange={handleStatusChange}
                    data={[
                      { value: "reading", label: "読書中" },
                      { value: "completed", label: "完了" },
                    ]}
                    disabled={form.state.isSubmitting}
                    style={{ flex: 1 }}
                  />
                </Group>
              )}
            </form.Field>

            {isEditing && <Divider />}

            <ModalTabs
              activeTab={activeTab}
              onTabChange={onTabChange}
              isEditing={isEditing}
              canAccessActionPlans={canAccessActionPlans || activeTab === "actionPlans"}
            />

            <Divider />

            {activeTab === "basic" && <BasicInfoTab form={form} />}

            {activeTab === "actionPlans" &&
              isEditing &&
              (mentalModel.status === "completed" || form.state.values.status === "completed") && (
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

            <Divider />

            <Group justify="flex-end">
              <Button variant="outline" onClick={onClose} disabled={form.state.isSubmitting}>
                キャンセル
              </Button>
              <Button
                type="submit"
                loading={form.state.isSubmitting}
                disabled={!form.state.canSubmit || (!selectedBook && !isEditing)}
              >
                {isEditing ? "更新" : "作成"}
              </Button>
            </Group>
          </Stack>
        </form.AppForm>
      </form>
    </Modal>
  );
}
