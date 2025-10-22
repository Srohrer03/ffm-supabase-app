import React, { useState } from 'react';
import { Search, Star, Phone, Mail, MapPin, Calendar, Award, Plus, Edit, Trash2 } from 'lucide-react';
import vendorsData from '../data/vendors.json';
import PageHeader from '../components/PageHeader';

const VendorPortal = () => {
  const [vendors, setVendors] = useState(vendorsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase())) ||
    vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (vendor) => {
    setSelectedVendor(vendor);
    setModalType('view');
    setShowModal(true);
  };

  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setModalType('edit');
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedVendor(null);
    setModalType('add');
    setShowModal(true);
  };

  const handleDelete = (vendor) => {
    if (window.confirm(`Are you sure you want to delete ${vendor.name}?`)) {
      setVendors(vendors.filter(v => v.id !== vendor.id));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVendor(null);
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 text-yellow-400 fill-current opacity-50" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const VendorModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalType === 'view' && selectedVendor?.name}
                {modalType === 'edit' && `Edit ${selectedVendor?.name}`}
                {modalType === 'add' && 'New Vendor'}
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
          
          <div className="p-6">
            {modalType === 'view' && selectedVendor && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                    <p className="text-sm text-gray-900">{selectedVendor.contactPerson}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex items-center">
                      {getRatingStars(selectedVendor.rating)}
                      <span className="ml-2 text-sm text-gray-600">({selectedVendor.rating})</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-sm text-gray-900">{selectedVendor.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-sm text-gray-900">{selectedVendor.email}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <p className="text-sm text-gray-900">{selectedVendor.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contract Period</label>
                    <p className="text-sm text-gray-900">{selectedVendor.contractStart} - {selectedVendor.contractEnd}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedVendor.status)}`}>
                      {selectedVendor.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedVendor.services.map((service, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedVendor.certifications.map((cert, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <p className="text-sm text-gray-900">{selectedVendor.notes}</p>
                </div>
              </div>
            )}
            
            {(modalType === 'edit' || modalType === 'add') && (
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                    <input
                      type="text"
                      defaultValue={selectedVendor?.name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                    <input
                      type="text"
                      defaultValue={selectedVendor?.contactPerson || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      defaultValue={selectedVendor?.phone || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={selectedVendor?.email || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      defaultValue={selectedVendor?.address || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      defaultValue={selectedVendor?.status || 'Active'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Pending</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <select
                      defaultValue={selectedVendor?.rating || '5'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="5">5 Stars</option>
                      <option value="4.5">4.5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3.5">3.5 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2.5">2.5 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1.5">1.5 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Services (comma-separated)</label>
                  <input
                    type="text"
                    defaultValue={selectedVendor?.services.join(', ') || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    defaultValue={selectedVendor?.notes || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-cfs-blue rounded-lg hover:bg-cfs-dark transition-colors duration-200"
                  >
                    {modalType === 'add' ? 'Add Vendor' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor Portal"
        subtitle="Manage vendor relationships and contracts"
      >
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-6 py-3 bg-white text-cfs-blue text-sm font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </button>
      </PageHeader>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              type="text"
              placeholder="Search vendors by name, services, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-cfs-light focus:border-transparent text-white placeholder-white/60 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} className="bg-neutral-card rounded-xl shadow-lg border border-cfs-light/30 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-white to-gray-50/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-text-primary mb-1 leading-normal pb-1">{vendor.name}</h3>
                <p className="text-sm text-neutral-text-secondary leading-normal">{vendor.contactPerson}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vendor.status)}`}>
                {vendor.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-neutral-text-secondary">
                <Phone className="h-4 w-4 mr-2 text-cfs-blue" />
                {vendor.phone}
              </div>
              <div className="flex items-center text-sm text-neutral-text-secondary">
                <Mail className="h-4 w-4 mr-2 text-cfs-blue" />
                {vendor.email}
              </div>
              <div className="flex items-start text-sm text-neutral-text-secondary">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-cfs-blue" />
                <span className="line-clamp-2">{vendor.address}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                {getRatingStars(vendor.rating)}
                <span className="ml-2 text-sm text-neutral-text-secondary leading-normal">({vendor.rating})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {vendor.services.slice(0, 3).map((service, index) => (
                  <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-cfs-blue/10 text-cfs-blue rounded-full">
                    {service}
                  </span>
                ))}
                {vendor.services.length > 3 && (
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-neutral-text-secondary rounded-full">
                    +{vendor.services.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center text-xs text-neutral-text-secondary">
                <Calendar className="h-3 w-3 mr-1 text-cfs-blue" />
                Contract: {vendor.contractEnd}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleView(vendor)}
                  className="text-cfs-blue hover:text-cfs-dark p-1 rounded hover:bg-cfs-blue/10 transition-colors duration-150"
                >
                  <Award className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEdit(vendor)}
                  className="text-neutral-text-secondary hover:text-neutral-text-primary p-1 rounded hover:bg-gray-100 transition-colors duration-150"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(vendor)}
                  className="text-status-danger hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors duration-150"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-neutral-text-secondary leading-normal">No vendors found matching your search criteria.</div>
        </div>
      )}

      <VendorModal />
    </div>
  );
};

export default VendorPortal;