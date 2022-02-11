import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import WriteButtons from '../../components/write/WriteButtons';
import { initialize, writePost } from '../../_actions/write_actions';

const WriteButtonsContainer = () => {
  const myuserData = useSelector((state) => state.user.userData);
  const writeUserSeq = myuserData.userSeq;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    postTitle,
    postContent,
    postLocation,
    postPoint,
    deaf,
    infant,
    physical,
    visibility,
    senior,
    postAddress,
    postLat,
    postLng,
  } = useSelector(({ write }) => ({
    postTitle: write.postTitle,
    postContent: write.postContent,
    postLocation: write.postLocation,
    postPoint: write.postPoint,
    deaf: write.deaf,
    infant: write.infant,
    physical: write.physical,
    visibility: write.visibility,
    senior: write.senior,
    postAddress: write.postAddress,
    postLat: write.postLat,
    postLng: write.postLng,
  }));

  const onPublish = () => {
    if (!postTitle) {
      alert('글을 작성해주세요!😉');
      return;
    }
    dispatch(
      writePost({
        postTitle,
        postContent,
        postLocation,
        postPoint,
        writeUserSeq,
        deaf,
        infant,
        physical,
        visibility,
        senior,
        postAddress,
        postLat,
        postLng,
      }),
    );
    alert('글이 등록되었습니다! 인클루시브에 한발짝 다가가셨습니다 😊');
    dispatch(initialize());
  };
  return <WriteButtons onPublish={onPublish}></WriteButtons>;
};

export default WriteButtonsContainer;
