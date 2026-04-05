import FeedbackItem from "./FeedbackItem";

export default function FeedbackList({ feedbacks, onDelete, onUpdate }) {
return ( <div>
{feedbacks.map((item) => ( <FeedbackItem
       key={item.id}
       item={item}
       onDelete={onDelete}
       onUpdate={onUpdate}
     />
))} </div>
);
}
