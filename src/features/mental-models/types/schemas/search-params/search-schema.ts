import * as v from "valibot";

export const mentalModelSearchSchema = v.object({
  search: v.optional(v.string(), ""),
  status: v.optional(v.picklist(["all", "reading", "completed"]), "all"),
});

export type MentalModelSearchParams = v.InferOutput<typeof mentalModelSearchSchema>;

export const mentalModelDefaultSearchParams = {
  search: "",
  status: "all",
} as const satisfies MentalModelSearchParams;
