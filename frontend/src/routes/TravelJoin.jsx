import axios from "axios"
import api from "api"

import {  useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"

import "./TravelJoin.css"
import "../globalStyle.css"
import { useState, useEffect } from "react"

const URL = "https://i7a609.p.ssafy.io/oauth2/authorization/kakao"

function TravelJoin() {

  const navigate = useNavigate()
  const { travelId, nickname } = useParams()

  if (!travelId || !nickname) {
    navigate("/", { replace: true })
  }

  const [ isLoggedIn, setIsLoggedIn ] = useState(false)

  const auth = useSelector((state) => state.auth)

  useEffect(() => {
    if (auth.token) {
      setIsLoggedIn(true)
    }
  }, [ auth.token ])

  const inviter = decodeURIComponent(nickname)

  // 홈으로 가기 클릭 시 동작
  const handleHomeClick = () => {
    navigate("/", {
      replace: true
    })
  }

  // 참여하기 클릭 시 동작
  const handleJoinClick = async () => {
    axios({
      method: "put",
      url: api.travel.getTravelJoinUrl(travelId),
      validateStatus: status => status === 200
    })
    .then((_) => {
      navigate(`/travel/${travelId}`, {replace: true})
    })
    .catch((_) => {
      navigate("/", {replace: true})
    })
  }

  // 로그인 클릭 시 동작
  const handleLoginClick = async () => {
    sessionStorage.setItem("invite-info", JSON.stringify({ travelId, nickname }))
    window.location.href = URL
  }

  return (
    <div className="travel-join-container" >
      <div className="travel-join-title subtitle-size">
        <p>{ inviter }의 여행에 초대되었습니다.</p>
        <p>같이 제주도로 떠날까요?</p>
      </div>
      <div className="travel-join-body">
        { isLoggedIn ? 
          <>
            <button onClick={handleJoinClick} className="travel-join-btn">
              참여하기
            </button> 
            <span onClick={handleHomeClick} className="subcontent-size">
              홈으로 가기
            </span>
          </>
          : 
          <>
            <div onClick={handleLoginClick} style={{height: "12vw"}}>
              <img className="kakao-box" alt="kakaoLoginBtn" src="/icons/kakaoLogo.png"></img>
            </div>
            <span>로그인 후 이용할 수 있는 서비스입니다. </span>
          </>
        }
      </div>
    </div>
  )

}

export default TravelJoin