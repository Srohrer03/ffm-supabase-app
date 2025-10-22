import React, { useState } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle, User, Building2 } from 'lucide-react';
import pmData from '../data/pm.json';
import PageHeader from '../components/PageHeader';

const PMCalendar = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPM, setSelectedPM] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredPM = pmData.filter(pm => {
    if (selectedFilter === 'all') return true;
    return pm.status === selectedFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Scheduled': return <Clock className="h-4 w-4 text-cfs-blue" />;
      case 'Overdue': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-cfs-blue border-blue-200';
      case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'On Hold': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'HVAC': return 'bg-blue-50 text-blue-700';
      case 'Safety': return 'bg-red-50 text-red-700';
      case 'Equipment': return 'bg-yellow-50 text-yellow-700';
      case 'Security': return 'bg-purple-50 text-purple-700';
      case 'Grounds': return 'bg-green-50 text-green-700';
      case 'Electrical': return 'bg-orange-50 text-orange-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const handleViewPM = (pm) => {
    setSelectedPM(pm);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPM(null);
  };

  const PMModal = () => {
    if (!showModal || !selectedPM) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                PM Task Details - {selectedPM.id}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-sm text-gray-900">{selectedPM.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facility</label>
                <p className="text-sm text-gray-900">{selectedPM.facility}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(selectedPM.category)}`}>
                  {selectedPM.category}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedPM.status)}`}>
                  {selectedPM.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <p className="text-sm text-gray-900">{selectedPM.frequency}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <p className="text-sm text-gray-900">{selectedPM.assignedTo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Completed</label>
                <p className="text-sm text-gray-900">{selectedPM.lastCompleted}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Due</label>
                <p className="text-sm text-gray-900">{selectedPM.nextDue}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                <p className="text-sm text-gray-900">{selectedPM.estimatedHours}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                <p className="text-sm text-gray-900">${selectedPM.cost.toFixed(2)}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <p className="text-sm text-gray-900">{selectedPM.notes}</p>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Close
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Preventive Maintenance Calendar"
        subtitle="Schedule and track preventive maintenance tasks"
      />

      {/* Filter Tabs */}
      <div className="bg-neutral-card rounded-xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-100">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {['all', 'Scheduled', 'Overdue', 'On Hold'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 leading-normal ${
                  selectedFilter === filter
                    ? 'border-cfs-blue text-cfs-blue'
                    : 'border-transparent text-neutral-text-secondary hover:text-neutral-text-primary hover:border-gray-300'
                }`}
              >
                {filter === 'all' ? 'All Tasks' : filter}
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  selectedFilter === filter ? 'bg-cfs-blue/10 text-cfs-blue' : 'bg-gray-100 text-neutral-text-secondary'
                }`}>
                  {filter === 'all' ? pmData.length : pmData.filter(pm => pm.status === filter).length}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPM.map((pm) => (
              <div
                key={pm.id}
                className="bg-neutral-card border border-gray-100 rounded-xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-gray-50/30"
                onClick={() => handleViewPM(pm)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    {getStatusIcon(pm.status)}
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(pm.status)}`}>
                      {pm.status}
                    </span>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(pm.category)}`}>
                    {pm.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-neutral-text-primary mb-3 leading-normal pb-1">{pm.title}</h3>
                
                <div className="space-y-2 text-sm text-neutral-text-secondary">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-cfs-blue" />
                    {pm.facility}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-cfs-blue" />
                    {pm.assignedTo}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-cfs-blue" />
                    Due: {pm.nextDue}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-text-secondary leading-normal">Frequency: {pm.frequency}</span>
                    <span className="font-medium text-neutral-text-primary leading-normal pb-1">${pm.cost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPM.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-neutral-text-secondary mx-auto mb-4" />
              <div className="text-neutral-text-secondary leading-normal">No PM tasks found for the selected filter.</div>
            </div>
          )}
        </div>
      </div>

      <PMModal />
    </div>
  );
};

export default PMCalendar;