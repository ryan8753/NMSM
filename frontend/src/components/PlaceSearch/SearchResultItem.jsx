import { useState } from "react"
import { useDispatch } from "react-redux"
import { addSpot } from "store/modules/selectedSpotsSlice"


function SearchResultItem({item, isLast}) {
  const [checked, setChecked] = useState(false)
  const dispatch = useDispatch()

  const handleClickSpot = (e) => {
    const placeUid = Number(e.target.id)
    const placeName = e.target.getAttribute("name")
    const lat = Number(e.target.getAttribute("lat"))
    const lng = Number(e.target.getAttribute("lng"))
    if (!checked) {
      dispatch(addSpot({placeUid, placeName, lat, lng}))
    }
    setChecked(true)
  } 

  return (
    <div className="recommend-spot" key={item.placeUid}>
      <div style={{display: "flex"}}>
        <img className="search-img" style={{alignSelf: "center"}} alt={item.placeName} src={item.imgPath} />
        <div style={{width: "55vw"}}>
          <span className="content-size block">{item.placeName}</span>
          {item.tag.map((tag, idx) => 
            <span className="subcontent-size inline-block" key={idx}>#{tag}</span>
          )}
        </div>
        <span 
          style={{marginLeft: "auto", alignSelf: "center"}}
          onClick={handleClickSpot}
          id={item.placeUid}
          name={item.placeName}
          lat={item.lat}
          lng={item.lng}
          className="select-click" >선택</span>
      </div>
      {isLast ? null : <hr />}
    </div>
  )
}

export default SearchResultItem