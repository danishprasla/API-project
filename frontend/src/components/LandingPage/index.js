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
    <div className="spots-container">
      {spots.map((spot) => (
        <div
          key={spot.id}
          className="spot-tile"
          onClick={() => history.push(`/spots/${spot.id}`)}
          title={spot.name}
        >
          <img
            src={spot.previewImage}
            alt={spot.name}
            className="spot-image"
          />
          <div className="spot-description">
            <div className="location">
              {spot.city}, {spot.state}
            </div>
            <div className="rating">
              <i className="fas fa-star"></i>
              {spot.avgRating}
            </div>

          </div>
          <div className="spot-price-container">
            <span className="spot-price">
              ${spot.price}
            </span> night
          </div>

        </div>
      ))}
    </div>
  )



}

export default LandingPageIndex