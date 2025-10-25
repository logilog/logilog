const tiers = [
  {
    name: "Starter",
    price: "₺X/ay",
    description: "1 ekip, sınırlı kullanım. 1 günlük ücretsiz deneme.",
    cta: "Başlayın",
    href: "/signup",
  },
  {
    name: "Pro",
    price: "₺Y/ay",
    description: "5 ekip, gelişmiş raporlar ve kullanım kotaları.",
    cta: "Demo Talep Et",
    href: "/contact",
  },
];

export default function Pricing() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {tiers.map((tier) => (
        <div key={tier.name} className="space-y-3 rounded-2xl border p-6 shadow-sm">
          <h3 className="text-lg font-semibold">{tier.name}</h3>
          <p className="text-3xl font-bold">{tier.price}</p>
          <p className="text-sm text-muted-foreground">{tier.description}</p>
          <a className="inline-block rounded-lg border px-4 py-2 text-sm font-medium" href={tier.href}>
            {tier.cta}
          </a>
        </div>
      ))}
    </div>
  );
}
