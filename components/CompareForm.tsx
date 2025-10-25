"use client";

import { useState } from "react";

export default function CompareForm({ organizationId }: { organizationId: string }) {
  const [ids, setIds] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCompare() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId, policyIds: ids.filter(Boolean) }),
      });

      if (response.status === 402) {
        window.location.href = "/billing";
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error ?? "Comparison failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Poliçe Kimlikleri</span>
        <input
          className="w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="policy-1, policy-2"
          onChange={(event) => {
            setIds(event.target.value.split(",").map((value) => value.trim()));
          }}
        />
      </label>
      <button
        type="button"
        onClick={handleCompare}
        disabled={loading || ids.filter(Boolean).length < 2}
        className="rounded-lg border bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Karşılaştırılıyor..." : "Karşılaştır"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && (
        <pre className="max-h-96 overflow-auto rounded-lg bg-gray-950/90 p-4 text-xs text-lime-200">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
