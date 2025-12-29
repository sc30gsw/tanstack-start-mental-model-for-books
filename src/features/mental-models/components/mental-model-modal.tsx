import { useState } from "react";
import {
  Modal,
  Stack,
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  Card,
  Image,
  Text,
  Title,
  Divider,
  ActionIcon,
  Box,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { useAuth } from "@workos/authkit-tanstack-react-start/client";
import { BookSearch } from "~/features/mental-models/components/book-search";
import { createOrGetBook } from "~/features/mental-models/utils/create-or-get-book";
import type { BookSearchResult } from "~/features/mental-models/utils/search-google-books";
import type { MentalModelWithBook } from "~/features/mental-models/collections";
import {
  mentalModelFormSchemaForForm,
  type MentalModelFormData,
  type MentalModelUpdateData,
} from "~/features/mental-models/types/schemas/mental-model-schema";
import type { GoogleBooksModel } from "~/features/books/server/models";
import type { MentalModelModel } from "~/features/mental-models/server/model";
type MentalModelModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (
    data:
      | MentalModelFormData
      | { id: MentalModelModel.response["id"]; data: MentalModelUpdateData },
  ) => Promise<void>;
  mentalModel?: MentalModelWithBook | null;
};

export function MentalModelModal({
  opened,
  onClose,
  onSubmit,
  mentalModel,
}: MentalModelModalProps) {
  const isEditing = !!mentalModel;
  const { user } = useAuth();
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(null);
  const [savedBookId, setSavedBookId] = useState<
    GoogleBooksModel.BookSearchResult["googleBookId"] | null
  >(null);

  const form = useForm({
    defaultValues: mentalModel
      ? {
          status: mentalModel.status,
          whyReadAnswer1: mentalModel.whyReadAnswer1,
          whyReadAnswer2: mentalModel.whyReadAnswer2,
          whyReadAnswer3: mentalModel.whyReadAnswer3,
          whatToGainAnswer1: mentalModel.whatToGainAnswer1,
          whatToGainAnswer2: mentalModel.whatToGainAnswer2,
          whatToGainAnswer3: mentalModel.whatToGainAnswer3,
          goalAfterReadingAnswer1: mentalModel.goalAfterReadingAnswer1,
          goalAfterReadingAnswer2: mentalModel.goalAfterReadingAnswer2,
          goalAfterReadingAnswer3: mentalModel.goalAfterReadingAnswer3,
        }
      : {
          status: "reading" as "reading" | "completed",
          whyReadAnswer1: "",
          whyReadAnswer2: "",
          whyReadAnswer3: "",
          whatToGainAnswer1: "",
          whatToGainAnswer2: "",
          whatToGainAnswer3: "",
          goalAfterReadingAnswer1: "",
          goalAfterReadingAnswer2: "",
          goalAfterReadingAnswer3: "",
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
      onClose();
      setSelectedBook(null);
      setSavedBookId(null);
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
        <Stack gap="md">
          {!isEditing && !selectedBook && (
            <BookSearch onSelect={handleBookSelect} disabled={form.state.isSubmitting} />
          )}

          {(selectedBook || (isEditing && mentalModel)) && (
            <Card withBorder p="sm">
              <Group gap="sm" wrap="nowrap" justify="space-between">
                <Group gap="sm" wrap="nowrap">
                  <Image
                    src={selectedBook?.thumbnailUrl ?? mentalModel?.book.thumbnailUrl ?? undefined}
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
              <Select
                label="ステータス"
                value={field.state.value}
                onChange={(value) =>
                  field.handleChange((value as "reading" | "completed") ?? "reading")
                }
                data={[
                  { value: "reading", label: "読書中" },
                  { value: "completed", label: "完了" },
                ]}
                disabled={form.state.isSubmitting}
              />
            )}
          </form.Field>

          <Divider />

          {/* Q1: Why read this book? */}
          <Box>
            <Title order={5} mb="xs">
              Q1. なぜこの本を読もうと思ったか？
            </Title>
            <Stack gap="xs">
              <form.Field name="whyReadAnswer1">
                {(field) => (
                  <Textarea
                    placeholder="理由 1（必須）"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={form.state.isSubmitting}
                    required
                    error={
                      field.state.meta.errors?.[0]
                        ? typeof field.state.meta.errors[0] === "string"
                          ? field.state.meta.errors[0]
                          : (field.state.meta.errors[0]?.message ?? "エラーが発生しました")
                        : undefined
                    }
                  />
                )}
              </form.Field>
              <form.Field name="whyReadAnswer2">
                {(field) => (
                  <TextInput
                    placeholder="理由 2（必須）"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={form.state.isSubmitting}
                    required
                    error={
                      field.state.meta.errors?.[0]
                        ? typeof field.state.meta.errors[0] === "string"
                          ? field.state.meta.errors[0]
                          : (field.state.meta.errors[0]?.message ?? "エラーが発生しました")
                        : undefined
                    }
                  />
                )}
              </form.Field>
              <form.Field name="whyReadAnswer3">
                {(field) => (
                  <TextInput
                    placeholder="理由 3（必須）"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={form.state.isSubmitting}
                    required
                    error={
                      field.state.meta.errors?.[0]
                        ? typeof field.state.meta.errors[0] === "string"
                          ? field.state.meta.errors[0]
                          : (field.state.meta.errors[0]?.message ?? "エラーが発生しました")
                        : undefined
                    }
                  />
                )}
              </form.Field>
            </Stack>
          </Box>

          <Divider />

          {/* Q2: What to gain from this book? */}
          <Box>
            <Title order={5} mb="xs">
              Q2. この本から何が得られそうか？
            </Title>
            <Stack gap="xs">
              <form.Field name="whatToGainAnswer1">
                {(field) => (
                  <TextInput
                    placeholder="期待すること 1（必須）"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={form.state.isSubmitting}
                    required
                    error={
                      field.state.meta.errors?.[0]
                        ? typeof field.state.meta.errors[0] === "string"
                          ? field.state.meta.errors[0]
                          : (field.state.meta.errors[0]?.message ?? "エラーが発生しました")
                        : undefined
                    }
                  />
                )}
              </form.Field>
              <form.Field name="whatToGainAnswer2">
                {(field) => (
                  <TextInput
                    placeholder="期待すること 2（必須）"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={form.state.isSubmitting}
                    required
                    error={
                      field.state.meta.errors?.[0]
                        ? typeof field.state.meta.errors[0] === "string"
                          ? field.state.meta.errors[0]
                          : (field.state.meta.errors[0]?.message ?? "エラーが発生しました")
                        : undefined
                    }
                  />
                )}
              </form.Field>
              <form.Field name="whatToGainAnswer3">
                {(field) => (
                  <TextInput
                    placeholder="期待すること 3（必須）"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={form.state.isSubmitting}
                    required
                    error={
                      field.state.meta.errors?.[0]
                        ? typeof field.state.meta.errors[0] === "string"
                          ? field.state.meta.errors[0]
                          : (field.state.meta.errors[0]?.message ?? "エラーが発生しました")
                        : undefined
                    }
                  />
                )}
              </form.Field>
            </Stack>
          </Box>

          <Divider />

          {/* Q3: Goal after reading */}
          <Box>
            <Title order={5} mb="xs">
              Q3. この本を読んだ後どうなっていたいか？
            </Title>
            <Stack gap="xs">
              <form.Field name="goalAfterReadingAnswer1">
                {(field) => (
                  <TextInput
                    placeholder="目標 1（必須）"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={form.state.isSubmitting}
                    required
                    error={
                      field.state.meta.errors?.[0]
                        ? typeof field.state.meta.errors[0] === "string"
                          ? field.state.meta.errors[0]
                          : (field.state.meta.errors[0]?.message ?? "エラーが発生しました")
                        : undefined
                    }
                  />
                )}
              </form.Field>
              <form.Field name="goalAfterReadingAnswer2">
                {(field) => (
                  <TextInput
                    placeholder="目標 2（必須）"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={form.state.isSubmitting}
                    required
                    error={
                      field.state.meta.errors?.[0]
                        ? typeof field.state.meta.errors[0] === "string"
                          ? field.state.meta.errors[0]
                          : (field.state.meta.errors[0]?.message ?? "エラーが発生しました")
                        : undefined
                    }
                  />
                )}
              </form.Field>
              <form.Field name="goalAfterReadingAnswer3">
                {(field) => (
                  <TextInput
                    placeholder="目標 3（必須）"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={form.state.isSubmitting}
                    required
                    error={
                      field.state.meta.errors?.[0]
                        ? typeof field.state.meta.errors[0] === "string"
                          ? field.state.meta.errors[0]
                          : (field.state.meta.errors[0]?.message ?? "エラーが発生しました")
                        : undefined
                    }
                  />
                )}
              </form.Field>
            </Stack>
          </Box>

          <Divider />

          {/* Actions */}
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
      </form>
    </Modal>
  );
}
