import React, { PureComponent } from "react";
import nanoid from "nanoid";
import { Button, Form, TextArea, Checkbox } from "semantic-ui-react";
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
        author: 'Planner',
        metadata: {},
        isMetadataPinned: false
      },
      {
        id: nanoid(),
        message: "Control our treatment process",
        date: "11.10.2019 11:00:31",
        author: 'Planner',
        metadata: {},
        isMetadataPinned: false
      }

    ],
    comment: {
      commentText: "",
      isCheckboxToggled: false
    },
    isCommentAreaShown: false
  };

  addCommentText = ({ target: { value } }) => {
    const { comment } = this.state;
    this.setState({ comment: { ...comment, commentText: value } });
  };

  // onMetadataPinned = commentId => {
  //   const newCommentsList = [...this.state.commentsList];
  //   const indexToUpdate = this.state.commentsList.findIndex(comment => comment.id === commentId);
  //   newCommentsList.splice(indexToUpdate, 1, { ...newCommentsList[indexToUpdate], isMetadataPinned: false } );
  //   this.setState({ commentsList: newCommentsList });
  // };

    // onCheckboxToggled = commentId => {
    //     const newCommentsList = [...this.state.commentsList];
    //     const indexToUpdate = this.state.commentsList.findIndex(comment => comment.id === commentId);
    //     const reversePinning = !newCommentsList[indexToUpdate].isMetadataPinned;
    //     newCommentsList.splice(indexToUpdate, 1, { ...newCommentsList[indexToUpdate], isMetadataPinned: reversePinning } );
    //     this.setState({ commentsList: newCommentsList });
    // };

  onSendComment = ({ target }) => {
    const {
      commentsList,
      comment: { commentText, isCheckboxToggled }
    } = this.state;
    this.setState({
      commentsList: [
        ...commentsList,
        {
          id: nanoid(),
          message: commentText,
          date: getCurrentDate(true),
          author: 'Doctor',
          metadata: this.props.currentMetadata,
          isMetadataPinned: isCheckboxToggled
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

  onCheckboxToggled = () => {
    const { comment } = this.state;
    this.setState({ comment: { ...comment, isCheckboxToggled: !comment.isCheckboxToggled } });
  };

  render() {
    const {
      commentsList,
      isCommentAreaShown,
      comment: { commentText, isCheckboxToggled }
    } = this.state;
    return (
      <div className="comment-area">
        <div className="comment-area__list">
          {commentsList.map(comment => (
            <Comment key={comment.id}
                     comment={comment}>
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
            <div className="comment-area__bottom">
                <div>
                    <button
                        className="comment-area__button--secondary"
                        onClick={this.onCommentCancel}
                    >
                        Cancel comment
                    </button>
                    <button className="comment-area__button--primary">Send</button>
                </div>
              <Checkbox checked={isCheckboxToggled}
                        onChange={this.onCheckboxToggled}
                        className="comment-area__checkbox"
                        label="Attach metadata" />
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
