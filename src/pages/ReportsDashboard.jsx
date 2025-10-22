import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Wrench, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import PageHeader from '../components/PageHeader';

const ReportsDashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [workOrderSummary, setWorkOrderSummary] = useState(null);
  const [pmCompliance, setPmCompliance] = useState(null);
  const [vendorPerformance, setVendorPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState('');

  // Mock data for demonstration
  const mockKpis = {
    workOrders: {
      total: 156,
      open: 23,
      completedThisMonth: 45,
      avgCompletionDays: 3.2
    },
    assets: {
      total: 89
    },
    vendors: {
      active: 12
    },
    pm: {
      complianceRate: 94
    }
  };

  const mockWorkOrderSummary = {
    summary: {
      total: 156,
      avgCompletionDays: 3.2
    },
    byStatus: [
      { status: 'OPEN', count: 23 },
      { status: 'IN_PROGRESS', count: 18 },
      { status: 'COMPLETED', count: 115 }
    ],
    byPriority: [
      { priority: 'HIGH', count: 12 },
      { priority: 'MEDIUM', count: 89 },
      { priority: 'LOW', count: 55 }
    ],
    monthlyTrend: [
      { month: 'Jul', count: 28 },
      { month: 'Aug', count: 32 },
      { month: 'Sep', count: 25 },
      { month: 'Oct', count: 38 },
      { month: 'Nov', count: 42 },
      { month: 'Dec', count: 35 }
    ]
  };

  const mockPmCompliance = {
    summary: {
      total: 78,
      completed: 73,
      complianceRate: 94,
      upcomingDue: 8
    },
    byStatus: [
      { status: 'COMPLETED', count: 73 },
      { status: 'PENDING', count: 5 }
    ]
  };

  const mockVendorPerformance = [
    { name: 'HVAC Solutions Inc', totalAssignments: 15, completedAssignments: 14, avgCompletionDays: 2.5, completionRate: 93 },
    { name: 'Facility Maintenance Pro', totalAssignments: 12, completedAssignments: 11, avgCompletionDays: 3.1, completionRate: 92 },
    { name: 'ElectriCorp Services', totalAssignments: 8, completedAssignments: 7, avgCompletionDays: 4.2, completionRate: 88 }
  ];

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setKpis(mockKpis);
      setWorkOrderSummary(mockWorkOrderSummary);
      setPmCompliance(mockPmCompliance);
      setVendorPerformance(mockVendorPerformance);
      setLoading(false);
    }, 1000);
  }, [selectedSite]);

  const COLORS = {
    primary: '#0057B8',
    secondary: '#6EC1E4',
    success: '#16A34A',
    warning: '#FACC15',
    danger: '#DC2626',
    gray: '#6B7280'
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
      <PageHeader
        title="Reports Dashboard"
        subtitle="Key performance indicators and analytics"
      >
        <select
          value={selectedSite}
          onChange={(e) => setSelectedSite(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-cfs-light focus:border-transparent text-white backdrop-blur-sm"
        >
          <option value="" style={{ backgroundColor: '#0057B8', color: 'white' }}>All Sites</option>
          <option value="site-1" style={{ backgroundColor: '#0057B8', color: 'white' }}>Main Campus</option>
          <option value="site-2" style={{ backgroundColor: '#0057B8', color: 'white' }}>Warehouse Complex</option>
        </select>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Work Orders</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.workOrders.total}</p>
              <p className="text-xs text-gray-500">{kpis.workOrders.open} currently open</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed This Month</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.workOrders.completedThisMonth}</p>
              <p className="text-xs text-gray-500">Avg {kpis.workOrders.avgCompletionDays} days to complete</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">PM Compliance</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.pm.complianceRate}%</p>
              <p className="text-xs text-gray-500">{pmCompliance.summary.upcomingDue} due soon</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.vendors.active}</p>
              <p className="text-xs text-gray-500">{kpis.assets.total} total assets</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work Order Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Orders by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={workOrderSummary.byStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
                nameKey="status"
              >
                {workOrderSummary.byStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.status === 'OPEN' ? COLORS.warning :
                    entry.status === 'IN_PROGRESS' ? COLORS.primary :
                    COLORS.success
                  } />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Work Order Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Orders Trend (6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={workOrderSummary.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke={COLORS.primary} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Orders by Priority</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workOrderSummary.byPriority}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vendor Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Vendor Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendorPerformance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
              <Bar dataKey="completionRate" fill={COLORS.success} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PM Compliance Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">PM Compliance Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-medium">Completed</span>
              </div>
              <span className="text-lg font-bold text-green-600">{pmCompliance.summary.completed}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="font-medium">Pending</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">
                {pmCompliance.summary.total - pmCompliance.summary.completed}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                <span className="font-medium">Due Soon</span>
              </div>
              <span className="text-lg font-bold text-orange-600">{pmCompliance.summary.upcomingDue}</span>
            </div>
          </div>
        </div>

        {/* Vendor Performance Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Performance Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Vendor</th>
                  <th className="text-center py-2">Assignments</th>
                  <th className="text-center py-2">Completion Rate</th>
                  <th className="text-center py-2">Avg Days</th>
                </tr>
              </thead>
              <tbody>
                {vendorPerformance.map((vendor, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 font-medium">{vendor.name}</td>
                    <td className="text-center py-2">{vendor.totalAssignments}</td>
                    <td className="text-center py-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        vendor.completionRate >= 90 ? 'bg-green-100 text-green-800' :
                        vendor.completionRate >= 80 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {vendor.completionRate}%
                      </span>
                    </td>
                    <td className="text-center py-2">{vendor.avgCompletionDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;