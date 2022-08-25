import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';

class BasketItem3 extends Component {

    render() {
       
        const { currentPage, commonDictionary } = this.props.getState().siteSettings;

        return (
            <>
               <div className='citemC'>
                    <div className='citemC-01'>
                        {commonDictionary.total}
                    </div>
                    <div className='citemC-02'>
                        {this.props.total.toFixed(2) + "€"}
                    </div> 
                </div>



            </>
        )
    }
}

export default connect(initsStore)(BasketItem3);