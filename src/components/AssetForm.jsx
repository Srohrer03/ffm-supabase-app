import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AssetForm = ({ asset, sites, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    areaId: '',
    serialNumber: '',
    model: '',
    manufacturer: '',
    installDate: '',
    status: 'ACTIVE'
  });

  const [areas, setAreas] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState('');

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || '',
        areaId: asset.areaId || '',
        serialNumber: asset.serialNumber || '',
        model: asset.model || '',
        manufacturer: asset.manufacturer || '',
        installDate: asset.installDate ? asset.installDate.split('T')[0] : '',
        status: asset.status || 'ACTIVE'
      });
      
      // Find the site that contains this asset's area
      if (asset.area) {
        const site = sites.find(s => 
          s.buildings?.some(b => 
            b.areas?.some(a => a.id === asset.areaId)
          )
        );
        if (site) {
          setSelectedSiteId(site.id);
          updateAreasForSite(site.id);
        }
      }
    }
  }, [asset, sites]);

  const updateAreasForSite = (siteId) => {
    if (siteId) {
      const selectedSite = sites.find(site => site.id === siteId);
      if (selectedSite?.buildings) {
        const allAreas = selectedSite.buildings.flatMap(building => 
          building.areas?.map(area => ({ 
            ...area, 
            buildingName: building.name 
          })) || []
        );
        setAreas(allAreas);
      }
    } else {
      setAreas([]);
    }
  };

  const handleSiteChange = (e) => {
    const siteId = e.target.value;
    setSelectedSiteId(siteId);
    setFormData(prev => ({ ...prev, areaId: '' }));
    updateAreasForSite(siteId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {asset ? 'Edit Asset' : 'New Asset'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cfs-blue focus:border-transparent"
                placeholder="Enter asset name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site *
              </label>
              <select
                value={selectedSiteId}
                onChange={handleSiteChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cfs-blue focus:border-transparent"
              >
                <option value="">Select a site</option>
                {sites.map(site => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area *
              </label>
              <select
                name="areaId"
                value={formData.areaId}
                onChange={handleChange}
                required
                disabled={!selectedSiteId}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cfs-blue focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Select an area</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>
                    {area.buildingName} - {area.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial Number
              </label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cfs-blue focus:border-transparent"
                placeholder="Enter serial number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cfs-blue focus:border-transparent"
                placeholder="Enter model"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturer
              </label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cfs-blue focus:border-transparent"
                placeholder="Enter manufacturer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Install Date
              </label>
              <input
                type="date"
                name="installDate"
                value={formData.installDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cfs-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cfs-blue focus:border-transparent"
              >
                <option value="ACTIVE">Active</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="INACTIVE">Inactive</option>
                <option value="RETIRED">Retired</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-cfs-blue rounded-lg hover:bg-cfs-dark transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : (asset ? 'Update Asset' : 'Create Asset')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetForm;