import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { Box, Container, Grid, Input } from "@material-ui/core";
import Dogimg from "../common/images/강아지.jpg";
import Rating from '@mui/material/Rating';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import axios from "axios";
import { useParams } from "react-router";
// import "./Review.css"
// import "styles.css";

const TourInfomation = () => {
  const pageNum = useParams()
  const infomationNum = Number(pageNum.infomationCard)
  
  // infomation 내용 불러오기 위한 const
  
  const [infomationDetail, setInfomationDetail] = useState([]);
  const [barriers, setBarriers] = useState([]);
  const [reviewPoint, setReviewPoint] = useState([]);
  const [comments, setComments] = useState([]);
  const [reviewTime, setReviewTime] = useState('');
    
  // review 창이 뜨자 마자 불러와져야할 것들
  useEffect(() => {
    getPostDetail();
  },[])
  
  const getPostDetail = () => {
    axios({
      method: 'GET',
      url: 'recommend/detail',
      params: {contentid: 126273}
    }
    ).then(res => {
      setInfomationDetail(res.data)
      // console.log(infomationDetail)
    }).catch('yes')
  };


  return (
    <div>
      <Container maxWidth="md">
        <Box border={1}>
          <div>
            <ArrowBackIcon></ArrowBackIcon>
            <span>{infomationDetail.title}</span>
          </div>
          <hr></hr>
          <img src={infomationDetail.firstimage}></img>
          <p>{infomationDetail.overview}</p>
          <Grid container>
              <InfoIcon></InfoIcon>
          </Grid>
          
          <div>
          </div>
        </Box>
      </Container>
    </div>
  )
}

// https://mui.com/components/rating/ 별 표시 할 때 쓸 것
export default TourInfomation;
