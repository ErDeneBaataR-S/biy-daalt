import { useState } from "react";

export default function FeedbackForm({ onAdd }) {
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");

const handleSubmit = () => {
if (!title) return;

```
onAdd({
  title,
  description,
  status: "Open",
  priority: "Medium",
});

setTitle("");
setDescription("");
```

};

return ( <div>
<input
placeholder="Title"
value={title}
onChange={(e) => setTitle(e.target.value)}
/>

```
  <textarea
    placeholder="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />

  <button onClick={handleSubmit}>Add Feedback</button>
</div>
);
}
