import { flexRender } from "@tanstack/react-table";
import { Table, Group, Modal, Paper, Pagination, ScrollArea } from "@mantine/core";
import { IconArrowUp, IconArrowDown, IconArrowsUpDown } from "@tabler/icons-react";
import { MentalModelDetail } from "~/features/mental-models/components/mental-model-detail";
import type { MentalModelModel } from "~/features/mental-models/api/model";
import { MentalModelDeleteModal } from "~/features/mental-models/components/mental-model-delete-modal";
import { MentalModelTableBody } from "~/features/mental-models/components/mental-model-table-body";
import { useMentalModelTable } from "~/features/mental-models/hooks/use-mental-model-table";

type MentalModelTableProps = {
  data: MentalModelModel.response[];
  onEdit: (mentalModel: MentalModelModel.response) => void;
  onDelete: (id: MentalModelModel.response["id"]) => void;
};

export function MentalModelTable({ data, onEdit, onDelete }: MentalModelTableProps) {
  const {
    columns,
    table,
    globalFilter,
    detailModalOpened,
    deleteModalOpened,
    detailModalData,
    handleCloseDetail,
    handleCloseDelete,
    handleConfirmDelete,
  } = useMentalModelTable({ data, onEdit, onDelete });

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
