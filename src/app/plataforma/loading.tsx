export default function PlataformaLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg bg-storm-foam animate-pulse" />
          <div className="h-4 w-72 rounded bg-storm-foam/60 animate-pulse" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-storm-foam animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-storm-foam">
            <div className="h-4 w-32 rounded bg-storm-foam/60 animate-pulse mb-3" />
            <div className="h-8 w-24 rounded bg-storm-foam animate-pulse" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-6 border border-storm-foam">
        <div className="h-6 w-64 rounded bg-storm-foam animate-pulse mb-4" />
        <div className="h-72 rounded-xl bg-storm-paper/60 animate-pulse" />
      </div>
    </div>
  )
}
