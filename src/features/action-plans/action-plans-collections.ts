import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { QueryClient } from "@tanstack/react-query";
import { api } from "~/lib/rpc";
import { getAuth } from "@workos/authkit-tanstack-react-start";
import type { ActionPlanModel } from "~/features/action-plans/api/model";

const queryClient = new QueryClient();

// コレクションを作成するヘルパー関数（型推論用）
function createActionPlansCollection(mentalModelId: ActionPlanModel.response["mentalModelId"]) {
  return createCollection(
    queryCollectionOptions({
      queryClient,
      queryKey: ["action-plans", mentalModelId],
      queryFn: async () => {
        const { user } = await getAuth();

        if (!user) {
          throw new Error("User not found");
        }

        const response = await api["action-plans"]["mental-models"]({ mentalModelId }).get({
          headers: { authorization: user.id },
        });
        console.log("🚀 ~ actionPlansCollection ~ response:", response);

        if (response.status !== 200) {
          throw new Error(response.error?.value?.message || "Failed to fetch action plans");
        }

        return response.data ?? [];
      },
      getKey: (item) => item.id,
      onInsert: async ({ transaction }) => {
        const { changes: newActionPlan } = transaction.mutations[0];

        if (!newActionPlan.content) {
          throw new Error("Content is required");
        }

        if (!newActionPlan.mentalModelId) {
          throw new Error("Mental model ID is required");
        }

        const { user } = await getAuth();

        if (!user) {
          throw new Error("User not found");
        }

        const response = await api["action-plans"]
          ["mental-models"]({ mentalModelId: newActionPlan.mentalModelId })
          .post(
            { mentalModelId: newActionPlan.mentalModelId, content: newActionPlan.content },
            { headers: { authorization: user.id } },
          );

        if (response.status !== 200) {
          throw new Error(response.error?.value?.message || "Failed to create action plan");
        }

        if (!response.data) {
          throw new Error("Failed to create action plan: no data returned");
        }
      },
      onUpdate: async ({ transaction }) => {
        const { original, modified } = transaction.mutations[0];

        if (!original.id) {
          throw new Error("Action plan item must have an id");
        }

        if (!modified.content) {
          throw new Error("Content is required");
        }

        const { user } = await getAuth();

        if (!user) {
          throw new Error("User not found");
        }

        const response = await api["action-plans"]({ id: original.id }).patch(
          { content: modified.content },
          { headers: { authorization: user.id } },
        );

        if (response.status !== 200) {
          throw new Error(response.error?.value?.message || "Failed to update action plan");
        }

        if (!response.data) {
          throw new Error("Failed to update action plan: no data returned");
        }
      },
      onDelete: async ({ transaction }) => {
        const original = transaction.mutations[0].original;

        if (!original.id) {
          throw new Error("Action plan item must have an id");
        }

        const { user } = await getAuth();

        if (!user) {
          throw new Error("User not found");
        }

        const response = await api["action-plans"]({ id: original.id }).delete(undefined, {
          headers: { authorization: user.id },
        });

        if (response.status !== 200) {
          throw new Error(response.error?.value?.message || "Failed to delete action plan");
        }
      },
    }),
  );
}

// コレクションインスタンスの型を取得
type ActionPlansCollection = ReturnType<typeof createActionPlansCollection>;

// コレクションインスタンスをメモ化するためのMap
const collectionCache = new Map<ActionPlanModel.response["mentalModelId"], ActionPlansCollection>();

export function actionPlansCollection(mentalModelId: ActionPlanModel.response["mentalModelId"]) {
  // 既存のインスタンスがあればそれを返す
  const cached = collectionCache.get(mentalModelId);
  if (cached) {
    return cached;
  }

  // 新しいインスタンスを作成してキャッシュに保存
  const collection = createActionPlansCollection(mentalModelId);
  collectionCache.set(mentalModelId, collection);
  return collection;
}
