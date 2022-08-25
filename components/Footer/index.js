

import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../store';
import Modal from '../UI/Modals/Modal/Modal';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();
class Footer extends Component {
    state = {
        showModal: false,
        content: ""
    }
    render() {
        const store = this.props.getState();
        const { sharedContent, commonDictionary } = store.siteSettings;

        return (
            <>
                <footer>
                    <nav id="footer-menu">
                        <ul className="level-1">
                            <li>
                                <a href="#" onClick={() => this.setState({ ...this.state, showModal: true, content: "chk1" })}>

                                    {htmlToReactParser.parse(sharedContent.aggreements.footer_link_1)}
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={() => this.setState({ ...this.state, showModal: true, content: "chk2" })}>
                                    {htmlToReactParser.parse(sharedContent.aggreements.footer_link_2)}
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={() => this.setState({ ...this.state, showModal: true, content: "chk3" })}>
                                    {htmlToReactParser.parse(sharedContent.aggreements.footer_link_3)}
                                </a>
                            </li>
                        </ul>
                    </nav>
                </footer>

                <Modal showCloseIcon={true} show={this.state.showModal} clicked={() => this.setState({ ...this.state, showModal: false })} type={'modal-type-05 ' + this.state.content}>
                    {

                        this.state.content == "chk1" &&
                        <div className={"f-modal-agreement " + this.state.content}>
                            {
                                htmlToReactParser.parse(sharedContent.aggreements.permission2_1)

                            }
                        </div>
                    }
                    {

                        this.state.content == "chk2" &&
                        <div className={"f-modal-agreement " + this.state.content}>
                            {
                                htmlToReactParser.parse(sharedContent.aggreements.permission2_2)

                            }
                        </div>
                    }
                    {

                        this.state.content == "chk3" &&
                        <div className={"f-modal-agreement " + this.state.content}>
                            {
                                htmlToReactParser.parse(sharedContent.aggreements.permission2_3)

                            }
                        </div>
                    }
                </Modal>

            </>
        )
    }
}
export default connect(initsStore)(Footer);
