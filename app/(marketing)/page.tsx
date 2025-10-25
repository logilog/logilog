export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-8 space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">PolicyCompare AI</h1>
        <p className="text-lg text-muted-foreground">
          Poliçeleri yükleyin, yapay zekâ teminat ve istisnaları çıkarsın, saniyeler içinde karşılaştırma raporu oluşturun.
        </p>
        <div className="flex flex-wrap gap-3">
          <a className="rounded-lg border px-4 py-2 font-medium" href="/signup">Hemen Başlayın</a>
          <a className="rounded-lg border px-4 py-2 font-medium" href="/contact">Satışla İletişime Geçin</a>
        </div>
      </section>
      <section className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 rounded-2xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold">1 Gün Ücretsiz Deneme</h2>
          <p className="text-sm text-muted-foreground">
            Tüm özellikleri risk almadan deneyin. Süre sonunda abonelik otomatik başlar, dilediğiniz zaman iptal edin.
          </p>
        </div>
        <div className="space-y-2 rounded-2xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Kurumsal</h2>
          <p className="text-sm text-muted-foreground">
            Sınırsız ekip üyesi, RBAC ve özel SLA içeren planlar için bizimle iletişime geçin.
          </p>
        </div>
      </section>
    </main>
  );
}
