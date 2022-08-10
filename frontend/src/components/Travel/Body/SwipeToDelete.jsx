import { useRef, useEffect, useState } from "react"
import "./SwipeToDelete.css"
import Place from "./Place"



function SwipeToDelete({ place, placeIdx, scheduleIdx, startTime, timeReq, timeReqs, setTimeReqs, directionError, isFirst, isLast, hold, vehicle }) {
  const listElementRef = useRef()
  const wrapperRef = useRef()

  const dragStartXRef = useRef(0)
  const leftRef = useRef(0)
  const draggedRef = useRef(false)

  useEffect(() => {
    window.addEventListener("mouseup", onDragEndMouse)
    window.addEventListener("touchend", onDragEndTouch)
    return () => {
      window.removeEventListener("mouseup", onDragEndMouse)
      window.removeEventListener("touchend", onDragEndTouch)
    }
  })

  const onDragStartMouse = (e) => {
    onDragStart(e.clientX)
    window.addEventListener("mousemove", onMouseMove)
  }

  const onDragStartTouch = (e) => {
    const touch = e.targetTouches[0]
    onDragStart(touch.clientX)
    window.addEventListener("touchmove", onTouchMove)
  }
  
  const onDragStart = (clientX) => {
    draggedRef.current = true
    dragStartXRef.current = clientX
    requestAnimationFrame(updatePosition)
  }
  
  const updatePosition = () => {
    if (draggedRef.current) {
      requestAnimationFrame(updatePosition)
      const width = -leftRef.current - 10
      if (width > 0) {
        setDeleteStyle({
          ...deleteStyle,
          backgroundColor: "red",
          width: `${width}px`,
        })

      }
    }
    listElementRef.current.style.transform = `translateX(${leftRef.current}px)`
  }

  const onMouseMove = (e) => {
    const left = e.clientX - dragStartXRef.current
    if (left < 0) {
      leftRef.current = left;
    }
  }

  const onTouchMove = (e) => {
    const touch = e.targetTouches[0]
    const left = touch.clientX - dragStartXRef.current
    if (left < 0) {
      leftRef.current = left;
    }
  }

  const onDragEndMouse = () => {
    window.removeEventListener("mousemove", onMouseMove)
    onDragEnd()
  }

  const onDragEndTouch = () => {
    window.removeEventListener("touchmove", onTouchMove)
    onDragEnd()
  }

  const onDragEnd = () => {
    if (draggedRef.current) {
      draggedRef.current = false;
      const threshold = 0.5;

      if (
        leftRef.current <
        listElementRef.current.offsetWidth * threshold * -1
      ) {
        leftRef.current = -listElementRef.current.offsetWidth * 2;
        wrapperRef.current.style.maxHeight = 0;
      } else {
        leftRef.current = 0;
      }

      listElementRef.current.className = "BouncingListItem";
      listElementRef.current.style.transform = `translateX(${leftRef.current}px)`;
    }
    setDeleteStyle({
      ...deleteStyle,
      backgroundColor: "white"
    })
  }

  const [ deleteStyle, setDeleteStyle ] = useState({
    position: "absolute",
    width: "0",
    height: "5vh",
    zIndex: "-1",
    color: "white",
    top: "2vh",
    right: "1vw",
    borderRadius: "5px",
    textAlign: "end",
    lineHeight: "5vh",
  })


  return (
    <>
      <div className="Wrapper" ref={wrapperRef}>
        <div style={deleteStyle}><span style={{marginRight :"10px"}}>삭제</span></div>
        <div
          className="BouncingListItem"
          ref={listElementRef}
          onMouseDown={onDragStartMouse}
          onTouchStart={onDragStartTouch}
        >
          <Place
            place={place}
            placeIdx={placeIdx}
            scheduleIdx={scheduleIdx}
            startTime={startTime}
            timeReq={timeReq}
            timeReqs={timeReqs}
            setTimeReqs={setTimeReqs}
            directionError={directionError}
            isFirst={isFirst}
            isLast={isLast}
            hold={hold}
            vehicle={vehicle}
          />
        </div>
      </div>
    </>
  )
}

export default SwipeToDelete