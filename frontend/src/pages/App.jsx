import React, { PureComponent } from "react";
import { Switch, Route, Redirect } from "react-router";
import CommentArea from "./components/CommentArea";
import Header from "./components/Header";
import Views from "./Views";
import Plans from "./Plans";
import "./App.sass";

class App extends PureComponent {
  state = {
    isCommentBlockOpen: false
  };

  onToggleComment = () => {
    const { isCommentBlockOpen } = this.state;
    this.setState({
      isCommentBlockOpen: !isCommentBlockOpen
    });
  };

  render() {
    const { isCommentBlockOpen } = this.state;
    return (
      <div>
        <div className="app__header-wrapper">
          <div className="container">
            <Header />
          </div>
        </div>
        <div className="app__page-content">
          <div className="container">
            <Switch>
              <Route path="/views" render={() => <Views />}></Route>
              <Route path="/plans" render={() => <Plans />}></Route>
              <Redirect from="/" to="/views" />
            </Switch>
          </div>
        </div>
        <div
          className={`app__comment-block ${
            isCommentBlockOpen ? "app__comment-block--opened" : ""
          }`}
        >
          <CommentArea />
          <div onClick={this.onToggleComment} className="app__comment-icon">
            Comments
          </div>
        </div>
      </div>
    );
  }
}

export default App;
