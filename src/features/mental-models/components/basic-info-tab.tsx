import { Stack, Box, Title, TextInput, Textarea, Divider } from "@mantine/core";
import type { MentalModelFormValues } from "~/features/mental-models/types/schemas/mental-model-schema";
import { withForm } from "~/hooks/use-form";

export const BasicInfoTab = withForm({
  defaultValues: {
    status: "reading" as MentalModelFormValues["status"],
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
  props: {},
  render: function Render({ form }) {
    return (
      <Stack gap="md">
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
                        : ((field.state.meta.errors[0] as { message?: string })?.message ??
                          "エラーが発生しました")
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
                        : ((field.state.meta.errors[0] as { message?: string })?.message ??
                          "エラーが発生しました")
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
                        : ((field.state.meta.errors[0] as { message?: string })?.message ??
                          "エラーが発生しました")
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
                        : ((field.state.meta.errors[0] as { message?: string })?.message ??
                          "エラーが発生しました")
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
                        : ((field.state.meta.errors[0] as { message?: string })?.message ??
                          "エラーが発生しました")
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
                        : ((field.state.meta.errors[0] as { message?: string })?.message ??
                          "エラーが発生しました")
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
                        : ((field.state.meta.errors[0] as { message?: string })?.message ??
                          "エラーが発生しました")
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
                        : ((field.state.meta.errors[0] as { message?: string })?.message ??
                          "エラーが発生しました")
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
                        : ((field.state.meta.errors[0] as { message?: string })?.message ??
                          "エラーが発生しました")
                      : undefined
                  }
                />
              )}
            </form.Field>
          </Stack>
        </Box>
      </Stack>
    );
  },
});
