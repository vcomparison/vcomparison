import React from "react";
import "./Comment.css";

const Comment = ({ comment }) => (
  <div className="comment">
    <div>{comment.date}</div>
    {comment.message}
  </div>
);

export default Comment;
