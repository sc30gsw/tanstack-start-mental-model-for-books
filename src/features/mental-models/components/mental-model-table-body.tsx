import { memo } from "react";
import { flexRender, type Table as TanStackTable } from "@tanstack/react-table";
import { Table, Text } from "@mantine/core";
import type { MentalModelModel } from "~/features/mental-models/api/model";
import type { MentalModelSearchParams } from "~/features/mental-models/types/schemas/search-params/search-schema";

type MentalModelTableBodyProps = {
  table: TanStackTable<MentalModelModel.response>;
  columnsCount: number;
  globalFilter: MentalModelSearchParams["search"];
  onRowClick?: (mentalModel: MentalModelModel.response) => void;
};

export const MentalModelTableBody = memo(function MentalModelTableBody({
  table,
  columnsCount,
  globalFilter,
  onRowClick,
}: MentalModelTableBodyProps) {
  return (
    <Table.Tbody>
      {table.getRowModel().rows.length === 0 ? (
        <Table.Tr>
          <Table.Td colSpan={columnsCount} style={{ textAlign: "center", padding: "2rem" }}>
            <Text c="dimmed">
              {globalFilter || table.getColumn("status")?.getFilterValue()
                ? "条件に一致するメンタルモデルがありません"
                : "メンタルモデルがありません。新規作成してください。"}
            </Text>
          </Table.Td>
        </Table.Tr>
      ) : (
        table.getRowModel().rows.map((row) => (
          <Table.Tr
            key={row.id}
            style={{ cursor: onRowClick ? "pointer" : "default" }}
            onClick={() => onRowClick?.(row.original)}
          >
            {row.getVisibleCells().map((cell) => {
              const isThumbnail = cell.column.id === "thumbnail";
              return (
                <Table.Td key={cell.id} style={isThumbnail ? {} : { whiteSpace: "nowrap" }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Td>
              );
            })}
          </Table.Tr>
        ))
      )}
    </Table.Tbody>
  );
});
