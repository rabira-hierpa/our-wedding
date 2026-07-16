"use client";

import { useCallback, useEffect, useState } from "react";

interface GuestRow {
  id: string;
  name: string;
  username: string | null;
  source: "telegram" | "web";
  registeredAt: string;
  photoCount: number;
  wishCount: number;
  likesGiven: number;
  inWeddingGroup: boolean;
  lastUploadAt: string | null;
}

type SortKey = "photos" | "wishes" | "registered" | "lastUpload";

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<GuestRow[]>([]);
  const [source, setSource] = useState("telegram");
  const [sort, setSort] = useState<SortKey>("photos");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        source,
        sort,
        order: "desc",
        page: String(page),
        pageSize: "25",
      });
      if (q.trim()) params.set("q", q.trim());

      const res = await fetch(`/api/admin/guests?${params}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setGuests(data.guests);
      setTotalPages(data.pagination.totalPages || 1);
      setTotal(data.pagination.total || 0);
      setError("");
    } catch {
      setError("Could not load guests");
    } finally {
      setLoading(false);
    }
  }, [source, sort, page, q]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-champagne-900">Guests</h2>
        <p className="text-sm text-champagne-600">
          {total} {source === "telegram" ? "telegram" : source} guests
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search name or username…"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          className="flex-1 px-4 py-2 rounded-lg border border-champagne-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
        />
        <select
          value={source}
          onChange={(e) => {
            setPage(1);
            setSource(e.target.value);
          }}
          className="px-4 py-2 rounded-lg border border-champagne-300 bg-white text-sm"
        >
          <option value="telegram">Telegram guests</option>
          <option value="web">Web visitors</option>
          <option value="all">All</option>
        </select>
        <select
          value={sort}
          onChange={(e) => {
            setPage(1);
            setSort(e.target.value as SortKey);
          }}
          className="px-4 py-2 rounded-lg border border-champagne-300 bg-white text-sm"
        >
          <option value="photos">Sort by photos</option>
          <option value="wishes">Sort by wishes</option>
          <option value="registered">Sort by registered</option>
          <option value="lastUpload">Sort by last upload</option>
        </select>
      </div>

      {error ? <p className="text-red-600">{error}</p> : null}

      <div className="bg-white border border-champagne-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-champagne-50 text-left text-champagne-600">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium text-right">Photos</th>
                <th className="px-4 py-3 font-medium text-right">Wishes</th>
                <th className="px-4 py-3 font-medium text-right">Likes</th>
                <th className="px-4 py-3 font-medium">In group</th>
                <th className="px-4 py-3 font-medium">Registered</th>
                <th className="px-4 py-3 font-medium">Last upload</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-champagne-600"
                  >
                    Loading…
                  </td>
                </tr>
              ) : guests.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-champagne-600"
                  >
                    No guests found
                  </td>
                </tr>
              ) : (
                guests.map((g) => (
                  <tr
                    key={g.id}
                    className="border-t border-champagne-100 hover:bg-champagne-50/50"
                  >
                    <td className="px-4 py-3 text-champagne-900 font-medium">
                      {g.name}
                      {g.source === "web" ? (
                        <span className="ml-2 text-xs text-champagne-500">
                          web
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-champagne-600">
                      {g.username ? `@${g.username}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gold-800">
                      {g.photoCount}
                    </td>
                    <td className="px-4 py-3 text-right">{g.wishCount}</td>
                    <td className="px-4 py-3 text-right">{g.likesGiven}</td>
                    <td className="px-4 py-3">
                      {g.inWeddingGroup ? (
                        <span className="text-green-700">Yes</span>
                      ) : (
                        <span className="text-champagne-400">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-champagne-600 whitespace-nowrap">
                      {new Date(g.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-champagne-600 whitespace-nowrap">
                      {g.lastUploadAt
                        ? new Date(g.lastUploadAt).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg border border-champagne-300 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-champagne-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg border border-champagne-300 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
