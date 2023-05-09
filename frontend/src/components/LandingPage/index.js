import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loadAllSpotsThunk } from "../../store/spots"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import './LandingPage.css'



const LandingPageIndex = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const spotsObj = useSelector(state => state.spots)

  const spots = Object.values(spotsObj)

  useEffect(() => {
    dispatch(loadAllSpotsThunk())

  }, [dispatch])

  // console.log('spots ---->', spots)
 
  return (
    <div className="spots">
      {spots.map((spot) => (
        <div
          key={spot.id}
          className="spotTile"
          onClick={() => history.push(`/spots/${spot.id}`)}
          title={spot.name}
        >
          <img
            src={spot.previewImage}
            alt={spot.name}
            className="spotImage"
          />
          <div className="spotDescription">
            <div className="location">
              {spot.city}, {spot.state}
            </div>
            <div className="rating">
              <i className="fas fa-star"></i> 
              {spot.avgRating}
            </div>

          </div>
          <div className="spotPrice">
            ${spot.price} night
          </div>

        </div>
      ))}
    </div>
  )



}

export default LandingPageIndex