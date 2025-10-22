import React from 'react';
import { Building2, MapPin, Users, Wrench, Eye, Edit, Trash2 } from 'lucide-react';

const SiteCard = ({ site, onView, onEdit, onDelete }) => {
  const totalAssets = site.buildings?.reduce((total, building) => 
    total + (building.areas?.reduce((areaTotal, area) => 
      areaTotal + (area.assets?.length || 0), 0) || 0), 0) || 0;

  const totalAreas = site.buildings?.reduce((total, building) => 
    total + (building.areas?.length || 0), 0) || 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{site.name}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-2 text-cfs-blue" />
            <span>{site.city}, {site.state}</span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">{site.address}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Building2 className="h-4 w-4 text-cfs-blue mr-1" />
          </div>
          <p className="text-lg font-bold text-gray-900">{site.buildings?.length || 0}</p>
          <p className="text-xs text-gray-500">Buildings</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Users className="h-4 w-4 text-cfs-blue mr-1" />
          </div>
          <p className="text-lg font-bold text-gray-900">{totalAreas}</p>
          <p className="text-xs text-gray-500">Areas</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Wrench className="h-4 w-4 text-cfs-blue mr-1" />
          </div>
          <p className="text-lg font-bold text-gray-900">{totalAssets}</p>
          <p className="text-xs text-gray-500">Assets</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {site.zip}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(site)}
            className="text-cfs-blue hover:text-cfs-dark p-1 rounded hover:bg-cfs-blue/10 transition-colors duration-150"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(site)}
            className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100 transition-colors duration-150"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(site)}
            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-150"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteCard;