import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Button from '../common/Button';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

const UserFollowerBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  img {
    margin: 1.5rem 0.75rem 0;
    width: 64px;
    height: 64px;
    border-radius: 32px;
    box-sizing: border-box;
  }
`;

const UserFollower = ({
  userNickname,
  userPhoto,
  follower_userSeq,
  isfollow,
}) => {
  const myuserData = useSelector((state) => state.user.userData);
  const myuser = myuserData.userSeq;
  const params = useParams();
  const currentUser = Number(params.userSeq);
  const navigate = useNavigate();

  const [checkFw, setCheckFw] = useState(false);
  useEffect(() => {
    if (isfollow === 'y') {
      setCheckFw(true);
    }
  }, []);

  const onUnfollow = async () => {
    try {
      const res = await axios({
        method: 'post',
        url: '/sns/unfollow',
        data: {
          userSeq: myuser,
          followingSeq: follower_userSeq,
        },
      });
      setCheckFw(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onFollow = async () => {
    try {
      const res = await axios({
        method: 'post',
        url: '/sns/follow',
        data: {
          userSeq: myuser,
          followingSeq: follower_userSeq,
        },
      });
      setCheckFw(true);
    } catch (error) {
      console.log(error);
    }
  };
  const onClick = () => {
    navigate(`/user/${follower_userSeq}`);
  };

  return (
    <UserFollowerBlock>
      <div className="UserController">
        <div>
          {}
          <div>
            <img src={userPhoto} onClick={onClick}></img>
            <span onClick={onClick}>{userNickname}</span>
            {myuser === follower_userSeq ? (
              <></>
            ) : checkFw ? (
              <Button onClick={onUnfollow} style={{ cursor: 'pointer' }}>
                팔로잉
              </Button>
            ) : (
              <Button onClick={onFollow} style={{ cursor: 'pointer' }}>
                팔로우
              </Button>
            )}
          </div>
        </div>
      </div>
    </UserFollowerBlock>
  );
};

const UserFollowers = () => {
  const [userfollowers, setUserfollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const myuserData = useSelector((state) => state.user.userData);
  const myuser = myuserData.userSeq;
  const params = useParams();
  const currentUser = Number(params.userSeq);

  useEffect(() => {
    const getfollower = async () => {
      try {
        setLoading(true);
        setError(null);
        setUserfollowers([]);
        if (currentUser === myuser) {
          const response = await axios({
            url: '/myFeed/follower',
            method: 'get',
            params: {
              userSeq: myuser,
            },
          });
          setUserfollowers(response.data);
          console.log(response.data);
        } else {
          const response = await axios({
            url: '/othersFeed/follower',
            method: 'get',
            params: {
              otherUserSeq: currentUser,
              userSeq: myuser,
            },
          });
          setUserfollowers(response.data);
        }
      } catch (error) {
        console.log(error.response.data);
        if (error.response.data === 'fail') {
          setError('팔로워가 없습니다.');
        } else {
          setError(error);
        }
      } finally {
        setLoading(false);
      }
    };
    getfollower();
  }, []);

  if (loading) return <div>로딩중..</div>;
  // if (error) return <div>{error}</div>;
  if (!userfollowers) return null;

  return (
    <div>
      <h3>UserFOLLOWERS</h3>
      {userfollowers &&
        userfollowers.map((userfollower) => (
          <UserFollower
            key={userfollower.userSeq}
            isfollow={userfollower.isfollow}
            userNickname={userfollower.userNickname}
            userPhoto={userfollower.userPhoto}
            follower_userSeq={userfollower.userSeq}
          />
        ))}
      {myuser === currentUser && userfollowers.length === 0 && (
        <h1>팔로워 없음</h1>
      )}
    </div>
  );
};

export default UserFollowers;
