import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';

const RegisterForm = () => {
  const [pwdCfm, setPwdCfm] = useState(true);
  const navigate = useNavigate();
  const [registerloading, setRegisterloading] = useState(false);
  const [regform, setForm] = useState({
    userId: '',
    userEmail: '',
    userPwd: '',
    userNickname: '',
    physical: 0,
    visibility: 0,
    infant: 0,
    senior: 0,
    deaf: 0,
    EnableuserId: false,
    EnableuserNickname: false,
  });

  const onChange = (event) => {
    setForm({ ...regform, [event.target.name]: event.target.value });
  };

  useEffect(() => setRegisterloading(false), []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const idExp = /^[a-zA-Z0-9]/;
    const regExp =
      /^(?=.*[A-Za-z0-9])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d@$!%*#?&]/;
    const nicknameExp = /^[A-Za-z0-9가-힣_]/;
    const {
      userId,
      userEmail,
      userPwd,
      userPwdCfm,
      userNickname,
      EnableuserId,
      EnableuserNickname,
    } = regform;

    if (idExp.test(userId) === false) {
      alert('아이디는 영어, 숫자만 가능합니다');
      return;
    }
    if (userId.length < 5 || userId.length > 20) {
      alert('아이디는 5~20자 까지만 가능합니다.');
      return;
    }
    if (regExp.test(userPwd) === false) {
      alert('비밀번호는 영어, 숫자, !@#$%^&*를 포함해야합니다.');
      return;
    }
    if (userPwd.length < 8 || userPwd.length > 16) {
      alert('비밀번호는 8자~16자까지만 가능합니다.');
      return;
    }
    if (nicknameExp.test(userNickname) === false) {
      alert('닉네임은 한글,영어,숫자만 가능합니다.');
      return;
    }
    if (userNickname.length < 2 || userNickname.length > 8) {
      alert('닉네임은 2~8자까지만 가능합니다.');
      return;
    }
    if (EnableuserId === false) {
      alert('아이디 중복 여부를 확인해주세요');
      return;
    }
    if (EnableuserNickname === false) {
      alert('닉네임 중복 여부를 확인해주세요');
      return;
    }
    if (
      (userId,
      userEmail,
      userPwd,
      userPwdCfm,
      userNickname,
      EnableuserId,
      EnableuserNickname)
    ) {
      if (userPwd !== userPwdCfm) {
        setPwdCfm(false);
        return;
      } else {
        setPwdCfm(true);
      }
      setRegisterloading(true);
      try {
        await axios({
          url: '/user/join/',
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
          data: regform,
        }).then((res) => {
          if (res.data === 'fail') {
            alert('이미 가입된 이메일입니다.😅');
          } else if (res.data === 'success') {
            alert('회원가입이 완료되었습니다!😀');
            navigate('/registerpage/emailcheck');
          }
        });
      } catch (error) {
        alert('오류가 발생했어요!😅');
      }
    } else {
      alert('빈 값을 채워주세요!');
    }
  };

  return (
    <AuthForm
      type="register"
      onChange={onChange}
      onSubmit={onSubmit}
      form={regform}
      setForm={setForm}
      pwdCfm={pwdCfm}
      loading={registerloading}
    />
  );
};

export default RegisterForm;
