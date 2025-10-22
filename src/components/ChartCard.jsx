export default function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 leading-normal pb-1">{title}</h3>
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
}