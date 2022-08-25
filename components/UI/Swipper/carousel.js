
import '../../../components/UI/Swipper/carousel.scss';
import React, { Component } from 'react';
import Swiper from 'react-id-swiper';
import '../../RootUI/icon/index';
import Icon from '../../RootUI/icon';

class Carousel extends Component {
    constructor(props) {
        super(props);
        this.carouselSwiper = false;
    }

    componentDidMount() {
        this.isUnmounted = true;
    }
    render() {
        console.log(this.props.ticketLogs)
        return (
            <div className="rui-swiper">
                <Swiper
                    grabCursor
                    centeredSlides
                    slidesPerView="auto"
                    initialSlide={2}
                    spaceBetween={30}
                    speed={400}
                    keyboard={{ enabled: true }}
                    getSwiper={(swiper) => {
                        this.carouselSwiper = swiper;
                    }}
                >

                    {this.props.ticketLogs.map((item, index) => {
                        let addedDate = item.addedDate.substring(0, 10)
                        addedDate = addedDate.split("-")[2] + "." + addedDate.split("-")[1] + "." + addedDate.split("-")[0]
                        let addedTime = item.addedDate.substring(11, 19)
                            return (
                                <div key={"ticketLogsSlide" + index} className="swiper-slide">
                                    <div className="rui-widget rui-widget-chart">
                                        <div className="rui-widget-chart-info">
                                            {/* <div className="rui-widget-title h2">{item.title}</div> */}
                                            <small className="rui-widget-subtitle">
                                                <div className="rui-task-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-circle rui-icon rui-icon-stroke-1_5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                                </div>
                                            </small>
                                            <h5 className="rui-widget-title">{item.description}</h5>
                                            <small className="rui-widget-subtitle">{addedDate}</small>
                                            <small className="rui-widget-subtitle">{addedTime}</small>
                                        </div>
                                        <div className="rui-widget-total-chart">
                                            <canvas className="rui-chartjs rui-chartjs-line rui-chartjs-total" data-height="50"
                                                data-chartjs-interval="3000"
                                                data-chartjs-line-color="#8e9fff">
                                            </canvas>
                                        </div>
                                    </div>
                                </div>
                            )
                      
                      
                    })}

                </Swiper>
                <div
                    className="swiper-button-next"
                    onClick={() => {
                        if (this.carouselSwiper !== null) {
                            this.carouselSwiper.slideNext();
                        }
                    }}
                    onKeyUp={() => { }}
                    role="button"
                    tabIndex={0}
                >
                    <Icon name="chevron-right" />
                </div>
                <div
                    className="swiper-button-prev"
                    onClick={() => {
                        if (this.carouselSwiper !== null) {
                            this.carouselSwiper.slidePrev();
                        }
                    }}
                    onKeyUp={() => { }}
                    role="button"
                    tabIndex={0}
                >
                    <Icon name="chevron-left" />
                </div>
            </div>

        );
    }
}

export default Carousel;
