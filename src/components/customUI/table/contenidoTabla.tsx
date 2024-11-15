import {
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import { TableProps } from "@/interfaces/dataTableProps";
import { flexRender } from "@tanstack/react-table";

export default function ContenidoTabla<TData, TValue>({table, columns}:TableProps<TData, TValue>) {
    return (
        <TableBody className="text-center">
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="max-w-[600px] break-words">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        Sin resultados.
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    )
};