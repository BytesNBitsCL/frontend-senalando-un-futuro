import { OnlyTableProp } from '@/interfaces/dataTableProps'
import { Button } from "@/components/ui/button";

export default function PaginationBtns<TData>({table}:OnlyTableProp<TData>) {
    return (
        <div className="space-x-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Anterior
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Siguiente
            </Button>
        </div>
    )
}