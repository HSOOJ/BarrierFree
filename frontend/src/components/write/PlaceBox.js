import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useCallback, useState, useEffect } from 'react';
import axios from '../../../node_modules/axios/index';
import Button from '../common/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const PlaceBoxBlock = styled.div`
  width: 100%;
  border-top: 1px solid ${palette.gray[0]};
`;

const PlaceForm = styled.form`
  // overflow: hidden;
  // display: flex;
  // width: 100%;

  // input,
  // button {
  //   outline: none;
  //   border: none;
  //   font-size: 1.125rem;
  // }

  // button {
  //   // background: ${palette.blue[0]};
  //   color: ${palette.blue[0]};
  //   &:hover {
  //     background: ${palette.gray[0]};
  //     color: ${palette.blue[0]};
  //   }
  // }
`;

// const PlaceItemBlock = styled.div`
//   display: flex;
//   margin-top: 0.5rem;
//   border-bottom: 1px solid ${palette.gray[0]};
//   padding-bottom: 0.5rem;
// `;

// const PlaceItem = React.memo(({ place, onRemove }) => (
//   <div onClick={() => onRemove(place)}>
//     <LocationOnIcon />
//     {place}
//   </div>
// ));

const PlaceBox = ({ onChangePlace, onChangeField, postLocation }) => {
  const [input, setInput] = useState('');
  const [localPlace, setLocalPlace] = useState([]);
  const [searchPlaces, setSearchPlaces] = useState([]);
  const [kakaoMap, setKakaoMap] = useState(false);

  const insertPlace = useCallback(
    (postLocation) => {
      if (!postLocation.trim()) return;
      if (localPlace === postLocation) return;
      setLocalPlace(postLocation);
      onChangePlace(postLocation);
    },
    [localPlace, onChangePlace],
  );

  const onRemove = useCallback(() => {
    setLocalPlace([]);
    onChangePlace('');
  }, [localPlace, onChangePlace]);

  const onChange = useCallback((e) => {
    setInput(e.target.value);
    onChangeField({ key: 'postLocation', value: e.target.value });
  }, []);

  // const onClickPlace = (searchPlace) => {
  //   onChangeField({ key: 'postLocation', value: searchPlace.postLocation });
  //   onChangeField({ key: 'postAddress', value: searchPlace.postAddress });
  // };

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      insertPlace(input.trim());
      setInput('');
      // console.log('장소 등록::', input);
    },
    [input, insertPlace],
  );
  // const onClick = async () => {
  //   try {
  //     const response = await axios({
  //       method: 'get',
  //       url: '/post/searchLocation',
  //       params: { postLocation: postLocation },
  //     });
  //     console.log(response.data);
  //     setSearchPlaces(response.data);
  //   } catch (e) {
  //     console.log(e.response.data);
  //     // fail로 반환
  //     // 여기서 카카오 지도 검색으로 넘어가도록 함
  //   }
  // };

  useEffect(() => {
    setLocalPlace(postLocation);
  }, [postLocation]);
  useEffect(() => {
    setLocalPlace([]);
  }, []);
  // const [myLocation, setMyLocation] = useState('');

<<<<<<< HEAD
  const onLocationClick = (postLocation) => {
    setMyLocation(postLocation);
  };
=======
  // const onLocationClick = (postLocation) => {
  //   setMyLocation(postLocation);
  // };
>>>>>>> 440608a11ef2e69015c0f39e53fe3a509e63b03f
  // const [mystyle, setStyle] = useState("display : 'none'");

  // dialog

  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');

  const handleClickOpen = (scrollType) => async () => {
    try {
      const response = await axios({
        method: 'get',
        url: '/post/searchLocation',
        params: { postLocation: postLocation },
      });
      // console.log(response.data);
      setSearchPlaces(response.data);
      setKakaoMap(false);
    } catch (e) {
      // console.log(e.response.data);
      if (e.response.data === 'fail') {
        setKakaoMap(true);
      }
      // fail로 반환
      // 여기서 카카오 지도 검색으로 넘어가도록 함
    }
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
    onChangeField({ key: 'postLocation', value: 'none' });
    onChangeField({ key: 'postAddress', value: '' });
    onChangeField({ key: 'contentId', value: 0 });
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <PlaceBoxBlock>
      <div>
        <PlaceForm onSubmit={onSubmit}>
          <Paper
            // component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: 400,
            }}
          >
            <LocationOnIcon sx={{ color: '#2D4059' }} aria-label="menu" />

            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="장소를 입력하세요"
              value={input}
              onChange={onChange}
              onKeyPress={handleClickOpen('paper')}
            />
            {/* <IconButton
              onClick={handleClickOpen('paper')}
              sx={{ p: '10px' }}
              aria-label="search"
            >
            </IconButton> */}
            {/* <SearchIcon onClick={handleClickOpen('paper')} /> */}
            <Button onClick={handleClickOpen('paper')}>검색</Button>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          </Paper>
        </PlaceForm>
        <div>
          {/* <Button onClick={handleClickOpen('paper')}>검색 장소 보기</Button> */}
          <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <DialogTitle id="scroll-dialog-title">장소 검색 결과</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
              {kakaoMap ? (
                <div>
                  <h3>빈 값을 입력하셨거나 해당 검색 결과가 없습니다. </h3>
                  <h3>카카오 지도로 검색하시겠어요?🙄</h3>
                  <Button>카카오 지도 보기</Button>
                </div>
              ) : (
                searchPlaces.map((searchPlace) => (
                  <div
                    onClick={() => {
                      onChangeField({
                        key: 'postLocation',
                        value: searchPlace.postLocation,
                      });
                      onChangeField({
                        key: 'postAddress',
                        value: searchPlace.postAddress,
                      });
                      onChangeField({
                        key: 'postLat',
                        value: searchPlace.postLat,
                      });
                      onChangeField({
                        key: 'postLng',
                        value: searchPlace.postLng,
                      });
                      onChangeField({
                        key: 'contentId',
                        value: searchPlace.contentId,
                      });
                      setInput(searchPlace.postLocation);
                      setOpen(false);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <h4>{searchPlace.postLocation}</h4>
                    <h5>{searchPlace.postAddress}</h5>
                    <hr></hr>
                  </div>
                ))
              )}
            </DialogContent>
            <DialogActions>
              {kakaoMap ? (
                <div>
                  <Button onClick={() => setOpen(false)}>취소</Button>
                </div>
              ) : (
                <div>
                  <Button onClick={handleClose}>취소</Button>
                  <Button onClick={() => setOpen(false)}>확인</Button>
                </div>
              )}
            </DialogActions>
          </Dialog>
        </div>
        {/* <PlaceItemBlock>
          <PlaceItem place={localPlace} onRemove={onRemove} />
        </PlaceItemBlock> */}
      </div>
    </PlaceBoxBlock>
  );
};

export default PlaceBox;
