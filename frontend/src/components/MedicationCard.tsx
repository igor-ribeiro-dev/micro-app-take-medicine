import React from 'react';
import { Clock, Edit, Trash2, Send } from 'lucide-react';
import { Medication } from '../types/medication';

interface MedicationCardProps {
  medication: Medication;
  onEdit: (medication: Medication) => void;
  onDelete: (id: string) => void;
  onSendNotification: (medication: Medication) => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onEdit,
  onDelete,
  onSendNotification,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{medication.name}</h3>
            <p className="text-sm text-gray-600">{medication.dosage}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSendNotification(medication)}
              className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              title="Enviar notificação"
            >
              <Send className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => onEdit(medication)}
              className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              title="Editar medicamento"
            >
              <Edit className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => onDelete(medication.id)}
              className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              title="Excluir medicamento"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span className="font-medium">{medication.time}</span>
        </div>
      </div>
    </div>
  );
};