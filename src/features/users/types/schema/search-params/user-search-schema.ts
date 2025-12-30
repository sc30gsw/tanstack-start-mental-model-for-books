import * as v from "valibot";

export const userSearchSchema = v.object({
  tab: v.optional(v.picklist(["liked", "completed"]), "liked"),
});

export type UserSearchParams = v.InferOutput<typeof userSearchSchema>;

export const userDefaultSearchParams = {
  tab: "liked",
} as const satisfies UserSearchParams;
