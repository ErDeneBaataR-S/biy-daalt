import { useState, useEffect } from "react";
import FeedbackList from "../../components/feedback/FeedbackList";
import FeedbackForm from "../../components/feedback/FeedbackForm";

export default function FeedbackPage() {
const [feedbacks, setFeedbacks] = useState([]);

useEffect(() => {
const data = localStorage.getItem("feedbacks");
if (data) setFeedbacks(JSON.parse(data));
}, []);

useEffect(() => {
localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
}, [feedbacks]);

const addFeedback = (item) => {
setFeedbacks([...feedbacks, { ...item, id: Date.now() }]);
};

const deleteFeedback = (id) => {
setFeedbacks(feedbacks.filter((f) => f.id !== id));
};

const updateFeedback = (id, updated) => {
setFeedbacks(
feedbacks.map((f) => (f.id === id ? { ...f, ...updated } : f))
);
};

return ( <div> <h1>Feedback</h1>

```
  <FeedbackForm onAdd={addFeedback} />

  <FeedbackList
    feedbacks={feedbacks}
    onDelete={deleteFeedback}
    onUpdate={updateFeedback}
  />
</div>


);
}
