export default function SiteLoading() {
  return (
    <div className="min-h-[60vh] bg-espresso-900">
      <div className="container-main py-16 space-y-8">
        <div className="h-10 w-64 rounded-xl bg-coffee-200 animate-pulse" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-40 rounded-2xl bg-espresso-800 border border-espresso-600 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
