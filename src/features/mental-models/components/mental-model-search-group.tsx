import { Group, Select, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { getRouteApi } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { MentalModelSearchParams } from "~/features/mental-models/types/schemas/search-params/search-schema";

export function MentalModelSearchGroup() {
  return (
    <Group gap="sm">
      <SearchTextInput />
      <StatusSelect />
    </Group>
  );
}

function SearchTextInput() {
  const routeApi = getRouteApi("/_authenticated/mental-models/");

  const navigate = routeApi.useNavigate();

  const search = routeApi.useSearch();
  const globalFilter = search.search ?? "";

  const [searchValue, setSearchValue] = useState(globalFilter);
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);

  useEffect(() => {
    setSearchValue(globalFilter);
  }, [globalFilter]);

  useEffect(() => {
    if (debouncedSearch !== globalFilter) {
      navigate({ search: { ...search, search: debouncedSearch } });
    }
  }, [debouncedSearch, globalFilter, navigate, search]);

  return (
    <TextInput
      placeholder="タイトルまたは著者で検索..."
      leftSection={<IconSearch size={16} />}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      w={250}
    />
  );
}

function StatusSelect() {
  const routeApi = getRouteApi("/_authenticated/mental-models/");

  const navigate = routeApi.useNavigate();

  const search = routeApi.useSearch();
  const status = search.status ?? "all";

  return (
    <Select
      placeholder="ステータス"
      value={status}
      onChange={(value) =>
        navigate({ search: { ...search, status: value as MentalModelSearchParams["status"] } })
      }
      data={[
        { value: "all", label: "すべて" },
        { value: "reading", label: "読書中" },
        { value: "completed", label: "完了" },
      ]}
      w={120}
      clearable={false}
    />
  );
}
