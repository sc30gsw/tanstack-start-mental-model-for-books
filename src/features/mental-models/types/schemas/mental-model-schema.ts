import * as v from "valibot";

export const mentalModelStatusSchema = v.picklist(["reading", "completed"]);

export const mentalModelFormSchema = v.object({
  bookId: v.string(),
  status: v.optional(mentalModelStatusSchema, "reading"),
  whyReadAnswer1: v.pipe(v.string(), v.minLength(1, "必須項目です")),
  whyReadAnswer2: v.optional(v.string(), ""),
  whyReadAnswer3: v.optional(v.string(), ""),
  whatToGainAnswer1: v.optional(v.string(), ""),
  whatToGainAnswer2: v.optional(v.string(), ""),
  whatToGainAnswer3: v.optional(v.string(), ""),
  goalAfterReadingAnswer1: v.optional(v.string(), ""),
  goalAfterReadingAnswer2: v.optional(v.string(), ""),
  goalAfterReadingAnswer3: v.optional(v.string(), ""),
});

export const mentalModelFormSchemaWithoutBookId = v.object({
  status: v.optional(mentalModelStatusSchema, "reading"),
  whyReadAnswer1: v.pipe(v.string(), v.minLength(1, "必須項目です")),
  whyReadAnswer2: v.optional(v.string(), ""),
  whyReadAnswer3: v.optional(v.string(), ""),
  whatToGainAnswer1: v.optional(v.string(), ""),
  whatToGainAnswer2: v.optional(v.string(), ""),
  whatToGainAnswer3: v.optional(v.string(), ""),
  goalAfterReadingAnswer1: v.optional(v.string(), ""),
  goalAfterReadingAnswer2: v.optional(v.string(), ""),
  goalAfterReadingAnswer3: v.optional(v.string(), ""),
});

export const mentalModelFormSchemaForForm = v.object({
  status: mentalModelStatusSchema,
  whyReadAnswer1: v.pipe(v.string(), v.minLength(1, "必須項目です")),
  whyReadAnswer2: v.pipe(v.string(), v.minLength(1, "必須項目です")),
  whyReadAnswer3: v.pipe(v.string(), v.minLength(1, "必須項目です")),
  whatToGainAnswer1: v.pipe(v.string(), v.minLength(1, "必須項目です")),
  whatToGainAnswer2: v.pipe(v.string(), v.minLength(1, "必須項目です")),
  whatToGainAnswer3: v.pipe(v.string(), v.minLength(1, "必須項目です")),
  goalAfterReadingAnswer1: v.pipe(v.string(), v.minLength(1, "必須項目です")),
  goalAfterReadingAnswer2: v.pipe(v.string(), v.minLength(1, "必須項目です")),
  goalAfterReadingAnswer3: v.pipe(v.string(), v.minLength(1, "必須項目です")),
});

export const mentalModelUpdateSchema = v.object({
  status: v.optional(mentalModelStatusSchema),
  whyReadAnswer1: v.optional(v.string()),
  whyReadAnswer2: v.optional(v.string()),
  whyReadAnswer3: v.optional(v.string()),
  whatToGainAnswer1: v.optional(v.string()),
  whatToGainAnswer2: v.optional(v.string()),
  whatToGainAnswer3: v.optional(v.string()),
  goalAfterReadingAnswer1: v.optional(v.string()),
  goalAfterReadingAnswer2: v.optional(v.string()),
  goalAfterReadingAnswer3: v.optional(v.string()),
});

export type MentalModelFormData = v.InferOutput<typeof mentalModelFormSchema>;
export type MentalModelUpdateData = v.InferOutput<typeof mentalModelUpdateSchema>;
export type MentalModelStatus = v.InferOutput<typeof mentalModelStatusSchema>;
