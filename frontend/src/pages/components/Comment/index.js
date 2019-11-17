import React, { useState, Fragment } from "react";
import "./Comment.sass";

const Comment = ({ comment }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div className={comment.author === 'Doctor' ? "comment__mine" : "comment__their"}>
            <div className="comment__header">
                <p>{comment.author}</p>
                <p>{comment.date}</p>
            </div>
            <div className="comment__text">{comment.message}</div>
            <div className="comment__footer">
                { comment.author === 'Doctor' &&
                <Fragment>
                    {
                        comment.isMetadataPinned ?
                            <div className="comment__metadata-info">
                                <div className="comment__metadata"
                                     onMouseLeave={() => setIsHovered(false)}
                                     onMouseEnter={() => setIsHovered(true)}>
                                    #meta
                                </div>
                                <div title="Metadata added" className="comment__attach-metadata-icon" />
                            </div>
                            :
                            <div title="There is no metadata" className="comment__detach-metadata-icon" />
                    }
                </Fragment>
                }
                {isHovered &&
                    <Fragment>
                        <div onMouseLeave={() => setIsHovered(false)}
                             onMouseEnter={() => setIsHovered(true)}
                             className="comment__tooltip">
                            <div className="comment__tooltip-text">
                                <div className="comment__metadata-item">{comment.metadata.patient}</div>
                                <div className="comment__metadata-item">{comment.metadata.plan}</div>
                                <div className="comment__metadata-item">{comment.metadata.layerValue}</div>
                            </div>
                        </div>
                    </Fragment>
                }
            </div>
        </div>
    )
}

;

export default Comment;
