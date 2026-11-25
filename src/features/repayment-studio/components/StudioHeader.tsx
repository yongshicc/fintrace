export function StudioHeader() {
  return (
    <header className="border-b border-slate-700/80">
      <div className="mx-auto flex min-h-16 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold tracking-[0.08em] text-white sm:text-2xl">
            FINTRACE
          </span>
          <span className="hidden h-7 w-px bg-emerald-300 sm:block" />
          <span className="hidden text-sm text-slate-300 sm:block">
            Jede Zahl hat einen Ursprung.
          </span>
        </div>
        <span className="text-sm font-medium text-slate-300">
          Repayment Studio
        </span>
      </div>
    </header>
  );
}
