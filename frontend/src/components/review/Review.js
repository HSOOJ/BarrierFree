import React, { useEffect, useState } from 'react';
import Rating from '@mui/material/Rating';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
import { useParams } from 'react-router';
import CommentItem from './CommentItem.js';
import './ReviewTest.css';
import { useDispatch, useSelector } from 'react-redux';
import { commentSave } from '../../_actions/comment_actions';
import styled from 'styled-components';
import palette from '../../lib/styles/palette.js';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button.js';
import {
  follow,
  resetRelationship,
  unfollow,
} from '../../_actions/relationship_actions.js';
import ReviewBarrierIcon from '../common/review/ReviewBarrierIcon.js';
import { setPostContent } from '../../_actions/write_actions.js';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import LocationIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import BarrierFreeLogoBig from '../images/BarrierFreeLogoBig.png';

const ReviewBox = styled.div`
  display: flex;
  flex-dirextion: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 40px;
  .toggle {
    background: ${palette.gray[0]};
    color: ${palette.blue[0]};
    text-align: center;
    margin: auto;
    width: 40px;
    height: 40px;
    border-radius: 100px;
    box-sizing: border-box;
    &:hover {
      background: ${palette.pink[0]};
      color: white;
      cursor: pointer;
    }
  }
  .smc {
    width: 150px;
    height: 150px;
  }
  .span {
    display: flex;
    // flex-dirextion: row;
    display: table-cell;
    vertical-align: middle;
  }
`;

