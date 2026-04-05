export default function FeedbackItem({ item, onDelete, onUpdate }) {
return (
<div style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}> <h3>{item.title}</h3> <p>{item.description}</p>

```
  <span>{item.status}</span>

  <br />

  <button onClick={() => onDelete(item.id)}>Delete</button>
</div>

);
}
