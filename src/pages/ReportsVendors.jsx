import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const ReportsVendors = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState('');
  const [dateRange, setDateRange] = useState('6months');

  // Mock data for demonstration
  const mockData = {
    summary: {
      totalVendors: 12,
      activeAssignments: 28,
      avgCompletionRate: 89,
      avgResponseTime: 2.8
    },
    vendorPerformance: [
      { name: 'HVAC Solutions Inc', totalAssignments: 15, completedAssignments: 14, avgCompletionDays: 2.5, completionRate: 93, responseTime: 1.2 },
      { name: 'Facility Maintenance Pro', totalAssignments: 12, completedAssignments: 11, avgCompletionDays: 3.1, completionRate: 92, responseTime: 2.1 },
      { name: 'ElectriCorp Services', totalAssignments: 8, completedAssignments: 7, avgCompletionDays: 4.2, completionRate: 88, responseTime: 3.5 },
      { name: 'PlumbFix Solutions', totalAssignments: 10, completedAssignments: 8, avgCompletionDays: 3.8, completionRate: 80, responseTime: 2.8 },
      { name: 'SecureTech Systems', totalAssignments: 6, completedAssignments: 5, avgCompletionDays: 2.9, completionRate: 83, responseTime: 1.8 }
    ],
    assignmentTrend: [
      { month: 'Jul', assigned: 18, completed: 16, declined: 1 },
      { month: 'Aug', month: 'Aug', assigned: 22, completed: 19, declined: 2 },
      { month: 'Sep', assigned: 15, completed: 14, declined: 0 },
      { month: 'Oct', assigned: 25, completed: 22, declined: 1 },
      { month: 'Nov', assigned: 28, completed: 24, declined: 2 },
      { month: 'Dec', assigned: 20, completed: 18, declined: 1 }
    ],
    serviceCategories: [
      { category: 'HVAC', count: 35, avgRate: 92 },
      { category: 'Electrical', count: 28, avgRate: 88 },
      { category: 'Plumbing', count: 22, avgRate: 85 },
      { category: 'General Maintenance', count: 18, avgRate: 90 },
      { category: 'Security', count: 12, avgRate: 87 }
    ],
    responseTimeDistribution: [
      { range: '0-1 hours', count: 8 },
      { range: '1-2 hours', count: 12 },
      { range: '2-4 hours', count: 15 },
      { range: '4-8 hours', count: 8 },
      { range: '8+ hours', count: 3 }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedSite, dateRange]);

  const COLORS = {
    primary: '#0057B8',
    secondary: '#6EC1E4',
    success: '#16A34A',
    warning: '#FACC15',
    danger: '#DC2626',
    purple: '#8B5CF6',
    orange: '#F97316'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cfs-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Vendor Performance Report"
        subtitle="Analyze vendor efficiency and service quality"
      >
        <div className="flex gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-cfs-light focus:border-transparent text-white backdrop-blur-sm"
          >
            <option value="3months" style={{ backgroundColor: '#0057B8', color: 'white' }}>Last 3 Months</option>
            <option value="6months" style={{ backgroundColor: '#0057B8', color: 'white' }}>Last 6 Months</option>
            <option value="1year" style={{ backgroundColor: '#0057B8', color: 'white' }}>Last Year</option>
          </select>
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-cfs-light focus:border-transparent text-white backdrop-blur-sm"
          >
            <option value="" style={{ backgroundColor: '#0057B8', color: 'white' }}>All Sites</option>
            <option value="site-1" style={{ backgroundColor: '#0057B8', color: 'white' }}>Main Campus</option>
            <option value="site-2" style={{ backgroundColor: '#0057B8', color: 'white' }}>Warehouse Complex</option>
          </select>
        </div>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{data.summary.totalVendors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{data.summary.activeAssignments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.summary.avgCompletionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{data.summary.avgResponseTime}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Performance Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Completion Rate Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.vendorPerformance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
              <Bar dataKey="completionRate" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Assignment Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.assignmentTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="assigned" stroke={COLORS.primary} strokeWidth={2} name="Assigned" />
              <Line type="monotone" dataKey="completed" stroke={COLORS.success} strokeWidth={2} name="Completed" />
              <Line type="monotone" dataKey="declined" stroke={COLORS.danger} strokeWidth={2} name="Declined" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Service Categories */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.serviceCategories}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="count"
                nameKey="category"
                label={({ category, count }) => `${category}: ${count}`}
              >
                {data.serviceCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Performance Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Vendor Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Vendor</th>
                <th className="text-center py-3 px-4">Total Assignments</th>
                <th className="text-center py-3 px-4">Completed</th>
                <th className="text-center py-3 px-4">Completion Rate</th>
                <th className="text-center py-3 px-4">Avg Completion Time</th>
                <th className="text-center py-3 px-4">Response Time</th>
                <th className="text-center py-3 px-4">Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.vendorPerformance.map((vendor, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{vendor.name}</td>
                  <td className="text-center py-3 px-4">{vendor.totalAssignments}</td>
                  <td className="text-center py-3 px-4">{vendor.completedAssignments}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vendor.completionRate >= 90 ? 'bg-green-100 text-green-800' :
                      vendor.completionRate >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vendor.completionRate}%
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">{vendor.avgCompletionDays} days</td>
                  <td className="text-center py-3 px-4">{vendor.responseTime}h</td>
                  <td className="text-center py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vendor.completionRate >= 90 ? 'bg-green-100 text-green-800' :
                      vendor.completionRate >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vendor.completionRate >= 90 ? 'Excellent' :
                       vendor.completionRate >= 80 ? 'Good' : 'Fair'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Response Time Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.responseTimeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Category Performance</h3>
          <div className="space-y-4">
            {data.serviceCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{category.category}</span>
                  <p className="text-sm text-gray-600">{category.count} assignments</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  category.avgRate >= 90 ? 'bg-green-100 text-green-800' :
                  category.avgRate >= 80 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {category.avgRate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsVendors;