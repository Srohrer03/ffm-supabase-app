import { useMemo, useState } from "react";
import sites from "../data/properties.json";
import KPIcard from "../components/KPIcard";
import PropertyCard from "../components/PropertyCard";
import PageHeader from "../components/PageHeader";
import { ClipboardCheck, CheckCircle, AlertTriangle, BarChart3, ShieldAlert, BadgeDollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

const currency = (n) => `$${n.toLocaleString()}`;

export default function Dashboard() {
  const [selectedId, setSelectedId] = useState(null);
  const selected = useMemo(() => sites.find(s => s.id === selectedId) || null, [selectedId]);

  // Augment sites with properties expected by PropertyCard
  const augmentedSites = useMemo(() => {
    return sites.map(site => ({
      ...site,
      // Map existing properties to PropertyCard expectations
      squareFootage: site.sqft,
      pmCompliance: site.kpis.pmCompliance,
      openWorkOrders: site.kpis.openWorkOrders,
      maintenanceSpendYTD: site.kpis.maintenanceCostYTD,
      safetyIncidentsYTD: site.kpis.safetyIncidentsYTD,
      manager: `${site.region} Manager`
    }));
  }, []);

  // Aggregated owner-occupier KPIs
  const agg = useMemo(() => {
    const k = sites.map(s => s.kpis);
    const sum = (f) => k.reduce((acc, v) => acc + v[f], 0);
    const avg = (f) => Math.round(k.reduce((acc, v) => acc + v[f], 0) / k.length);
    return {
      openWorkOrders: sum("openWorkOrders"),
      closedMTD: sum("closedMTD"),
      pmCompliance: avg("pmCompliance"),
      reactivePct: avg("reactivePct"),
      safetyIncidentsYTD: sum("safetyIncidentsYTD"),
      maintenanceCostYTD: sum("maintenanceCostYTD"),
      criticalOutagesMTD: sum("criticalOutagesMTD")
    };
  }, []);

  const view = selected ? selected.kpis : agg;
  const headerTitle = selected ? selected.name : "All Facilities";

  // Charts data
  const statusPie = [
    { name: "Open", value: view.openWorkOrders, color: "#FACC15" },
    { name: "Closed MTD", value: view.closedMTD, color: "#16A34A" }
  ];

  const costTrend = (selected ? selected.monthlyCosts : mergeMonthly(sites)).map(m => ({ ...m }));
  const woBySite = sites.map(s => ({ site: shortName(s.name), open: s.kpis.openWorkOrders }));

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Clean Header with Better Typography */}
      <PageHeader
        title="CFS Facilities Dashboard"
        subtitle={`Owner-occupied sites • ${headerTitle}`}
      />

      {/* Top: Facility selector */}
      <div className="max-w-7xl mx-auto px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: KPI grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            <KPIcard title="Open Work Orders" value={view.openWorkOrders} sub="Active across facilities" Icon={AlertTriangle} accentBg="bg-amber-100" accentText="text-amber-700" />
            <KPIcard title="Closed MTD" value={view.closedMTD} sub="Month-to-date closures" Icon={CheckCircle} accentBg="bg-green-100" accentText="text-green-700" />
            <KPIcard title="PM Compliance" value={`${view.pmCompliance}%`} sub="Scheduled tasks on-time" Icon={BarChart3} accentBg="bg-blue-100" accentText="text-blue-700" />
            <KPIcard title="Reactive Work %" value={`${view.reactivePct}%`} sub="Lower is better" Icon={ClipboardCheck} accentBg="bg-slate-100" accentText="text-slate-700" />
            <KPIcard title="Safety Incidents YTD" value={view.safetyIncidentsYTD} sub="Reported facility incidents" Icon={ShieldAlert} accentBg="bg-red-100" accentText="text-red-700" />
            <KPIcard title="Maintenance Cost YTD" value={currency(view.maintenanceCostYTD)} sub="All facility O&M" Icon={BadgeDollarSign} accentBg="bg-emerald-100" accentText="text-emerald-700" />
            <KPIcard title="YTD Spend vs Budget" value="$748K / $900K" sub="83% of annual budget" Icon={BadgeDollarSign} accentBg="bg-emerald-100" accentText="text-emerald-700" />
            <KPIcard title="MTD Variance" value="-$22K" sub="Under budget this month" Icon={BarChart3} accentBg="bg-purple-100" accentText="text-purple-700" />
            <KPIcard title="Cost per SqFt (YTD)" value="$2.45" sub="Across 525,000 sqft" Icon={ClipboardCheck} accentBg="bg-slate-100" accentText="text-slate-700" />
          </div>

          {/* Right: Site dropdown */}
          <div className="w-full lg:w-80 bg-white rounded-xl shadow-md p-6 h-fit">
            <label className="text-sm text-gray-600">View by Facility</label>
            <select
              className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EC1E4]"
              value={selectedId || ""}
              onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">All Facilities</option>
              {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            {/* Quick summary */}
            <div className="mt-4 text-sm text-gray-700">
              {selected ? (
                <>
                  <p>{selected.siteType} • {selected.region}</p>
                  <p>{selected.sqft.toLocaleString()} sqft • {selected.costCenter}</p>
                </>
              ) : (
                <p>{sites.length} facilities selected</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Property overview tiles */}
      <div className="px-8 pt-6">
        <h3 className="text-xl font-semibold text-[#0A2540] mb-4">Facilities Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {augmentedSites.map(site => (
            <PropertyCard key={site.id} property={site} onSelect={(s) => setSelectedId(s.id)} />
          ))}
        </div>
      </div>

      {/* Bottom: Charts + Feeds */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-8 py-8">
        {/* Status Pie */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-[#0A2540] mb-4">Work Orders (Open vs Closed MTD)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusPie} dataKey="value" nameKey="name" outerRadius={85} label>
                {statusPie.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Open WOs by Site */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-[#0A2540] mb-4">Open Work Orders by Facility</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={woBySite}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="site" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="open" fill="#0057B8" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Trend */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-[#0A2540] mb-4">Maintenance Cost Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={costTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => currency(v)} />
              <Line type="monotone" dataKey="cost" stroke="#0A2540" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Feeds */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-[#0A2540] mb-4">Recent Activity</h3>
          <ul className="space-y-2">
            {(selected ? selected.recentActivity : flattenRecent(sites)).slice(0,6).map((a, i) => (
              <li key={i} className="text-sm text-gray-700">• {a}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-[#0A2540] mb-4">Upcoming Preventive Maintenance</h3>
          <ul className="space-y-2">
            {(selected ? selected.upcomingPM : flattenPM(sites)).slice(0,6).map((t, i) => (
              <li key={i} className="flex justify-between text-sm text-gray-700">
                <span>{t.task}</span><span className="text-gray-500">{t.due}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// helpers
function shortName(n) {
  return n.replace("CFS ", "").replace(" – ", " ");
}
function mergeMonthly(list) {
  // Sum costs by month across sites for the "All Facilities" view
  const map = new Map();
  list.forEach(s => s.monthlyCosts.forEach(m => {
    map.set(m.month, (map.get(m.month) || 0) + m.cost);
  }));
  return Array.from(map.entries()).map(([month, cost]) => ({ month, cost }));
}
function flattenRecent(list) {
  return list.flatMap(s => s.recentActivity.map(a => `${s.name}: ${a}`));
}
function flattenPM(list) {
  return list.flatMap(s => s.upcomingPM.map(t => ({ task: `${s.name}: ${t.task}`, due: t.due })));
}