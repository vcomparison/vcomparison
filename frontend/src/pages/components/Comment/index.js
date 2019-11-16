import React, { useState, Fragment } from "react";
import "./Comment.sass";

const Comment = ({ comment, onPinned, onDetached }) => {
    const [isPinningClicked, setIsPinningClicked] = useState(false);
    const onPinMetadata = () => {
        setIsPinningClicked(true);
        onPinned(comment.id)
    };
    const onDetachMetadata = () => {
        setIsPinningClicked(false);
        onDetached(comment.id)
    };
    return (
        <div className={comment.author === 'me' ? "comment__mine" : "comment__their"}>
            <div className="comment__header">
                <p>{comment.author}</p>
                <p>{comment.date}</p>
            </div>
            <div className="comment__text">{comment.message}</div>
            <div className="comment__footer">
                { comment.author === 'me' &&
                <Fragment>
                    {
                        isPinningClicked ?
                            <div className="comment__metadata-info">
                                <a>#meta</a>
                                <div title="Remove metadata" className="comment__attach-metadata-icon" onClick={onDetachMetadata}/>
                            </div>
                            :
                            <div title="Save metadata" className="comment__detach-metadata-icon" onClick={onPinMetadata}/>
                    }
                </Fragment>}

            </div>
        </div>
    )
}

;

export default Comment;
