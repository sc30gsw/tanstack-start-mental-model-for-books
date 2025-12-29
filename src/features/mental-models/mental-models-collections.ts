import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { QueryClient } from "@tanstack/react-query";
import { api } from "~/lib/rpc";
import type { MentalModelModel } from "~/features/mental-models/api/model";

const queryClient = new QueryClient();

export function createMentalModelsCollection(
  userId: MentalModelModel.GetAllRequestParams["userId"],
) {
  return createCollection(
    queryCollectionOptions({
      queryClient,
      queryKey: ["mental-models", userId],
      queryFn: async () => {
        const response = await api["mental-models"].get({
          headers: { authorization: userId },
        });

        if (response.status !== 200) {
          throw new Error(response.error?.value?.message || "Failed to fetch mental models");
        }

        return response.data ?? [];
      },
      getKey: (item) => {
        return item.id;
      },
      onInsert: async ({ transaction }) => {
        const { changes: newMentalModel } = transaction.mutations[0];

        if (!newMentalModel.bookId) {
          throw new Error("Book ID is required");
        }

        if (!newMentalModel.whyReadAnswer1) {
          throw new Error("Why read answer 1 is required");
        }

        const formData = {
          bookId: newMentalModel.bookId,
          status: newMentalModel.status ?? "reading",
          whyReadAnswer1: newMentalModel.whyReadAnswer1,
          whyReadAnswer2: newMentalModel.whyReadAnswer2 ?? "",
          whyReadAnswer3: newMentalModel.whyReadAnswer3 ?? "",
          whatToGainAnswer1: newMentalModel.whatToGainAnswer1 ?? "",
          whatToGainAnswer2: newMentalModel.whatToGainAnswer2 ?? "",
          whatToGainAnswer3: newMentalModel.whatToGainAnswer3 ?? "",
          goalAfterReadingAnswer1: newMentalModel.goalAfterReadingAnswer1 ?? "",
          goalAfterReadingAnswer2: newMentalModel.goalAfterReadingAnswer2 ?? "",
          goalAfterReadingAnswer3: newMentalModel.goalAfterReadingAnswer3 ?? "",
        } as const satisfies MentalModelModel.createBody;

        const response = await api["mental-models"].post(formData, {
          headers: { authorization: userId },
        });

        if (response.status !== 200) {
          throw new Error(response.error?.value?.message || "Failed to create mental model");
        }

        if (!response.data) {
          throw new Error("Failed to create mental model: no data returned");
        }
      },
      onUpdate: async ({ transaction }) => {
        const { original, modified } = transaction.mutations[0];

        if (!original.id) {
          throw new Error("Mental model item must have an id");
        }

        const updateData = {
          status: modified.status,
          whyReadAnswer1: modified.whyReadAnswer1,
          whyReadAnswer2: modified.whyReadAnswer2,
          whyReadAnswer3: modified.whyReadAnswer3,
          whatToGainAnswer1: modified.whatToGainAnswer1,
          whatToGainAnswer2: modified.whatToGainAnswer2,
          whatToGainAnswer3: modified.whatToGainAnswer3,
          goalAfterReadingAnswer1: modified.goalAfterReadingAnswer1,
          goalAfterReadingAnswer2: modified.goalAfterReadingAnswer2,
          goalAfterReadingAnswer3: modified.goalAfterReadingAnswer3,
        } as const satisfies MentalModelModel.updateBody;

        const response = await api["mental-models"]({ id: original.id }).patch(updateData, {
          headers: { authorization: userId },
        });

        if (response.status !== 200) {
          throw new Error(response.error?.value?.message || "Failed to update mental model");
        }

        if (!response.data) {
          throw new Error("Failed to update mental model: no data returned");
        }
      },
      onDelete: async ({ transaction }) => {
        const original = transaction.mutations[0].original;

        if (!original.id) {
          throw new Error("Mental model item must have an id");
        }

        const response = await api["mental-models"]({ id: original.id }).delete(undefined, {
          headers: { authorization: userId },
        });

        if (response.status !== 200) {
          throw new Error(response.error?.value?.message || "Failed to delete mental model");
        }
      },
    }),
  );
}
