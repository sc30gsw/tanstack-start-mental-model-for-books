import type { createMentalModelsCollection } from "~/features/mental-models/mental-models-collections";
import type { MentalModelModel } from "~/features/mental-models/api/model";
import type {
  MentalModelFormData,
  MentalModelUpdateData,
} from "~/features/mental-models/types/schemas/mental-model-schema";

export function useMentalModelMutations(
  collection: ReturnType<typeof createMentalModelsCollection> | null,
  userId: MentalModelModel.GetAllRequestParams["userId"],
) {
  const create = async (data: MentalModelFormData) => {
    if (!collection) {
      throw new Error("Collection is required");
    }

    collection.insert({
      ...data,
      userId,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      book: {
        id: data.bookId,
        googleBookId: "",
        title: "",
        authors: null,
        thumbnailUrl: null,
        description: null,
      },
    });
  };

  const update = async (
    id: MentalModelModel.GetByIdRequestParams["id"],
    data: MentalModelUpdateData,
  ) => {
    if (!collection) {
      throw new Error("Collection is required");
    }

    const item = collection.get(id);
    if (!item) {
      throw new Error(`Mental model with id ${id} not found in collection`);
    }

    collection.update(id, (draft) => {
      return { ...draft, ...data };
    });
  };

  const remove = (id: MentalModelModel.GetByIdRequestParams["id"]) => {
    if (!collection) {
      throw new Error("Collection is required");
    }

    collection.delete(id);
  };

  return { create, update, remove } as const;
}
