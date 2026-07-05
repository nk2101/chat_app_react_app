const HomePage = () => {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 shadow-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Production-ready frontend foundation
          </p>
          <h1 className="text-4xl font-semibold sm:text-5xl">
            Build a scalable real-time chat experience with a clean architecture.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            This step establishes the Vite + TypeScript shell, reusable routing setup,
            and state management foundation that the chat modules will build on.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Routing</h2>
            <p className="mt-3 text-sm text-slate-400">
              React Router is ready for protected auth and chat screens.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">State</h2>
            <p className="mt-3 text-sm text-slate-400">
              Redux Toolkit with persistence is wired for future auth and chat slices.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">UI</h2>
            <p className="mt-3 text-sm text-slate-400">
              Tailwind CSS gives us a production-friendly design foundation.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
