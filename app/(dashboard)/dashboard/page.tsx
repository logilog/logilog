import CompareForm from "@/components/CompareForm";

export default function DashboardPage() {
  // TODO: gerçek organizationId kullanıcı oturumundan gelecek
  const organizationId = "demo-org";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Poliçe Karşılaştırma</h1>
        <p className="text-sm text-muted-foreground">
          İki veya daha fazla poliçe seçin, yapay zekâ farkları ve önerileri öne çıkarsın.
        </p>
      </header>
      <CompareForm organizationId={organizationId} />
    </div>
  );
}
