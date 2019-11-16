import React, { PureComponent } from "react";
import { Form, TextArea } from "semantic-ui-react";
import Comment from "../Comment";
import "./CommentArea.css";

class CommentArea extends PureComponent {
  state = {
    commentsList: [
      { id: 1, message: "We need to know how to treat", date: "10.10.2017" },
      { id: 2, message: "Control our treatment process", date: "11.10.2017" }
    ],
    comment: {
      commentText: ""
    }
  };

  addCommentText = ({ target: { value } }) => {
    const { comment } = this.state;
    this.setState({ comment: { ...comment, commentText: value } });
  };

  render() {
    const { commentsList } = this.state;
    return (
      <div className="comment-area">
        <div>
          {commentsList.map(comment => (
            <Comment key={comment.id} comment={comment}></Comment>
          ))}
        </div>
        <Form onSubmit={this.onSendComment}>
          <TextArea as="textarea" onChange={this.addCommentText}></TextArea>
        </Form>
      </div>
    );
  }
}

export default CommentArea;
