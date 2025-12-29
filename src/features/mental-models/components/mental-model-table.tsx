import { useState, useCallback } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { Table, Group, Modal, Paper, Pagination, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowUp, IconArrowDown, IconArrowsUpDown } from "@tabler/icons-react";
import { MentalModelDetail } from "~/features/mental-models/components/mental-model-detail";
import { getRouteApi } from "@tanstack/react-router";
import type { MentalModelModel } from "~/features/mental-models/api/model";
import { MentalModelDeleteModal } from "~/features/mental-models/components/mental-model-delete-modal";
import { MentalModelTableBody } from "~/features/mental-models/components/mental-model-table-body";
import { useMentalModelTableColumns } from "~/features/mental-models/hooks/use-mental-model-table-columns";

type MentalModelTableProps = {
  data: MentalModelModel.response[];
  onEdit: (mentalModel: MentalModelModel.response) => void;
  onDelete: (id: MentalModelModel.response["id"]) => void;
};

export function MentalModelTable({ data, onEdit, onDelete }: MentalModelTableProps) {
  const routeApi = getRouteApi("/_authenticated/mental-models/");
  const search = routeApi.useSearch();
  const globalFilter = search.search ?? "";

  const navigate = routeApi.useNavigate();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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

  const handleOpenDelete = useCallback(
    (mentalModelId: MentalModelModel.response["id"]) => {
      setDeleteMentalModelId(mentalModelId);
      openDeleteModal();
    },
    [openDeleteModal],
  );

  const handleCloseDelete = useCallback(() => {
    closeDeleteModal();
    setDeleteMentalModelId(null);
  }, [closeDeleteModal]);

  const handleConfirmDelete = useCallback(() => {
    if (deleteMentalModelId) {
      onDelete(deleteMentalModelId);
      handleCloseDelete();
    }
  }, [deleteMentalModelId, onDelete, handleCloseDelete]);

  const columns = useMentalModelTableColumns({
    onEdit,
    onOpenDetail: handleOpenDetail,
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
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
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

  return (
    <>
      <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
        <ScrollArea type="scroll">
          <Table striped highlightOnHover>
            <Table.Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Th
                      key={header.id}
                      style={{
                        width: header.getSize() !== 150 ? header.getSize() : undefined,
                        cursor: header.column.getCanSort() ? "pointer" : "default",
                        whiteSpace: "nowrap",
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Group gap="xs" wrap="nowrap">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <>
                            {header.column.getIsSorted() === "asc" ? (
                              <IconArrowUp size={14} />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <IconArrowDown size={14} />
                            ) : (
                              <IconArrowsUpDown size={14} color="gray" />
                            )}
                          </>
                        )}
                      </Group>
                    </Table.Th>
                  ))}
                </Table.Tr>
              ))}
            </Table.Thead>
            <MentalModelTableBody
              table={table}
              columnsCount={columns.length}
              globalFilter={globalFilter}
            />
          </Table>
        </ScrollArea>
      </Paper>

      {table.getPageCount() > 1 && (
        <Group justify="center">
          <Pagination
            total={table.getPageCount()}
            value={table.getState().pagination.pageIndex + 1}
            onChange={(page) => table.setPageIndex(page - 1)}
          />
        </Group>
      )}

      <Modal
        opened={detailModalOpened}
        onClose={handleCloseDetail}
        title="メンタルモデル詳細"
        size="lg"
        centered
      >
        {detailModalData && <MentalModelDetail mentalModel={detailModalData} />}
      </Modal>

      <MentalModelDeleteModal
        opened={deleteModalOpened}
        onClose={handleCloseDelete}
        onDelete={handleConfirmDelete}
      />
    </>
  );
}
