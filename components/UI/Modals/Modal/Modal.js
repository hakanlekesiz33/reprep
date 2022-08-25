import React, { Component } from 'react';
import Backdrop from '../../Backdrop/Backdrop';

class Modal extends Component {


    render() {

        return (
            <>
                <Backdrop show={this.props.show} clicked={this.props.clicked} />
                <div className={"modal-content "+this.props.type + " " + this.props.show}>
                {
                    this.props.showCloseIcon &&
                    <a id="f-modal-close" href="#" onClick={this.props.clicked}>
                        <img src="/static/images/icons/close-dark.svg" alt="close-icon" />
                    </a>
                }
                    {this.props.children}
                </div>
             
            </>
        )
    }
}

export default Modal;