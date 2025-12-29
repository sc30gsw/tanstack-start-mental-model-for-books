import { useState, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  Group,
  Button,
  ActionIcon,
  Image,
  Text,
  Badge,
  Stack,
  Modal,
  Paper,
  Pagination,
} from "@mantine/core";
import {
  IconEye,
  IconEdit,
  IconTrash,
  IconArrowUp,
  IconArrowDown,
  IconArrowsUpDown,
} from "@tabler/icons-react";
import { MentalModelDetail } from "~/features/mental-models/components/mental-model-detail";
import { getRouteApi } from "@tanstack/react-router";
import type { MentalModelModel } from "~/features/mental-models/api/model";

const columnHelper = createColumnHelper<MentalModelModel.response>();

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
  const [detailModal, setDetailModal] = useState<MentalModelModel.response | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor("book.thumbnailUrl", {
        id: "thumbnail",
        header: "",
        cell: (info) => (
          <Image
            src={info.getValue()}
            alt=""
            w={40}
            h={60}
            fit="cover"
            radius="xs"
            fallbackSrc="https://placehold.co/40x60?text=No+Image"
          />
        ),
        enableSorting: false,
        size: 60,
      }),
      columnHelper.accessor("book.title", {
        id: "title",
        header: "タイトル",
        cell: (info) => (
          <Text size="sm" fw={500} lineClamp={2}>
            {info.getValue()}
          </Text>
        ),
        filterFn: "includesString",
      }),
      columnHelper.accessor("book.authors", {
        id: "authors",
        header: "著者",
        cell: (info) => (
          <Text size="sm" c="dimmed" lineClamp={1}>
            {info.getValue() ?? "不明"}
          </Text>
        ),
        filterFn: "includesString",
      }),
      columnHelper.accessor("status", {
        header: "ステータス",
        cell: (info) => (
          <Badge
            color={info.getValue() === "completed" ? "green" : "blue"}
            variant="light"
            size="sm"
          >
            {info.getValue() === "completed" ? "完了" : "読書中"}
          </Badge>
        ),
        filterFn: (row, columnId, filterValue) => {
          if (filterValue === "all") return true;
          return row.getValue(columnId) === filterValue;
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "作成日",
        cell: (info) => (
          <Text size="sm" c="dimmed">
            {new Date(info.getValue()).toLocaleDateString("ja-JP")}
          </Text>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "操作",
        cell: ({ row }) => (
          <Group gap="xs" wrap="nowrap">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => setDetailModal(row.original)}
              title="詳細を見る"
            >
              <IconEye size={16} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => onEdit(row.original)}
              title="編集"
            >
              <IconEdit size={16} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => setDeleteConfirm(row.original.id)}
              title="削除"
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        ),
      }),
    ],
    [onEdit],
  );

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
    onGlobalFilterChange: (value: string) => navigate({ search: { search: value } }),
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

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  return (
    <>
      <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
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
          <Table.Tbody>
            {table.getRowModel().rows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length} style={{ textAlign: "center", padding: "2rem" }}>
                  <Text c="dimmed">
                    {globalFilter || table.getColumn("status")?.getFilterValue()
                      ? "条件に一致するメンタルモデルがありません"
                      : "メンタルモデルがありません。新規作成してください。"}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Table.Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
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
        opened={!!detailModal}
        onClose={() => setDetailModal(null)}
        title="メンタルモデル詳細"
        size="lg"
        centered
      >
        {detailModal && <MentalModelDetail mentalModel={detailModal} />}
      </Modal>

      <Modal
        opened={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="削除の確認"
        centered
        size="sm"
      >
        <Stack gap="md">
          <Text>このメンタルモデルを削除してもよろしいですか？</Text>
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              キャンセル
            </Button>
            <Button color="red" onClick={handleConfirmDelete}>
              削除
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
