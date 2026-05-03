export default function ProductCardSkeleton() {
  return (
    <article className="w-full lg:min-w-[260px] flex-shrink-0 h-full max-w-[280px] rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="aspect-[4/5] rounded-3xl bg-slate-200" />
      <div className="mt-4 flex h-full flex-col gap-3">
        <div className="h-5 w-24 rounded-full bg-slate-200" />
        <div className="h-4 w-full rounded-full bg-slate-200" />
        <div className="mt-auto grid gap-2">
          <div className="h-9 w-full rounded-2xl bg-slate-200" />
          <div className="h-9 w-full rounded-2xl bg-slate-200" />
        </div>
      </div>
    </article>
  );
}
