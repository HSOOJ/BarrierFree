import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import ReviewBarrierIcon from './ReviewBarrierIcon';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import palette from '../../../lib/styles/palette';

const ReviewCard = ({ item }) => {
  const myuser = useSelector((state) => state.user.userData);
  // console.log('item in reviewCard', item);
  const navigate = useNavigate();
  const { postPhoto, postLocation, postTitle, scrapYn } = item;
  const barriers = item.impairment;
  const reviewCard = item.postSeq;
  const [heart, setHeart] = useState(false);

  const onClickCard = () => {
    if (myuser) {
      axios({
        method: 'GET',
        url: 'post/detail',
        params: { postSeq: reviewCard },
      }).then(function (res) {
        navigate(`/post/detail/${reviewCard}`);
      });
    } else {
      alert('로그인이 필요합니다!😀');
    }
  };
  const onClickHeart = () => {
    setHeart(true);
    axios({
      method: 'get',
      url: '/scrap/insert',
      params: {
        scrap_data: reviewCard,
        scrap_type: 0,
        user_seq: myuser.userSeq,
      },
    });
  };

  const onRemoveHeart = () => {
    setHeart(false);
    axios({
      method: 'get',
      url: '/scrap/insert',
      params: {
        scrap_data: reviewCard,
        scrap_type: 0,
        user_seq: myuser.userSeq,
      },
    });
  };
  useEffect(() => {
    if (item.scrapYn === 'y') {
      setHeart(true);
    }
  });

  return (
    <div>
      <Card
        reviewCard={reviewCard}
        sx={{ maxWidth: 250 }}
        style={{ cursor: 'pointer' }}
      >
        {heart ? (
          <h3 style={{ color: `${palette.pink[0]}`, cursor: 'pointer' }}>❤</h3>
        ) : (
          <h3
            onClick={onClickHeart}
            style={{ color: `${palette.pink[0]}`, cursor: 'pointer' }}
          >
            ♡
          </h3>
        )}
        <div onClick={onClickCard}>
          <CardMedia
            component="img"
            height="300"
            image={postPhoto}
            alt="Dog Picture"
          />

          <CardContent align="left">
            <Typography variant="body2" color="text.secondary">
              {postLocation}
            </Typography>
            {postTitle}

            <ReviewBarrierIcon barriers={barriers}></ReviewBarrierIcon>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};
export default ReviewCard;
