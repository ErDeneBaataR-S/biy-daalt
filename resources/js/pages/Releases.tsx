import AppLayout from "@/layouts/app-layout";
import { useState, useEffect } from "react";

export default function Releases() {
const [releases, setReleases] = useState<any[]>([]);
const [newVersion, setNewVersion] = useState("");

// LOAD
useEffect(() => {
const data = localStorage.getItem("releases");
if (data) {
setReleases(JSON.parse(data));
} else {
setReleases([
{
id: Date.now(),
version: "v1.0",
date: "2026-04-01",
features: ["Login system", "Dashboard", "Feedback module"],
},
]);
}
}, []);

// SAVE
useEffect(() => {
localStorage.setItem("releases", JSON.stringify(releases));
}, [releases]);

// ADD RELEASE
const addRelease = () => {
if (!newVersion) return;
setReleases([
  ...releases,
  {
    id: Date.now(),
    version: newVersion,
    date: new Date().toISOString().split("T")[0],
    features: [],
  },
]);

setNewVersion("");
};

// DELETE RELEASE
const deleteRelease = (id: number) => {
setReleases(releases.filter((r) => r.id !== id));
};

// ADD FEATURE
const addFeature = (id: number) => {
const text = prompt("Feature name?");
if (!text) return;
setReleases(
  releases.map((r) =>
    r.id === id
      ? { ...r, features: [...r.features, text] }
      : r
  )
);
};

return ( <AppLayout> <div className="p-6">
    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Releases</h1>

      <div className="flex gap-2">
        <input
          value={newVersion}
          onChange={(e) => setNewVersion(e.target.value)}
          placeholder="v1.1"
          className="border p-2 rounded"
        />

        <button
          onClick={addRelease}
          className="bg-blue-500 text-white px-4 rounded"
        >
          + Add
        </button>
      </div>
    </div>

    {/* EMPTY */}
    {releases.length === 0 ? (
      <div className="text-center text-gray-400 mt-20">
        No releases yet 
      </div>
    ) : (
      <div className="space-y-6">
        {releases.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl shadow-sm p-5"
          >
            <div className="flex justify-between mb-3">
              <h2 className="font-semibold text-lg">{r.version}</h2>

              <div className="flex gap-3 items-center">
                <span className="text-sm text-gray-400">
                  {r.date}
                </span>

                <button
                  onClick={() => deleteRelease(r.id)}
                  className="text-red-500"
                >
                  🗑
                </button>
              </div>
            </div>

            {/* FEATURES */}
            <ul className="space-y-1 text-sm">
              {r.features.length === 0 ? (
                <li className="text-gray-400">No features yet</li>
              ) : (
                r.features.map((f: string, i: number) => (
                  <li key={i}>• {f}</li>
                ))
              )}
            </ul>

            {/* ADD FEATURE */}
            <button
              onClick={() => addFeature(r.id)}
              className="mt-3 text-xs bg-blue-100 px-2 py-1 rounded"
            >
              + Add feature
            </button>

          </div>
        ))}
      </div>
    )}

  </div>
</AppLayout>
);
}
