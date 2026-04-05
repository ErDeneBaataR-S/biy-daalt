import AppLayout from "@/layouts/app-layout";
import { useState } from "react";

const docs = [
{
title: "Getting Started",
content: "Welcome to the system. This is your dashboard overview.",
},
{
title: "Feedback",
content: "You can add, edit, and manage feedback items.",
},
{
title: "Roadmap",
content: "Roadmap shows planned features in timeline format.",
},
{
title: "Releases",
content: "Releases contain version updates and shipped features.",
},
];

export default function Docs() {
const [active, setActive] = useState(0);
const [search, setSearch] = useState("");

// 🔍 FILTER (title + content)
const filteredDocs = docs.filter((d) =>
d.title.toLowerCase().includes(search.toLowerCase()) ||
d.content.toLowerCase().includes(search.toLowerCase())
);

return ( <AppLayout> <div className="flex h-full">
    {/* SIDEBAR */}
    <div className="w-64 border-r p-4 space-y-2 bg-white">
      <h2 className="font-bold mb-4">📘 Docs</h2>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      {/* 🔥 SEARCH RESULT */}
      {search ? (
        <div className="space-y-2">
          {filteredDocs.map((d, i) => (
            <div
              key={i}
              onClick={() => {
                const realIndex = docs.findIndex(
                  (doc) => doc.title === d.title
                );
                setActive(realIndex);
                setSearch("");

                setTimeout(() => {
                  document
                    .getElementById(d.title)
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="p-2 border rounded cursor-pointer hover:bg-gray-100"
            >
              <p className="font-medium text-sm">{d.title}</p>
              <p className="text-xs text-gray-500 line-clamp-2">
                {d.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        docs.map((d, i) => (
          <button
            key={i}
            onClick={() => {
              setActive(i);

              setTimeout(() => {
                document
                  .getElementById(d.title)
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className={`block w-full text-left px-3 py-2 rounded ${
              active === i
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            {d.title}
          </button>
        ))
      )}
    </div>

    {/* CONTENT */}
    <div className="flex-1 p-8">
      <h1
        id={docs[active].title}
        className="text-2xl font-bold mb-4"
      >
        {docs[active].title}
      </h1>

      <p className="text-gray-600 leading-relaxed">
        {docs[active].content}
      </p>

      {/* EXTRA */}
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <p className="text-sm text-gray-500">
          💡 Tip: This section explains how this feature works.
        </p>
      </div>
    </div>

  </div>
</AppLayout>
);
}
