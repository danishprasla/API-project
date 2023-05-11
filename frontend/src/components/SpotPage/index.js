import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loadOneSpotThunk } from "../../store/spots"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"
import { loadSpotReviewsThunk } from "../../store/reviews"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"
import LoginFormModal from "../LoginFormModal"
import './SpotPage.css'
import ReviewFormModal from "../ReviewFormModal"
import DeleteReviewModal from "../DeleteReviewModal"

const convertDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
  const res = `${month} ${year}`
  return res
}

const SpotPageIndex = () => {
  const dispatch = useDispatch()
  const { spotId } = useParams()
  // const history = useHistory()

  const user = useSelector(state => state.session.user)
  let userId = ''
  if (user) {
    userId = user.id
  }
  const reviewsObj = useSelector(state => state.reviews)
  // const reviewsObj = Object.values(reviews.Reviews)
  // // console.log('user id--->', userId)
  // console.log(reviewsObj)

  useEffect(() => {
    // dispatch(loadOneSpotThunk(spotId))
    // console.log('spot id in useEffect ->', spotId)
    dispatch(loadSpotReviewsThunk(spotId))

  }, [dispatch])

  useEffect(() => {
    dispatch(loadOneSpotThunk(spotId));
  }, [dispatch, spotId, reviewsObj]);

  const spotsObj = useSelector(state => state.spots)
  // console.log('test', spotsObj[spotId])
  const spot = spotsObj[spotId]



  if (!spot || !reviewsObj) {
    return (
      <h3>Loading spot...</h3>
    )
  }
  const ownerId = spot.ownerId

  console.log('reviews ->', reviewsObj)
  const reviewsArr = Object.values(reviewsObj)

  const reviewCheck = reviewsArr.find(review => review.userId === userId)

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
      <h2 className="spot-name">
        {spot.name}
      </h2>
      <h4 className="spot-location">
        {spot.city}, {spot.state}, {spot.country}
      </h4>
      <div className="spot-images">
        {previewImage && (
          <div className="spot-preview">
            <img className="spot-preview-image" src={previewImage.url} />
          </div>
        )}
        {imageUrls.length > 0 &&

          <div className="other-images-container">
            {imageUrls.map(url => (
              <img className="other-images" key={url} src={url} />
            ))}
          </div>
        }
      </div>
      {spot.Owner &&
        <div className="details">
          <div className="spot-details">
            <h2>
              Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
            </h2>
            <div className="description">
              {spot.description}
            </div>
          </div>
          <div className="booking">
            <div className="booking-details">
              <div className="price-detail">
                <h2 className="booking-price">
                  ${spot.price}
                </h2>
                <span className="booking-night-text">
                  night
                </span>
              </div>

              <div className="booking-review-section">

                <i className="fas fa-star"></i>
                {spot.numReviews === 0 ? (
                  spot.avgStarRating
                ) : `${spot.avgStarRating} \u00b7 ${spot.numReviews} ${spot.numReviews === 1 ? "review" : "reviews"}`}
              </div>
            </div>

            {(userId !== ownerId && user) && (
              <div className="booking-button">
                <button
                  className="reserve-button"
                  onClick={() => alert('Feature Coming Soon...')}
                > Reserve </button>
              </div>
            )}
          </div>
        </div>
      }
      <div className="review-section" >

        <h3>
          <i className="fas fa-star"></i>
          {spot.numReviews === 0 ? (
            spot.avgStarRating
          ) : `${spot.avgStarRating} \u00b7 ${spot.numReviews} ${spot.numReviews === 1 ? "review" : "reviews"}`}

          {/* <i className="fas fa-star"></i>
          {spot.avgStarRating} &#183; {spot.numReviews} {spot.numReviews === 1 ? "review" : "reviews"} */}
        </h3>
        {(userId !== ownerId && !reviewCheck && user) && (
          // <button
          //   className="review-button"
          //   onClick={()=> <OpenModalMenuItem
          //     modalComponent={<LoginFormModal />}
          //   />}
          // >
          //   Post Your Review
          // </button>



          <button className='post-review-button'>
            <OpenModalMenuItem
              itemText="Post Your Review"
              modalComponent={<ReviewFormModal />}
            />
          </button>

        )}
        {(reviewsArr.length === 0 && userId !== ownerId && user) && (
          <div className="no-reviews">
            Be the first to post a review!
          </div>
        )}
        {reviewsArr.map((review) =>
        (<div key={review.id} className="user-review">

          <h4 className="review-firstname">
            {review.User?.firstName}
          </h4>
          <div className="review-date">
            {convertDate(review?.createdAt)}
          </div>
          <div className="review-content">
            {review.review}
          </div>
          {review.userId === userId && (
            <button className="delete-button-spot">
              <OpenModalMenuItem
                itemText="Delete"
                modalComponent={<DeleteReviewModal reviewId={review.id} />}
              />

            </button>
          )}
        </div>))
        }
      </div>
    </div >
  )
}

export default SpotPageIndex