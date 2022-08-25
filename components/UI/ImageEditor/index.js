import React from 'react'
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';

class ImageEditor extends React.Component {
    state = {
        image: '../../../static/images/avatar-1-profile.png'
    }
    onClickSave = () => {
        if (this.editor) {

            const croppedImage = this.editor.getImage().toDataURL()

        }
    }

    setEditorRef = (editor) => this.editor = editor

    readURL = (image) => {
        var reader = new FileReader();
        const _this = this
        reader.onload = function (e) {
            _this.setState({ ...this.state, image: e.target.result })
        };

        reader.readAsDataURL(image);
    }
    render() {

        return (
            <div className="imageEditor">
                <AvatarEditor
                    ref={this.setEditorRef}
                    image={this.state.image}
                    borderRadius={125}
                    width={250}
                    height={250}
                    border={50}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={1.2}
                    rotate={0}
                />
                <a href='#' onClick={() => this.onClickSave()}>save</a>
                l<label htmlFor='avatarImage' className='labelforImage'>
                    <img src='../../../static/images/edit.png'></img>
                    <input id='avatarImage' type="file" onChange={(e) => this.readURL(e.target.files[0])} />
                </label>

            </div>
        );

    }
}

export default ImageEditor