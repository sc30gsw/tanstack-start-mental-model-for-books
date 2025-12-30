import { eq, useLiveSuspenseQuery } from "@tanstack/react-db";
import { getRouteApi } from "@tanstack/react-router";
import { mentalModelsCollection } from "~/features/mental-models/mental-models-collections";

export function useMentalModelForUsers() {
  const routeApi = getRouteApi("/_authenticated/users/$userId");
  const search = routeApi.useSearch();
  const tab = search.tab;

  const { data: mentalModels } = useLiveSuspenseQuery(
    (q) => {
      let query = q.from({ mentalModels: mentalModelsCollection });

      if (tab === "liked") {
        query = query.where(({ mentalModels }) => eq(mentalModels.likedByCurrentUser, true));
      } else {
        query = query.where(({ mentalModels }) => eq(mentalModels.status, "completed"));
      }

      return query.orderBy(({ mentalModels }) => mentalModels.createdAt, "desc");
    },
    [tab],
  );

  return { mentalModels } as const;
}
