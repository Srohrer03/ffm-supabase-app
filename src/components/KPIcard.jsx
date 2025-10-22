export default function KPIcard({ title, value, sub, Icon, accentBg = "bg-blue-100", accentText = "text-blue-700" }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between hover:shadow-lg transition">
      <div className="pr-4">
        <h3 className="text-gray-500 text-sm leading-normal">{title}</h3>
        <p className="text-2xl font-bold text-[#0A2540] leading-normal">{value}</p>
        {sub ? <p className="text-xs text-gray-400 leading-normal">{sub}</p> : null}
      </div>
      <div className={`p-3 rounded-full ${accentBg}`}>
        {Icon ? <Icon className={`h-6 w-6 ${accentText}`} /> : null}
      </div>
    </div>
  );
}