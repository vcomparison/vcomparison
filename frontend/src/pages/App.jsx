import React, { PureComponent } from "react";
import { Switch, Route, Redirect } from "react-router";
import CommentArea from "./components/CommentArea";
import Header from "./components/Header";
import Views from "./Views";
import Plans from "./Plans";
import "./App.sass";

class App extends PureComponent {
  state = {
    isCommentBlockOpen: false,
    currentMetadata: { patient: '', plan: '', layerValue: '' }
  };

  onToggleComment = () => {
    const { isCommentBlockOpen } = this.state;
    this.setState({
      isCommentBlockOpen: !isCommentBlockOpen
    });
  };

  onMetadataChange = (patient, plan, layerValue) => {
    this.setState({ currentMetadata: { patient, plan, layerValue } });
  };

  render() {
    const { isCommentBlockOpen, currentMetadata } = this.state;
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
              <Route exact path="/views" render={() => <Views onMetadataChange={this.onMetadataChange} />}></Route>
              <Route exact path="/plans" render={() => <Plans />}></Route>
              <Redirect to="/views" />
            </Switch>
          </div>
        </div>
        <div
          className={`app__comment-block ${
            isCommentBlockOpen ? "app__comment-block--opened" : ""
          }`}
        >
          <CommentArea currentMetadata={currentMetadata} />
          <div onClick={this.onToggleComment} className="app__comment-icon">
            Comments
          </div>
        </div>
      </div>
    );
  }
}

export default App;
