import { Button } from "@/app/components/ui/button";
import { formatNumberWithDots } from "@/app/lib/utils/extras";

const BudgetSummary = ({ total, onSaveClick }) => {
  return (
    <div className="flex items-center justify-between pt-2 mt-4 border-t gap-4">
      <span className="text-2xl font-bold">
        {total.dolares === 0
          ? `Total: $ ${formatNumberWithDots(total.pesos)}`
          : `Total: ARS $ ${formatNumberWithDots(
              total.pesos,
            )} | USD $ ${formatNumberWithDots(total.dolares)}`}{" "}
      </span>
      <Button onClick={onSaveClick} className="w-auto bg-blue-500 text-white hover:bg-blue-600">
        Guardar Presupuesto
      </Button>
    </div>
  );
};

export default BudgetSummary;
