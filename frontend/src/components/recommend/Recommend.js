import React, { useEffect, useState, useCallback } from "react";
import Physical from "../images/Physical.png";
import Auditory from "../images/Auditory.png";
import Pregnant from "../images/Pregnant.png";
import Senior from "../images/Senior.png";
import Visual from "../images/Visual.png";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import RecommendCardList from "./RecommendCardList.js";
import { Container, Box } from "@material-ui/core";
import RecommendCategories from "./RecommendCategories";
import { useSelector } from 'react-redux';
import { userInfo } from "../../_actions/user_actions";
import { useDispatch } from "react-redux";

const Recommend = () => {

  const dispatch = useDispatch();
  const [itemList, setItemList] = useState([]);
  const [user, setUser] = useState([]);
  const [category, setCategory] = useState("all");
  const onSelect = useCallback(
    (category) => (setCategory(category), console.log(category)),
    []
  );

  // 시도 설정
  const [cityList, setCityList] = useState([]);
  const [townList, setTownList] = useState([]);
  const [city, setCity] = useState('');
  const [town, setTown] = useState('');
  // const [user, setUser] = useState([]);

  // 위도, 경도 설정
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    const SetRecommendPage = () => {
      const token = localStorage.accessToken
      dispatch(userInfo(token)).then(res => {
        setUser(res.payload)
        const findMyLocation = () => {      
            
            // Geolocation API에 액세스할 수 있는지를 확인
            if (navigator.geolocation) {
                //위치 정보를 얻기
                navigator.geolocation.getCurrentPosition (function(res) {
                  console.log(res)
                  setLatitude(res.coords.latitude);   // 위도
                  setLongitude(res.coords.longitude); // 경도
                  axios(
                    {
                      method: 'GET',
                      url:'recommend/myloc',
                      params: {
                        lat : res.coords.latitude,
                        lng : res.coords.longitude,
                        radius : 20000,
                        userSeq: user.userSeq
                      }
                    }
                  ).then(function (res) {
                    console.log(res)
                    // setItemList(res.data)
                    // console.log(itemList)
                  });
                }
                );

            } else {
                alert("이 브라우저에서는 Geolocation이 지원되지 않습니다.")
            }
          };
          findMyLocation();

          const loadPage = () => {
            axios(
              {
                method: 'GET',
                url:'recommend/myloc',
                params: {
                  lat : latitude,
                  lng : longitude,
                  radius : 20000,
                  userSeq: user.userSeq
                }
              }
            ).then(function (res) {
              console.log(res)
              setItemList(res.data)
              // console.log(itemList)
            });
          }
          loadPage();

          const setCityDropdown = () => {
            axios({
              method: "GET",
              url: "recommend/sido",
            }).then(function (res) {
              // console.log(res.data);
              setCityList(res.data);
            });
          };
          setCityDropdown();          
      })
        }
      
      SetRecommendPage();
      }, []);

          

      //     
      //     loadPage();

      //   })
      // } else {
      //   alert('로그인이 필요합니다.')
      // }

      //!!!!!!!!!!!!!!! 로그인이 안됐을 때 로그인 하라는 페이지가 나와야함
// 
    // }
    
  //   const setCityDropdown = () => {
  //     axios(
  //       {
  //         method: 'GET',
  //         url: 'recommend/sido'
  //       }
  //     ).then(function (res) {
  //       // console.log(res.data)
  //       setCityList(res.data)
  //       // console.log(cityList)
  // const [city, setCity] = useState("");
  // const [town, setTown] = useState("");

  // useEffect(() => {
  //   // console.log(user)
  //   const setRecommendPage = () => {
  //     axios({
  //       method: "GET",
  //       url: "post/all?userSeq=1",
  //     }).then(function (res) {
  //       setItemList(res.data);
  //     });
    // };



  // // 여행 지역 선택하기
  // const selectTown = (sidoCode) => {
  //   axios(
  //     {
  //       url: 'recommend/sigungu',
  //       method: 'GET',
  //       params: {
  //         sidoCode: sidoCode
  //       }
  //     }).then(function (res) {
  //       console.log(res)
  //       setTownList(res.data)
  //       // console.log(townList)
  //     })
  // };
  
  // const handleChangeCity = (event) => {
  //   if (town) {
  //     setTown('')
  //   }
  //   console.log(event)
  //   if (event.target.value != 8) {
  //     setCity(event.target.value);
  //     selectTown(event.target.value);
  //   } else {
  //     setTownList([])
  //   }
  // }
  
  // const handleChangeTown = (event) => {
  //   console.log(event.target)
  //   setTown(event.target.value)
  //   console.log(town)
  // }
  
  // // 장애 정보 선택하기
  // // const onClickBarrier = (res) => {
  // //   const barrier = res.target.id
  // //   axios(
  // //     {
  // //       url:'post/all',
  // //       params:{
  // //         userSeq: user.userSeq,
  // //         impairment: barrier
  // //       }
  // //     }
  // //   ).then(function (res) {
  // //     console.log(user)
  // //     setItemList(res.data)
  // //     console.log(barrier)
  // //   })
  // // }
  
  // // !!!!!!!!!!!!! 검색 기능 만들기
  // const onClickSearch = () => {
    
  // }



  return (
    <div>
      <Container maxWidth="md">
        <h2>내 주변 무장애 여행지</h2>
        <Box border={1}>
          <h3>무장애 선택하기</h3>
          {/* <div>
            <img id="physical" onClick={onClickBarrier} src={Physical}></img>
            <img id="visual" onClick={onClickBarrier} src={Visual}></img>
            <img id="auditory" onClick={onClickBarrier} src={Auditory}></img>
            <img id="pregnant" onClick={onClickBarrier} src={Pregnant}></img>
            <img id="senior" onClick={onClickBarrier} src={Senior}></img>
          </div> */}
          <h3>무장애 여행지역</h3>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="find-city">시도 검색</InputLabel>
            <Select
            labelId="find-city"
            id="find-city"
            value={city}
            // onChange={handleChangeCity}
            label="시도">
              {cityList.map(city => (
                <MenuItem name={city.name} value={city.code} key={city.rnum}>{city.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="find-town">시구군 검색</InputLabel>
            <Select
            labelId="find-town"
            id="find-town"
            value={town}
            // onChange={handleChangeTown}
            label="시도">
              {townList.map(town => (
                <MenuItem value={town.code} key={town.rnum}>{town.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <div>
            <Button variant="contained">검색</Button>
            <Button variant="contained">초기화</Button>
          </div>
        </Box>
        <RecommendCategories category={category} onClick={onSelect}></RecommendCategories>
        {itemList.map(item => (
            <p>{item.title}</p>
          ))}
        {/* <RecommendCardList itemList={itemList} category={category}></RecommendCardList> */}
      </Container>
    </div>
  );
};

export default Recommend;