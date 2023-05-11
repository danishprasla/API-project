import './CurrentSpots.css'
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loadAllSpotsThunk, loadCurrentUserSpotsThunk } from "../../store/spots"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import CreateSpotFormIndex from '../CreateSpotForm'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import ReviewFormModal from '../ReviewFormModal'
import DeleteSpotModal from '../DeleteSpotModal'

const CurrentSpotsIndex = () => {
  const spotsObj = useSelector(state => state.spots)
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadCurrentUserSpotsThunk())
  }, [dispatch])

  if (!spotsObj) {
    return (
      <h1>
        Loading...
      </h1>
    )
  }
  const spots = Object.values(spotsObj)
  console.log(spots)
  const editForm = 'edit'

  return (
    <div className="spots-container">
      {spots.map((spot) => (
        <div key={spot.id} className='spot-container'>
          <div
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
          <div className='spot-controls'>
            <button className='current-spot-update-button'
              onClick={() => {
                history.push(`/spots/${spot.id}/edit`)
              }}>
              Update
            </button>
            <button className='current-spot-delete-button'>
              <OpenModalMenuItem
                itemText="Delete"
                modalComponent={<DeleteSpotModal spotId={spot.id} />}
              />
            </button>
          </div>
        </div>

      ))}
    </div>
  )

}

export default CurrentSpotsIndex

// history.push(`/spots/${spot.id}/edit`)
// history.push({ pathname: '/spots/new', spot: spot, formType: editForm })
