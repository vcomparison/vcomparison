import React, { PureComponent } from "react";
import {Button, Form, TextArea} from "semantic-ui-react";
import Comment from "../Comment";
import "./CommentArea.sass";

class CommentArea extends PureComponent {
  state = {
    commentsList: [
      { id: 1, message: "We need to know how to treat", date: "10.10.2017" },
      { id: 2, message: "Control our treatment process", date: "11.10.2017" }
    ],
    comment: {
      commentText: ""
    },
    isCommentAreaShown: false
  };

  addCommentText = ({ target: { value } }) => {
    const { comment } = this.state;
    this.setState({ comment: { ...comment, commentText: value } });
  };

  onSendComment = (e) => {
    console.log(e);
  };

  onCommentStart = (e) => {
    console.log(e);
    this.setState({ isCommentAreaShown: true });
  };

  render() {
    const { commentsList, isCommentAreaShown } = this.state;
    return (

            <div className="comment-area">
                <div>
                    {commentsList.map(comment => (
                        <Comment key={comment.id} comment={comment}></Comment>
                    ))}
                </div>
                { isCommentAreaShown ?
                    <Form className="comment-area__form" onSubmit={this.onSendComment}>
                      <TextArea className="comment-area__textarea" as="textarea" onChange={this.addCommentText}></TextArea>
                      <button className="comment-area__button" >Send</button>
                    </Form>
                    :  <button className="comment-area__button" onClick={this.onCommentStart}>Leave comment</button>
                }
            </div>
    );
  }
}

export default CommentArea;
