import { useLiveSuspenseQuery } from "@tanstack/react-db";
import { actionPlansCollection } from "~/features/action-plans/action-plans-collections";
import type { ActionPlanModel } from "~/features/action-plans/api/model";

export function useActionPlansQuery(mentalModelId: ActionPlanModel.response["mentalModelId"]) {
  const collection = actionPlansCollection(mentalModelId);
  const { data } = useLiveSuspenseQuery(
    (q) => {
      return q
        .from({ actionPlans: collection })
        .orderBy(({ actionPlans }) => actionPlans.createdAt, "desc");
    },
    [mentalModelId],
  );

  return { actionPlans: data, collection } as const;
}
