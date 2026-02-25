export default function CountrySkeleton() {
  return (
    <div className="bg-[#0a1628] border border-[rgba(212,168,67,0.15)] rounded-2xl overflow-hidden">
      {/* Flag placeholder */}
      <div className="shimmer h-44 w-full" />

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Country name */}
        <div className="shimmer h-6 w-3/4 rounded-md" />

        {/* Capital */}
        <div className="shimmer h-4 w-1/2 rounded-md" />

        {/* Divider */}
        <div className="border-t border-[rgba(212,168,67,0.1)] pt-3 space-y-2">
          <div className="shimmer h-3 w-2/3 rounded-md" />
          <div className="shimmer h-3 w-1/2 rounded-md" />
          <div className="shimmer h-3 w-3/5 rounded-md" />
        </div>
      </div>
    </div>
  )
}