const profileImg = styled.img``;
const Review = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageNum = useParams();
  const reviewNum = Number(pageNum.reviewCard);
  const myuser = useSelector((state) => state.user.userData);
  const [postInfo, setPostInfo] = useState(null);
  // review ?????? ???????????? ?????? const
  // debugger;
  const [reviewDetail, setReviewDetail] = useState([]);
  const [barriers, setBarriers] = useState([]);
  const [reviewPoint, setReviewPoint] = useState([]);
  const [comments, setComments] = useState([]);
  const [reviewTime, setReviewTime] = useState('');
  const [reviewImage, setReviewImage] = useState('');
  const [otherUser, setOtherUser] = useState('');
  const [imgAlt, setImgAlt] = useState('');
  const commentCnt = comments.length;
  // ?????? ????????? ?????? const
  const [heart, setHeart] = useState(false);
  const [scraptimes, setScraptimes] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { kakao } = window;
  const onCommentHandler = (event) => {
    setNewComment(event.target.value);
  };
  const onCommentReset = () => {
    setNewComment('');
  };

  const [loading, setLoading] = useState(false);
  const [checkFw, setCheckFw] = useState(false);
  // const postScrap = reviewDetail.postScrap
  // review ?????? ?????? ?????? ?????????????????? ??????
  useEffect(() => {
    axios({
      method: 'get',
      url: '/scrap/check',
      params: {
        scrap_data: reviewNum,
        scrap_type: 0,
        user_seq: myuser.userSeq,
      },
    }).then(function (res) {
      if (res.data.scrap_yn == 'y') {
        setHeart(true);
      }
    });
    getDetailFn();
    getCommentList();
  }, []);

  async function getDetailFn() {
    setLoading(true);
    try {
      const res = await axios({
        method: 'GET',
        url: '/post/detail',
        params: { postSeq: reviewNum },
      });
      setPostInfo(res.data[0]);
      setReviewDetail(res.data[0].post);
      setBarriers(res.data[0].impairment);
      setReviewPoint(res.data[0].post.postPoint);
      setReviewTime(res.data[0].post.regDt.substring(0, 10));
      setReviewImage(res.data[0].post.postPhoto);
      setImgAlt(res.data[0].post.postAlt);
      setScraptimes(res.data[0].post.postScrap);
      // kakaomap_rendering(res.data[0].post);
      const response = await axios({
        method: 'get',
        url: '/othersFeed/main',
        params: {
          otherUserSeq: res.data[0].post.userSeq,
          userSeq: myuser.userSeq,
        },
      });
      setOtherUser(response.data);
      // console.log('otheruser', otherUser);
      const response2 = await axios({
        method: 'get',
        url: '/sns/isfollow',
        params: {
          otherUserSeq: res.data[0].post.userSeq,
          userSeq: myuser.userSeq,
        },
      });
      if (response2.data.isfollow === 'y') {
        setCheckFw(true);
      }
    } catch (e) {
      // console.log(e);
    } finally {
      setLoading(false);
    }
  }
  const getCommentList = () => {
    axios({
      method: 'GET',
      url: '/post/comment/detail',
      params: { postSeq: reviewNum },
    })
      .then((res) => {
        setComments(res.data);
        setNewComment('');
      })
      .catch('yes');
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (newComment) {
      let body = {
        cmtContent: newComment,
        postSeq: reviewNum,
        userSeq: myuser.userSeq,
      };
      dispatch(commentSave(body));

      alert('?????? ????????? ?????????????????????. ????');
    } else {
      alert('????????? ?????????????????? ????');
    }
    setNewComment('');
    getCommentList();
  };

  const onRemove = (id) => {
    setComments(comments.filter((comment) => comment.cmtSeq !== id));
  };

  // ?????????, ?????????

  const onUnfollow = () => {
    dispatch(unfollow(myuser.userSeq, reviewDetail.userSeq));
    setCheckFw(false);
    dispatch(resetRelationship());
  };

  const onFollow = () => {
    dispatch(follow(myuser.userSeq, reviewDetail.userSeq));
    setCheckFw(true);
    dispatch(resetRelationship());
  };
  const plusScrap = reviewDetail.postScrap + 1;

  const onClickHeart = () => {
    setHeart(true);
    setScraptimes(scraptimes + 1);
    console.log(otherUser);
    axios({
      method: 'get',
      url: '/scrap/insert',
      params: {
        scrap_data: reviewNum,
        scrap_type: 0,
        user_seq: myuser.userSeq,
      },
    });
    // axios({
    //   method: 'post',
    //   url: '/alarm/saveScrap',
    //   params: { userSeq: otherUser.userSeq, scrapSeq: reviewNum },
    // });
    const plusPostScrap = reviewDetail.userSeq + 1;
  };

  const onRemoveHeart = () => {
    setHeart(false);
    setScraptimes(scraptimes - 1);
    axios({
      method: 'put',
      url: '/scrap/delete',
      params: {
        scrap_data: reviewNum,
        scrap_type: 0,
        user_seq: myuser.userSeq,
      },
    });
  };
  const TTS = () => {
    const API_KEY = process.env.REACT_APP_KAKAO_API_KEY;
    const xmlData = '<speak>' + imgAlt + '</speak>';
    try {
      const { data } = axios
        .post(
          'https://kakaoi-newtone-openapi.kakao.com/v1/synthesize',
          xmlData,
          {
            headers: {
              'Content-Type': 'application/xml',
              Authorization: `KakaoAK ${API_KEY}`,
            },
            responseType: 'arraybuffer',
          },
        )
        .then(function (res) {
          // console.log(res);
          const context = new AudioContext();
          context.decodeAudioData(res.data, (buffer) => {
            const source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0);
          });
        });
    } catch (e) {
      // console.error(e.message);
    }
  };
  // ????????? ??????
  // console.log('reviewDeatil', reviewDetail);
  const onEdit = () => {
    dispatch(setPostContent(postInfo));
    navigate('/write');
  };

  // ????????? ??????
  const [open, setOpen] = React.useState(false);
  const [passOpen, setPassOpen] = React.useState(false);

  const onDelete = () => {
    axios({
      method: 'put',
      url: '/post/delete',
      params: {
        postSeq: reviewNum,
        userSeq: myuser.userSeq,
      },
    }).then(alert('????????? ?????????????????????!'), navigate(-1));
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePassOpen = () => {
    setPassOpen(true);
  };
  const updatePass = () => {
    const token = localStorage.getItem('accessToken');
    setPassOpen(true);
    axios({});
    handlePassClose();
  };

  const handlePassClose = () => {
    // setUserPwd('');
    // setUserConfirmPwd('');
    // setErrorMessage({
    //   ...errorMessage,
    //   confirmPwdError: '',
    //   pwdError: '',
    // });
    setPassOpen(false);
  };

  const [mapOpen, setMapOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickMapOpen = () => {
    setTimeout(() => {
      kakaomap_rendering(reviewDetail);
    }, 1);

    setMapOpen(true);
  };

  const handleMapClose = () => {
    setMapOpen(false);
  };

  const kakaomap_rendering = (data) => {
    const container = document.getElementById('myMap');
    const options = {
      center: new kakao.maps.LatLng(data.postLat, data.postLng),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    const markerPosition = new kakao.maps.LatLng(data.postLat, data.postLng);

    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });

    marker.setMap(map);

    var mapTypeControl = new kakao.maps.MapTypeControl();

    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);

    const roadviewContainer = document.getElementById('roadview');
    const roadview = new kakao.maps.Roadview(roadviewContainer);
    const roadviewClient = new kakao.maps.RoadviewClient();

    const position = new kakao.maps.LatLng(data.postLat, data.postLng);

    roadviewClient.getNearestPanoId(position, 50, function (panoId) {
      roadview.setPanoId(panoId, position);
    });
  };
  const handleImgError = (e) => {
    e.target.src = BarrierFreeLogoBig;
  };
  return (
    <ReviewBox>
      <Grid
        container
        spacing={3}
        sx={{ marginLeft: '8rem', marginRight: '14rem' }}
      >
        <Grid item xs={12} md={6} sm={12}>
          <div sx={{ width: '720px' }}>
            <img
              style={{ width: '100%', height: '720px', objectFit: 'cover' }}
              onError={handleImgError}
              alt="no image"
              src={reviewDetail.postPhoto}
              onClick={TTS}
              loading="????????? ????????? ?????? ?????? ???????????????."
            />
            <div>????????? ???????????? ?????? ????????? ????????? ??? ????????? ????</div>
          </div>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sm={12}
          sx={{ height: '720px', overflow: 'auto', float: 'right' }}
          className="content"
        >
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6}>
              <br></br>
              <div style={{ float: 'left' }}>
                {heart ? (
                  <FavoriteIcon
                    style={{
                      color: `${palette.pink[0]}`,
                      cursor: 'pointer',
                    }}
                    onClick={onRemoveHeart}
                  />
                ) : (
                  <FavoriteBorderIcon
                    onClick={onClickHeart}
                    style={{
                      color: `${palette.pink[0]}`,
                      cursor: 'pointer',
                    }}
                  />
                )}
                <span style={{ fontWeight: 'bold', fontSize: '20px' }}>
                  {scraptimes}
                </span>
              </div>
            </Grid>
            <Grid item xs={6} sm={6}>
              <div>
                <span>
                  {reviewDetail.userSeq == myuser.userSeq ? (
                    <div class="button-top">
                      <button
                        variant="contained"
                        id="update"
                        onClick={onEdit}
                        style={{ cursor: 'pointer' }}
                      >
                        ??????
                      </button>
                      <button
                        variant="contained"
                        id="delete"
                        impact
                        onClick={handleClickOpen}
                        style={{ cursor: 'pointer' }}
                      >
                        ??????
                      </button>
                    </div>
                  ) : (
                    <span></span>
                  )}
                </span>
              </div>

              <br></br>
            </Grid>
          </Grid>
          <div>
            <div
              style={{
                leftMargin: '4rem',
              }}
            >
              <br />
              <span
                style={{
                  fontSize: '35px',
                  fontWeight: 'bold',
                  leftMargin: '4rem',
                  float: 'left',
                }}
              >
                {reviewDetail.postTitle}
              </span>
              <div style={{ float: 'right', verticalAlign: 'right' }}>
                <div>
                  <Rating
                    name="read-only"
                    value={reviewPoint}
                    readOnly
                  ></Rating>
                </div>
                <div id="time" style={{ float: 'right' }}>
                  {reviewTime}
                </div>
              </div>
            </div>
            <br />
            <br /> <br />
            <div>
              <div
                style={{
                  cursor: 'pointer',
                  float: 'left',
                }}
              >
                <img
                  className="toggle"
                  src={otherUser.userPhoto}
                  onClick={() => {
                    navigate(`/user/${reviewDetail.userSeq}`);
                  }}
                ></img>
                <span
                  onClick={() => {
                    navigate(`/user/${reviewDetail.userSeq}`);
                    // console.log('????????? seq', reviewDetail.userSeq);
                  }}
                >
                  {otherUser.userNickname}
                </span>

                {checkFw ? (
                  <Button onClick={onUnfollow}>?????????</Button>
                ) : // ) : (reviewDetail.userSeq = myuser.userSeq) ? (
                reviewDetail.userSeq === myuser.userSeq ? (
                  <></>
                ) : (
                  <Button onClick={onFollow}>?????????</Button>
                )}
              </div>
            </div>
            <br></br>
            <br></br> <br></br>
            <br></br>
            <div style={{ fontSize: '18px', textAlign: 'left' }}>
              {reviewDetail.postContent}
            </div>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item xs={6} sx={{ textAlign: 'left' }}>
                <div style={{ cursor: 'pointer' }}>
                  <Typography
                    variant="body1"
                    onClick={handleClickMapOpen}
                    style={{ fontSize: '18px' }}
                  >
                    <LocationIcon sx={{ fontSize: 19 }} />
                    {reviewDetail.postLocation}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ fontSize: '15px' }}
                  >
                    &nbsp;&nbsp; &nbsp;{reviewDetail.postAddress}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div style={{ float: 'right' }}>
                  <InfoIcon></InfoIcon>
                  <ReviewBarrierIcon barriers={barriers}></ReviewBarrierIcon>
                </div>
              </Grid>
            </Grid>
            <div class="comment-box">
              <form onSubmit={onSubmitHandler}>
                <input
                  class="inputCmt"
                  placeholder="????????? ???????????????"
                  onChange={onCommentHandler}
                  value={newComment}
                ></input>
                <button
                  class="button"
                  onClick={onSubmitHandler}
                  variant="contained"
                  type="submit"
                >
                  ??????
                </button>
              </form>
              <br></br>
              <Typography
                variant="body2"
                color="text.secondary"
                class="comment"
              >
                ????????????({commentCnt})
              </Typography>
              {/* <hr class="hr-comment"></hr> */}
              <hr></hr>
              {commentCnt >= 1 ? (
                <div class="comment-list">
                  {comments.map((comment) => (
                    <CommentItem
                      comment={comment}
                      key={comment.cmtSeq}
                      onRemove={onRemove}
                      getCommentList={getCommentList}
                    />
                  ))}
                </div>
              ) : (
                <p class="no-comment">?????? ????????? ????????? ????</p>
              )}
            </div>
          </div>
        </Grid>

        <Dialog
          maxWidth="md"
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent style={{ margin: 'auto' }}>
            <h3> ???????????? ???????????? ??????????</h3> <span>????</span>
            <br></br>
            <br></br>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>?????? ????????????</Button>
            <Button impact autoFocus onClick={onDelete}>
              ??????
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          fullScreen={fullScreen}
          open={mapOpen}
          onClose={handleMapClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            <LocationIcon sx={{ fontSize: 22 }} /> {reviewDetail.postLocation}
          </DialogTitle>
          <DialogContentText id="alert-dialog-description">
            &nbsp; &nbsp; &nbsp;{reviewDetail.postAddress}
          </DialogContentText>
          <DialogContent
            id="myMap"
            style={{
              width: '450px',
              height: '350px',
              marginTop: '2rem',
            }}
          ></DialogContent>
          <DialogActions>
            <Button onClick={handleMapClose} autoFocus>
              ??????
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </ReviewBox>
  );
};

// https://mui.com/components/rating/ ??? ?????? ??? ??? ??? ???
export default Review;
