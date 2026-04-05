import { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";

export default function Feedback() {
const [feedbacks, setFeedbacks] = useState<any[]>([]);
const [editingId, setEditingId] = useState<number | null>(null);

useEffect(() => {
const data = localStorage.getItem("feedbacks");
if (data) setFeedbacks(JSON.parse(data));
}, []);

useEffect(() => {
localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
}, [feedbacks]);

const addFeedback = () => {
setFeedbacks([
...feedbacks,
{
id: Date.now(),
title: "Login issue",
description: "User cannot login properly",
status: "Open",
priority: "Medium",
deadline: new Date().toISOString().split("T")[0],
},
]);
};

const deleteFeedback = (id: number) => {
setFeedbacks(feedbacks.filter((f) => f.id !== id));
};

const updateFeedback = (id: number, updated: any) => {
setFeedbacks(
feedbacks.map((f) => (f.id === id ? { ...f, ...updated } : f))
);
};

const isOverdue = (date: string) => {
return new Date(date) < new Date();
};

const getPriorityColor = (priority: string) => {
if (priority === "Low") return "bg-gray-100 text-gray-600";
if (priority === "Medium") return "bg-yellow-100 text-yellow-600";
if (priority === "High") return "bg-red-100 text-red-600";
return "";
};

const openItems = feedbacks.filter((f) => f.status === "Open");
const reviewItems = feedbacks.filter((f) => f.status === "In Review");
const closedItems = feedbacks.filter((f) => f.status === "Closed");

return ( <AppLayout> <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Feedback</h1>
      <button
        onClick={addFeedback}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        + Add
      </button>
    </div>

    <div className="grid grid-cols-3 gap-6">

      {/* OPEN */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold mb-3">Open ({openItems.length})</h2>

        {openItems.map((f) => (
          <div key={f.id} className="border rounded-lg p-3 mb-3">

            <h3 className="font-medium">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.description}</p>

            <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(f.priority)}`}>
              {f.priority}
            </span>

            <p className={`text-xs mt-1 ${isOverdue(f.deadline) ? "text-red-500 font-semibold" : "text-gray-400"}`}>
              📅 {f.deadline}
            </p>

            <div className="flex justify-end gap-2 mt-2">

              <select
                value={f.status}
                onChange={(e) =>
                  updateFeedback(f.id, { status: e.target.value })
                }
                className="border rounded px-2 py-1 text-sm"
              >
                <option>Open</option>
                <option>In Review</option>
                <option>Closed</option>
              </select>

              <select
                value={f.priority}
                onChange={(e) =>
                  updateFeedback(f.id, { priority: e.target.value })
                }
                className="border rounded px-2 py-1 text-sm"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <button
                onClick={() => deleteFeedback(f.id)}
                className="text-red-500"
              >
                🗑
              </button>

            </div>
          </div>
        ))}

      </div>

      {/* REVIEW */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold mb-3">
          In Review ({reviewItems.length})
        </h2>

        {reviewItems.map((f) => (
          <div key={f.id} className="border rounded-lg p-3 mb-3">
            <h3>{f.title}</h3>
          </div>
        ))}
      </div>

      {/* CLOSED */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold mb-3">
          Closed ({closedItems.length})
        </h2>

        {closedItems.map((f) => (
          <div key={f.id} className="border rounded-lg p-3 mb-3">
            <h3>{f.title}</h3>
          </div>
        ))}
      </div>

    </div>
  </div>
</AppLayout>
);
}
