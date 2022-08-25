import React from "react";
import CSSTransition from "react-transition-group/CSSTransition";
import * as config from '../../../config';


class CssTransion extends React.Component {

  state = {
    isShow: false
  }
  componentDidMount() {
    this.setState({ ...this.state, isShow: true })
    //const _this = this
    //  setTimeout(function(){ 
    //_this.setState({ ..._this.state, isShow: true })
    //    }, 10);

  }

  render() {
    return (
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={this.state.isShow}
        timeout={config.waitToNextComponent}
        classNames="componentAnimation"
      >
        <div className="componentAnimation">
          {this.props.children}
        </div>
      </CSSTransition>
    );
  };
}
export default CssTransion;
