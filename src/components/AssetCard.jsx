import React from 'react';
import { Wrench, Calendar, AlertCircle, CheckCircle, Clock, Eye, Edit, Trash2 } from 'lucide-react';

const AssetCard = ({ asset, onView, onEdit, onDelete }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'MAINTENANCE': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'INACTIVE': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'RETIRED': return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'INACTIVE': return 'bg-red-100 text-red-800 border-red-200';
      case 'RETIRED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{asset.name}</h3>
          <div className="flex items-center mb-2">
            {getStatusIcon(asset.status)}
            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(asset.status)}`}>
              {asset.status}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        {asset.serialNumber && (
          <div className="flex items-center">
            <span className="font-medium w-20">Serial:</span>
            <span>{asset.serialNumber}</span>
          </div>
        )}
        {asset.model && (
          <div className="flex items-center">
            <span className="font-medium w-20">Model:</span>
            <span>{asset.model}</span>
          </div>
        )}
        {asset.manufacturer && (
          <div className="flex items-center">
            <span className="font-medium w-20">Mfg:</span>
            <span>{asset.manufacturer}</span>
          </div>
        )}
        {asset.installDate && (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-cfs-blue" />
            <span>Installed: {formatDate(asset.installDate)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {asset.area?.name && `Area: ${asset.area.name}`}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(asset)}
            className="text-cfs-blue hover:text-cfs-dark p-1 rounded hover:bg-cfs-blue/10 transition-colors duration-150"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(asset)}
            className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100 transition-colors duration-150"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(asset)}
            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-150"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;