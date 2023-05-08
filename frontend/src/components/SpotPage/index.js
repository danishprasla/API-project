import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loadOneSpotThunk } from "../../store/spots"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"


const SpotPageIndex = () => {
  const dispatch = useDispatch()
  const { spotId } = useParams()
  // const history = useHistory()

  const userId = useSelector(state => state.session.user.id)
  // console.log('user id--->', userId)
 
  useEffect(() => {
    dispatch(loadOneSpotThunk(spotId))

  }, [dispatch])

  const spotsObj = useSelector(state => state.spots)
  // console.log('test', spotsObj[spotId])
  const spot = spotsObj[spotId]



  if (!spot) {
    return (
      <h3>Loading spot...</h3>
    )
  }
  const ownerId = spot.ownerId
  // console.log(ownerId)
  console.log('userId->', userId)

  const spotImages = spot.SpotImages || []
  const previewImage = spotImages.find(spot => spot.preview === true);
  // console.log('preview image url --->', previewImage)
  const imageUrls = []

  for (let image of spotImages) {
    if (image.preview === false) {
      imageUrls.push(image.url)
    }
  }

  return (
    <div className="spot">
      <h3 className="spotName">
        {spot.name}
      </h3>
      <div className="spotLocation">
        {spot.city}, {spot.state}, {spot.country}
      </div>
      <div className="spotImages">
        {previewImage && (
          <div className="spotPreview">
            <img src={previewImage.url} />
          </div>
        )}
        {imageUrls.length > 0 &&

          <div className="otherImages">
            {imageUrls.map(url => (
              <img key={url} src={url} />
            ))}
          </div>
        }
      </div>
      {spot.Owner &&
        <div className="details">
          <div className="spotDetails">
            <h3>
              Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
            </h3>
            <div className="description">
              {spot.description}
            </div>
          </div>
          <div className="booking">
            <div className="booking-details">
              <div className="priceDetail">
                <span className="price">${spot.price}</span>
                <span className="night"> night</span>
              </div>
              <div className="reviewDetails">
                {spot.avgRating} &#183; {spot.numReviews} reviews
                {userId !== ownerId && (
                  <button
                    className="reserveButton"
                    onClick={() => alert('Feature Coming Soon...')}
                  > Reserve </button>
                )}
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default SpotPageIndex