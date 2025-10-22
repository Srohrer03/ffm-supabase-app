import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, BarChart3, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const ReportsWorkOrders = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('6months');
  const [selectedSite, setSelectedSite] = useState('');

  // Mock data for demonstration
  const mockData = {
    summary: {
      total: 156,
      avgCompletionDays: 3.2,
      completionRate: 87
    },
    statusOverTime: [
      { month: 'Jul', open: 8, inProgress: 5, completed: 15, cancelled: 2 },
      { month: 'Aug', open: 12, inProgress: 8, completed: 18, cancelled: 1 },
      { month: 'Sep', open: 6, inProgress: 4, completed: 12, cancelled: 3 },
      { month: 'Oct', open: 15, inProgress: 12, completed: 22, cancelled: 1 },
      { month: 'Nov', open: 18, inProgress: 15, completed: 25, cancelled: 2 },
      { month: 'Dec', open: 11, inProgress: 8, completed: 20, cancelled: 1 }
    ],
    byPriority: [
      { priority: 'HIGH', count: 12, avgDays: 1.8 },
      { priority: 'MEDIUM', count: 89, avgDays: 3.2 },
      { priority: 'LOW', count: 55, avgDays: 5.1 }
    ],
    bySite: [
      { site: 'Main Campus', count: 68, completionRate: 92 },
      { site: 'Warehouse Complex', count: 52, completionRate: 85 },
      { site: 'Processing Facility', count: 36, completionRate: 78 }
    ],
    byCategory: [
      { category: 'HVAC', count: 45 },
      { category: 'Electrical', count: 32 },
      { category: 'Plumbing', count: 28 },
      { category: 'Equipment', count: 25 },
      { category: 'Safety', count: 15 },
      { category: 'Other', count: 11 }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, [dateRange, selectedSite]);

  const COLORS = {
    open: '#FACC15',
    inProgress: '#0057B8',
    completed: '#16A34A',
    cancelled: '#DC2626',
    high: '#DC2626',
    medium: '#FACC15',
    low: '#16A34A'
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
        title="Work Orders Report"
        subtitle="Detailed analysis of work order trends and performance"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Work Orders</p>
              <p className="text-2xl font-bold text-gray-900">{data.summary.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.summary.completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Completion Time</p>
              <p className="text-2xl font-bold text-gray-900">{data.summary.avgCompletionDays} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Over Time */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Order Status Over Time</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data.statusOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="open" stroke={COLORS.open} strokeWidth={2} name="Open" />
              <Line type="monotone" dataKey="inProgress" stroke={COLORS.inProgress} strokeWidth={2} name="In Progress" />
              <Line type="monotone" dataKey="completed" stroke={COLORS.completed} strokeWidth={2} name="Completed" />
              <Line type="monotone" dataKey="cancelled" stroke={COLORS.cancelled} strokeWidth={2} name="Cancelled" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* By Priority */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Orders by Priority</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.byPriority}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip formatter={(value, name) => [value, name === 'count' ? 'Count' : 'Avg Days']} />
              <Bar dataKey="count" fill={COLORS.inProgress} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By Category */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Orders by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.byCategory}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="count"
                nameKey="category"
                label={({ category, count }) => `${category}: ${count}`}
              >
                {data.byCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Site Performance Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Site</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Site</th>
                <th className="text-center py-3 px-4">Total Work Orders</th>
                <th className="text-center py-3 px-4">Completion Rate</th>
                <th className="text-center py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.bySite.map((site, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{site.site}</td>
                  <td className="text-center py-3 px-4">{site.count}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      site.completionRate >= 90 ? 'bg-green-100 text-green-800' :
                      site.completionRate >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {site.completionRate}%
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      site.completionRate >= 90 ? 'bg-green-100 text-green-800' :
                      site.completionRate >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {site.completionRate >= 90 ? 'Excellent' :
                       site.completionRate >= 80 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Priority Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.byPriority.map((priority, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  priority.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                  priority.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {priority.priority}
                </span>
                <span className="text-lg font-bold text-gray-900">{priority.count}</span>
              </div>
              <p className="text-sm text-gray-600">Avg completion: {priority.avgDays} days</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsWorkOrders;