import React, { PureComponent } from "react";
import nanoid from "nanoid";
import { Button, Form, TextArea } from "semantic-ui-react";
import { getCurrentDate } from "../../../helpers/getCurrentDate";
import Comment from "../Comment";
import "./CommentArea.sass";

class CommentArea extends PureComponent {
  state = {
    commentsList: [
      // use nanoid to generate unique id
      {
        id: nanoid(),
        message: "We need to know how to treat",
        date: "10.10.2019 13:38:37",
        author: 'John Doe',
        metadata: {},
        isMetadataPinned: false
      },
      {
        id: nanoid(),
        message: "Control our treatment process",
        date: "11.10.2019 11:00:31",
        author: 'John Doe',
        metadata: {},
        isMetadataPinned: false
      }

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

  onMetadataPinned = commentId => {
    const newCommentsList = [...this.state.commentsList];
    const indexToUpdate = this.state.commentsList.findIndex(comment => comment.id === commentId);
    newCommentsList.splice(indexToUpdate, 1, { ...newCommentsList[indexToUpdate], isMetadataPinned: false } );
    this.setState({ commentsList: newCommentsList });
  };

    onMetadataDetached = commentId => {
        const newCommentsList = [...this.state.commentsList];
        const indexToUpdate = this.state.commentsList.findIndex(comment => comment.id === commentId);
        newCommentsList.splice(indexToUpdate, 1, { ...newCommentsList[indexToUpdate], isMetadataPinned: true } );
        this.setState({ commentsList: newCommentsList });
    };

  onSendComment = ({ target }) => {
    const {
      commentsList,
      comment: { commentText }
    } = this.state;
    this.setState({
      commentsList: [
        ...commentsList,
        {
          id: nanoid(),
          message: commentText,
          date: getCurrentDate(true),
          author: 'me',
          metadata: this.props.currentMetadata
        }
      ],
      isCommentAreaShown: false,
      comment: { commentText: "" }
    });

  };

  onCommentStart = e => {
    this.setState({ isCommentAreaShown: true });
  };

  onCommentCancel = () => {
    this.setState({ isCommentAreaShown: false, comment: { commentText: "" } });
  };

  render() {
    const {
      commentsList,
      isCommentAreaShown,
      comment: { commentText }
    } = this.state;
    return (
      <div className="comment-area">
        <div className="comment-area__list">
          {commentsList.map(comment => (
            <Comment key={comment.id}
                     comment={comment}
                     onPinned={this.onMetadataPinned}
                     onDetached={this.onMetadataDetached}>
            </Comment>
          ))}
        </div>
        {isCommentAreaShown ? (
          <Form className="comment-area__form" onSubmit={this.onSendComment}>
            <TextArea
              value={commentText}
              className="comment-area__textarea"
              as="textarea"
              onChange={this.addCommentText}
            ></TextArea>
            <div>
              <button className="comment-area__button--primary">Send</button>
              <button
                className="comment-area__button--secondary"
                onClick={this.onCommentCancel}
              >
                Cancel
              </button>
            </div>
          </Form>
        ) : (
          <button
            className="comment-area__button--primary"
            onClick={this.onCommentStart}
          >
            Leave comment
          </button>
        )}
      </div>
    );
  }
}

export default CommentArea;
