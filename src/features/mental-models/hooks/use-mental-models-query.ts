import { useLiveSuspenseQuery } from "@tanstack/react-db";
import { getRouteApi } from "@tanstack/react-router";
import { eq, like, or } from "@tanstack/db";
import { mentalModelsCollection } from "~/features/mental-models/mental-models-collections";

export function useMentalModelsQuery() {
  const routeApi = getRouteApi("/_authenticated/mental-models/");
  const search = routeApi.useSearch();
  const status = search.status;
  const searchQuery = search.search ?? "";

  const { data } = useLiveSuspenseQuery(
    (q) => {
      let query = q.from({ mentalModels: mentalModelsCollection });

      if (status && status !== "all") {
        query = query.where(({ mentalModels }) => eq(mentalModels.status, status));
      }

      if (searchQuery.trim() !== "") {
        const searchPattern = `%${searchQuery}%`;

        query = query.where(({ mentalModels }) => {
          return or(
            like(mentalModels.book.title, searchPattern),
            like(mentalModels.book.authors, searchPattern),
          );
        });
      }

      query = query.orderBy(({ mentalModels }) => mentalModels.createdAt, "desc");

      return query;
    },
    [status, searchQuery],
  );

  return { mentalModels: data } as const;
}
