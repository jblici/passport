import { Button } from "@/app/components/ui/button";
import { formatNumberWithDots } from "@/app/lib/utils/extras";
import { Save } from "lucide-react";

const BudgetSummary = ({ total, onSaveClick }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200 mt-6">
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">Presupuesto Total</p>
          <p className="text-3xl font-bold text-blue-600">
            {total.dolares === 0
              ? `$ ${formatNumberWithDots(total.pesos)}`
              : `ARS $ ${formatNumberWithDots(total.pesos)} | USD $ ${formatNumberWithDots(total.dolares)}`}
          </p>
          {total.dolares > 0 && (
            <p className="text-xs text-gray-500 mt-1">En pesos y dólares</p>
          )}
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onSaveClick}
          className="flex items-center gap-2"
        >
          <Save size={18} />
          Guardar Presupuesto
        </Button>
      </div>
    </div>
  );
};

export default BudgetSummary;
