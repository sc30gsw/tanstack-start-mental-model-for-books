import { Group, Select, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { getRouteApi } from "@tanstack/react-router";
import React from "react";
import type { MentalModelSearchParams } from "~/features/mental-models/types/schemas/search-params/search-schema";

export function MentalModelSearchGroup() {
  const routeApi = getRouteApi("/_authenticated/mental-models/");

  const navigate = routeApi.useNavigate();

  const search = routeApi.useSearch();
  const globalFilter = search.search ?? "";
  const status = search.status ?? "all";

  return (
    <Group gap="sm">
      <TextInput
        placeholder="タイトルまたは著者で検索..."
        leftSection={<IconSearch size={16} />}
        value={globalFilter}
        onChange={(e) => navigate({ search: { search: e.target.value } })}
        w={250}
      />
      <Select
        placeholder="ステータス"
        value={status}
        onChange={(value) =>
          navigate({ search: { status: value as MentalModelSearchParams["status"] } })
        }
        data={[
          { value: "all", label: "すべて" },
          { value: "reading", label: "読書中" },
          { value: "completed", label: "完了" },
        ]}
        w={120}
        clearable={false}
      />
    </Group>
  );
}
