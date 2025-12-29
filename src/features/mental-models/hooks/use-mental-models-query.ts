import { useMemo } from "react";
import { useLiveSuspenseQuery } from "@tanstack/react-db";
import { getRouteApi } from "@tanstack/react-router";
import { eq, like, or } from "@tanstack/db";
import { createMentalModelsCollection } from "~/features/mental-models/mental-models-collections";
import type { MentalModelModel } from "~/features/mental-models/api/model";

export function useMentalModelsQuery(userId: MentalModelModel.GetAllRequestParams["userId"]) {
  const routeApi = getRouteApi("/_authenticated/mental-models/");
  const search = routeApi.useSearch();
  const status = search.status;
  const searchQuery = search.search ?? "";

  const collection = useMemo(() => createMentalModelsCollection(userId), [userId]);

  const { data } = useLiveSuspenseQuery(
    (q) => {
      let query = q.from({ mentalModels: collection });

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
    [status, searchQuery, collection],
  );

  return { mentalModels: data, collection };
}
