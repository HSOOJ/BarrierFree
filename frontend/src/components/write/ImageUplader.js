// import React, { useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';

// function ImageUploader() {
//   const onDrop = useCallback((acceptedFiles) => {
//     acceptedFiles.forEach((file) => {
//       const reader = new FileReader();

//       reader.onabort = () => console.log('file reading was aborted');
//       reader.onerror = () => console.log('file reading has failed');
//       reader.onload = () => {
//         // Do whatever you want with the file contents
//         const binaryStr = reader.result;
//         console.log(binaryStr);
//       };
//       reader.readAsArrayBuffer(file);
//     });
//   }, []);
//   const { getRootProps, getInputProps } = useDropzone({ onDrop });

//   return (
//     <div {...getRootProps()}>
//       <input {...getInputProps()} />
//       <p>Drag 'n' drop some files here, or click to select files</p>
//     </div>
//   );
// }

// export default ImageUploader;

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Card, Container, CardActionArea, CardMedia } from '@mui/material';
import Button from '../common/Button';
import { uploadImage } from '../../_actions/upload_actions';
import axios from '../../../node_modules/axios/index';

function ImageUploader() {
  // const classes = useStyles();
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [imageName, setImageName] = useState('');
  const { image } = useSelector((state) => state.upload);

  // handleuploadclick;
  const onUpload = (event) => {
    const file = event.target.files[0];
    console.log(file);
    const imageData = new FormData();
    imageData.append('imageFile', file);
    console.log(imageData);
    setImageData(imageData);
    setImagePreview(URL.createObjectURL(file));
  };
  const config = {
    Headers: {
      'content-Type': 'multipart/form-data',
    },
  };
  const uploadImageWithAdtData = () => {
    // 전송 보내기 전에 새로운 이름 붙이기
    imageData.append('imageName', imageName);
    dispatch(uploadImage(imageData));
    axios.post({
      method: 'post',
      url: '/upload/photo',
      formData: imageData,
      Headers: { 'content-type': 'multipart/form-data' },
    });
  };
  const onc = () => {
    alert('good');
  };
  const onChange = (event) => {
    setImageName(event.target.value);
  };

  return (
    <div>
      <Card>
        <CardActionArea>
          <CardMedia
            component="img"
            image={
              imagePreview != null
                ? imagePreview
                : 'https://www.leadershipmartialartsct.com/wp-content/uploads/2017/04/default-image-620x600.jpg'
            }
          />
        </CardActionArea>
      </Card>
      <input
        type="file"
        id="upload-profile-image"
        capture="user"
        accept="image/*"
        onChange={onUpload}
        // style={{ display: 'none' }}
      />
      <label htmlFor="upload-profile-image">
        <Button variant="contained" component="span">
          파일 찾기
        </Button>
      </label>
      <input
        label="Image Name"
        name="name"
        onChange={onChange}
        value={imageName}
      />
      <Button component="span" onClick={uploadImageWithAdtData}>
        이미지 등록
      </Button>
    </div>
  );
}

export default ImageUploader;