import { getRouteApi } from "@tanstack/react-router";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { useReducer, useState } from "react";
import type { MentalModelModel } from "~/features/mental-models/api/model";
import { useMentalModelTableColumns } from "~/features/mental-models/hooks/use-mental-model-table-columns";
import type { MentalModelTable } from "~/features/mental-models/components/mental-model-table";
import { useDisclosure } from "@mantine/hooks";

export function useMentalModelTable({
  data,
  onEdit,
  onDelete,
}: Parameters<typeof MentalModelTable>[0]) {
  const routeApi = getRouteApi("/_authenticated/mental-models/");

  const search = routeApi.useSearch();
  const globalFilter = search.search ?? "";

  const navigate = routeApi.useNavigate();

  const tableReducer = (
    state: { sorting: SortingState; columnFilters: ColumnFiltersState },
    action:
      | { type: "setSorting"; payload: SortingState | ((prev: SortingState) => SortingState) }
      | {
          type: "setColumnFilters";
          payload: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState);
        },
  ) => {
    switch (action.type) {
      case "setSorting": {
        const sorting =
          typeof action.payload === "function" ? action.payload(state.sorting) : action.payload;

        return { ...state, sorting };
      }

      case "setColumnFilters": {
        const columnFilters =
          typeof action.payload === "function"
            ? action.payload(state.columnFilters)
            : action.payload;

        return { ...state, columnFilters };
      }

      default:
        return state;
    }
  };

  const [{ sorting, columnFilters }, dispatch] = useReducer(tableReducer, {
    sorting: [],
    columnFilters: [],
  });

  const [detailModalOpened, { open: openDetailModal, close: closeDetailModal }] =
    useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);

  const [detailModalData, setDetailModalData] = useState<MentalModelModel.response | null>(null);
  const [deleteMentalModelId, setDeleteMentalModelId] = useState<
    MentalModelModel.response["id"] | null
  >(null);

  const handleOpenDetail = (mentalModel: MentalModelModel.response) => {
    setDetailModalData(mentalModel);
    openDetailModal();
  };

  const handleCloseDetail = () => {
    closeDetailModal();
    setDetailModalData(null);
  };

  const handleOpenDelete = (mentalModelId: MentalModelModel.response["id"]) => {
    setDeleteMentalModelId(mentalModelId);
    openDeleteModal();
  };

  const handleCloseDelete = () => {
    closeDeleteModal();
    setDeleteMentalModelId(null);
  };

  const handleConfirmDelete = () => {
    if (deleteMentalModelId) {
      onDelete(deleteMentalModelId);
      handleCloseDelete();
    }
  };

  const columns = useMentalModelTableColumns({
    onEdit,
    onOpenDelete: handleOpenDelete,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: (updater) => dispatch({ type: "setSorting", payload: updater }),
    onColumnFiltersChange: (updater) => dispatch({ type: "setColumnFilters", payload: updater }),
    onGlobalFilterChange: (value: string) => navigate({ search: { ...search, search: value } }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const title = row.original.book.title.toLowerCase();
      const authors = row.original.book.authors?.toLowerCase() ?? "";
      const search = filterValue.toLowerCase();
      return title.includes(search) || authors.includes(search);
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return {
    columns,
    table,
    globalFilter,
    detailModalOpened,
    deleteModalOpened,
    detailModalData,
    handleOpenDetail,
    handleCloseDetail,
    handleCloseDelete,
    handleConfirmDelete,
  } as const;
}
