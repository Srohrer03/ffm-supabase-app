import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PMTemplateForm = ({ template, sites, users, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'MONTHLY',
    priority: 'MEDIUM',
    siteId: '',
    areaId: '',
    assetId: '',
    assignedToId: ''
  });

  const [areas, setAreas] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title || '',
        description: template.description || '',
        frequency: template.frequency || 'MONTHLY',
        priority: template.priority || 'MEDIUM',
        siteId: template.siteId || '',
        areaId: template.areaId || '',
        assetId: template.assetId || '',
        assignedToId: template.assignedToId || ''
      });
    }
  }, [template]);

  useEffect(() => {
    if (formData.siteId) {
      const selectedSite = sites.find(site => site.id === formData.siteId);
      if (selectedSite?.buildings) {
        const allAreas = selectedSite.buildings.flatMap(building => 
          building.areas?.map(area => ({ ...area, buildingName: building.name })) || []
        );
        setAreas(allAreas);
      }
    } else {
      setAreas([]);
      setAssets([]);
    }
  }, [formData.siteId, sites]);

  useEffect(() => {
    if (formData.areaId) {
      const selectedArea = areas.find(area => area.id === formData.areaId);
      setAssets(selectedArea?.assets || []);
    } else {
      setAssets([]);
    }
  }, [formData.areaId, areas]);

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
              {template ? 'Edit PM Template' : 'New PM Template'}
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
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cfs-blue focus:border-transparent"
                placeholder="Enter PM template title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cfs-blue focus:border-transparent"
                placeholder="Enter detailed description of the maintenance task"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency *
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cfs-blue focus:border-transparent"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="SEMI_ANNUAL">Semi-Annual</option>
                <option value="ANNUAL">Annual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cfs-blue focus:border-transparent"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site *
              </label>
              <select
                name="siteId"
                value={formData.siteId}
                onChange={handleChange}
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
                Area
              </label>
              <select
                name="areaId"
                value={formData.areaId}
                onChange={handleChange}
                disabled={!formData.siteId}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cfs-blue focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Select an area (optional)</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>
                    {area.buildingName} - {area.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset
              </label>
              <select
                name="assetId"
                value={formData.assetId}
                onChange={handleChange}
                disabled={!formData.areaId}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cfs-blue focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Select an asset (optional)</option>
                {assets.map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned To
              </label>
              <select
                name="assignedToId"
                value={formData.assignedToId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cfs-blue focus:border-transparent"
              >
                <option value="">Select assignee (optional)</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
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
              {isLoading ? 'Saving...' : (template ? 'Update Template' : 'Create Template')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PMTemplateForm;