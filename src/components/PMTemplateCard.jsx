import React from 'react';
import { Calendar, Clock, User, Building2, Wrench, AlertTriangle } from 'lucide-react';

const PMTemplateCard = ({ template, onView, onEdit, onDelete }) => {
  const getFrequencyColor = (frequency) => {
    switch (frequency) {
      case 'DAILY': return 'bg-red-100 text-red-800';
      case 'WEEKLY': return 'bg-orange-100 text-orange-800';
      case 'MONTHLY': return 'bg-blue-100 text-blue-800';
      case 'QUARTERLY': return 'bg-green-100 text-green-800';
      case 'SEMI_ANNUAL': return 'bg-purple-100 text-purple-800';
      case 'ANNUAL': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'EMERGENCY': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFrequencyColor(template.frequency)}`}>
            {template.frequency}
          </span>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(template.priority)}`}>
            {template.priority}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Building2 className="h-4 w-4 mr-2 text-cfs-blue" />
          {template.site?.name}
        </div>
        {template.area && (
          <div className="flex items-center text-sm text-gray-600">
            <Wrench className="h-4 w-4 mr-2 text-cfs-blue" />
            {template.area.name}
          </div>
        )}
        {template.assignedTo && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2 text-cfs-blue" />
            {template.assignedTo.name}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          {template._count?.occurrences || 0} occurrences
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(template)}
            className="text-cfs-blue hover:text-cfs-dark p-1 rounded hover:bg-cfs-blue/10 transition-colors duration-150"
          >
            <Clock className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(template)}
            className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100 transition-colors duration-150"
          >
            <Wrench className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(template)}
            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-150"
          >
            <AlertTriangle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PMTemplateCard;