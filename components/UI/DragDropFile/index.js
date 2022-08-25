import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import Dropzone from 'react-dropzone-uploader'
import '../../../styles/dropzone-uploader.scss'
import axios from 'axios'
import { setSiteSettings } from '../../../store/actions/setSiteSettings';
import * as config from '../../../config';
var uuid = require('uuid');
//const uuidv1 = require('uuid/v1');

const maxSize = 1024 * 1024 * 5;


const MyUploader = (props) => {
    // specify upload params and url for your files

    const getUploadParams = ({ file, meta }) => {
        if (file.size < maxSize) {
            const store = props.allProps.getState()
            let acceptedFilesGuid = ""
            try {
                if (store.siteSettings.userRequestSteps.requestStep12FormData.acceptedFilesGuid) {
                    acceptedFilesGuid = store.siteSettings.userRequestSteps.requestStep12FormData.acceptedFilesGuid
                }
            }
            catch{ }

            let oldAcceptedFilesNames = []
            try {
                if (store.siteSettings.userRequestSteps.requestStep12FormData.acceptedFilesNames) {
                    oldAcceptedFilesNames = store.siteSettings.userRequestSteps.requestStep12FormData.acceptedFilesNames
                }
            }
            catch{ }
            //kullanıcınun daha önce dolduruduğu form var ise önce onu elde ediyoruz
            const isfirst = acceptedFilesGuid == ""
            const guid = isfirst ? uuid.v1() : acceptedFilesGuid
            const userId = store.siteSettings.userRequestSteps.requestStep1FormData.id
            const body = new FormData()
            body.append('guid', guid)
            body.append('File', file)
            body.append('isFirst', isfirst)
            body.append('userId', userId)
            body.append('isNewFile', oldAcceptedFilesNames.indexOf(meta.name) == -1)

            //kullanıcınun daha önce dolduruduğu form var ise önce onu elde ediyoruz
            let beforeUserRequestSteps = null;
            if (localStorage.getItem('userRequestSteps') != null) {
                beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
            }

            if (oldAcceptedFilesNames.indexOf(meta.name) == -1) {
                oldAcceptedFilesNames.push(meta.name)
            }

            const requestStep12FormData = {
                ...beforeUserRequestSteps.requestStep12FormData,
                acceptedFilesGuid: guid,
                acceptedFilesNames: oldAcceptedFilesNames
            }

            //kullanıcınun doldurduğu formlar bu objede tutuluyor 
            const userRequestSteps = {
                ...beforeUserRequestSteps,
                expireDate: new Date().getTime(),
                requestStep12FormData
            }

            //localStorage'a kayıt edildi
            localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));

            //redux'a kayıt edildi
            props.allProps.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }));


            return { url: config.uploadFile, body }
        }
        else {
            return true
        }


    }
    // called every time a file's `status` changes
    const handleChangeStatus = ({ meta, file, allFiles }, status) => {
        if (status == "removed") {
            //dosya isimlerini string array da tutuyoruz silinen dosyayı arraydan çıkarıyoruz
            //kullanıcınun daha önce dolduruduğu form var ise önce onu elde ediyoruz
            let beforeUserRequestSteps = null;
            if (localStorage.getItem('userRequestSteps') != null) {
                beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
            }

            const oldAcceptedFilesNames = beforeUserRequestSteps.requestStep12FormData.acceptedFilesNames == undefined ? [] : beforeUserRequestSteps.requestStep12FormData.acceptedFilesNames

            oldAcceptedFilesNames.splice(oldAcceptedFilesNames.indexOf(meta.name), 1); // string array'da eşleşen elemanı silme
            const requestStep12FormData = {
                ...beforeUserRequestSteps.requestStep12FormData,
                acceptedFilesNames: oldAcceptedFilesNames
            }

            //kullanıcınun doldurduğu formlar bu objede tutuluyor 
            const userRequestSteps = {
                ...beforeUserRequestSteps,
                expireDate: new Date().getTime(),
                requestStep12FormData
            }

            //localStorage'a kayıt edildi
            localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));

            //redux'a kayıt edildi
            props.allProps.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }));


            var data = new FormData();
            data.append('guid', userRequestSteps.requestStep12FormData.acceptedFilesGuid);
            data.append('fileName', meta.name);

            const headers = {
                'Content-Type': 'multipart/form-data'
            }
            axios.post(config.deleteFile, data, {
                headers: headers

            }).then(function (res) {
            })
        }
    }

    // receives array of files that are done uploading when submit button is clicked
    // const handleSubmit = (files, allFiles) => {
    //     console.log(files.map(f => f.meta))
    //     allFiles.forEach(f => f.remove())
    // }


    if (props.renderDropzone) {
        return (
            <Dropzone
                getUploadParams={getUploadParams}
                onChangeStatus={handleChangeStatus}
                //onSubmit={handleSubmit}
                inputContent={<div key={"inputContent"}>
                    <img src='../../../static/images/icons/icon-upload.svg'></img>
                    <div className='citem01 ff-A desktopText'>{props.allProps.text1}</div>
                    <div className='citem01 ff-A mobileText'>{props.allProps.text2}</div>
                    <div className='citem02 ff-A'>{props.allProps.text3}</div>
                </div>
                }
                maxSizeBytes={maxSize}
                accept=".png, .jpg, .jpeg, .jpg, .pdf"
                initialFiles={props.initialFiles}
                inputWithFilesContent={props.allProps.text4}
            //accept=".zip, .rar, .png, .jpg, .jpeg, .jpg, .pdf, .doc, .docx, .xls, .xlsx, .txt, .rtf, .mpg, .mpeg, .mp4, .m4v, .3gp, .mov, .avi"
            />
        )

    }
    else {
        return (
            null
        )
    }


}

const imageIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAA3NCSVQICAjb4U/gAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAACoklEQVRoQ+2av64BQRTGZ29EQqOQEIlIqDUS3sEbCNHxAlREVBK1Xq2UKChEKSi9AYloaKhohLuz99g7+39nZ9m18Uu+7JnMmc18d+eYWS734EEe4AeuH8/XiNvgZrOZJ2qE4/UtdjcheSLxeFy4uv0TmePwtBHa7/fCFSMx8mlbytMQRrK0rtcrRO5HPtfvPvIq1us1SiaTwrLBCofDaDweQ68+uDAEXS4XfPRyjMFgIM5FrmazCVl/4LnKcv4bThq53+/kpFS12WwgW2mEaWm1Wi2I2Ol2uxBp0263IVJHdEX7RPCYRCIBLTaKxaI4Dy1lMhnItvGJrFYr4brb7VC1WhViFmKxGETaGOWIrmieSD6fl/xFhsMh9Fhju91K7qemyWQC2TYWOznuqcPhAL3WKBQKqvfFSqfTkPWHLUb6/T55A4lYaTQainuWSiXo/ccWI7jAyXGk+M0Mstjga/Axn8+hpYTZyPl8JgerqlKpQPbrYDZSr9fJwZpiLX4j5EYkx3i+EwUCAWipQx6djeCLH0UiEWjZCz79BoNBaFEeGpfLJUTmiEajEL0eKiOdTgci86RSKYi0GY1GiN+1oWUdcZ0Z1QiZSyO94i+Xy2IeTV1ZLna9vcOM5JPEp91QKKTIM4tlI3p7h1kdj0fhXtPpVLUfK5vNCjlGWDJyOp3IAZbl9/sftVpNtY+UmSVmyYjZvcNOGWHJCJnzLhktMWoji8WCTH6r9JYYtRH5e8e7pQW1EbLfCWktMSojrHuHXVJbYlRG7Ng77JIcuRHNsxb/3iF8seAWcrkcRNqIrsgnovf+7JR6vR7MTvlEqN9HnOR2uyGfzyfETO8jTvM0oYZnfuiRGPHMT2+fzEfViB7e+YcB/JkM8UfjmaX1NeIuEPoFx00cWm1lPHsAAAAASUVORK5CYII='
const pdfIcon = 'data:image/png;base64,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'

class DragDropFile extends Component {
    state = {
        files: [],
        renderDropzone: false
    }
    componentDidMount() {
        const _this = this
        const store = this.props.getState()
        let oldAcceptedFilesNames = []
        try {
            if (store.siteSettings.userRequestSteps.requestStep12FormData.acceptedFilesNames) {

                oldAcceptedFilesNames = store.siteSettings.userRequestSteps.requestStep12FormData.acceptedFilesNames
            }
        }
        catch{ }
        if (oldAcceptedFilesNames.length > 0) {

            oldAcceptedFilesNames.map(function (item) {
                const fileTypeIcon = item.substring(item.length - 3) == "pdf" ? pdfIcon : imageIcon
                fetch(fileTypeIcon).then(res => {
                    res.arrayBuffer().then(buf => {
                        const file = new File([buf], item, { type: 'application/pdf' })
                        let oldFiles = _this.state.files
                        oldFiles.push(file)
                        _this.setState({ ..._this.state, files: oldFiles })
                        if (oldAcceptedFilesNames.length == oldFiles.length) {
                            _this.setState({ ..._this.state, renderDropzone: true })
                        }
                    })
                })
            })

        }
        else {
            _this.setState({ ..._this.state, renderDropzone: true })
        }
    }
    render() {
        return (
            <>
                <MyUploader
                    allProps={this.props}
                    initialFiles={this.state.files}
                    renderDropzone={this.state.renderDropzone}
                />


            </>
        )
    }
}

export default connect(initsStore)(DragDropFile);

