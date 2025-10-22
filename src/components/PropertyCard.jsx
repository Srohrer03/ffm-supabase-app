export default function PropertyCard({ property, onSelect }) {
  return (
    <div
      onClick={() => onSelect(property)}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-[1.02] cursor-pointer transition"
    >
      <h3 className="text-lg font-semibold text-[#0A2540] mb-2">
        {property.name}
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {property.squareFootage.toLocaleString()} sqft facility
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xl font-bold text-blue-700">
            {property.pmCompliance}%
          </p>
          <p className="text-xs text-gray-400">PM Compliance</p>
        </div>
        <div>
          <p className="text-xl font-bold text-amber-600">
            {property.openWorkOrders}
          </p>
          <p className="text-xs text-gray-400">Open WOs</p>
        </div>
        <div>
          <p className="text-xl font-bold text-green-700">
            ${property.maintenanceSpendYTD.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">YTD Spend</p>
        </div>
        <div>
          <p className="text-xl font-bold text-red-600">
            {property.safetyIncidentsYTD}
          </p>
          <p className="text-xs text-gray-400">Safety Incidents</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500">
          Manager: <span className="font-medium text-gray-700">{property.manager}</span>
        </p>
      </div>
    </div>
  );
}