export default function Loading() {
  return (
    <div className="section-shell flex min-h-screen items-center justify-center">
      <div className="glass-card grid-pattern w-full max-w-xl rounded-[2rem] p-10 text-center">
        <div className="mx-auto size-14 animate-pulse rounded-2xl bg-primary/15" />
        <div className="mt-6 space-y-3">
          <div className="mx-auto h-4 w-48 animate-pulse rounded-full bg-primary/15" />
          <div className="mx-auto h-4 w-64 animate-pulse rounded-full bg-primary/10" />
        </div>
      </div>
    </div>
  )
}
