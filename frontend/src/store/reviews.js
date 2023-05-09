import { csrfFetch } from "./csrf";

//action types
const GET_SPOT_REVIEWS = 'reviews/spotId'
const CREATE_SPOT_REVIEW = 'reviews/createReview'

//creator
const loadSpotReviews = (reviews) => {
  return {
    type: GET_SPOT_REVIEWS,
    reviews
  }
}

const createSpotReview = (review) => {
  return {
    type: CREATE_SPOT_REVIEW,
    review
  }
}

//thunk
export const loadSpotReviewsThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
  if (res.ok) {
    const reviews = await res.json()
    dispatch(loadSpotReviews(reviews))
    //return value is {'Reviews':[{},{}...]}
  }
}

export const createSpotReviewThunk = ({ spotId, review, stars }) =>
  async (dispatch) => {
    const thunkReview = {
      review: review,
      stars: stars
    }
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(thunkReview)
    })
    if (res.ok) {
      const review = await res.json()
      dispatch(createSpotReview(review))
      return review
    } else {
      const errors = await res.json()
      return errors
    }
  }


//reducer

const initialState = {}
const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPOT_REVIEWS: {
      const newState = {}
      const reviewArr = action.reviews.Reviews
      reviewArr.forEach((review) => {
        newState[review.id] = review
      })
      return newState
    } case CREATE_SPOT_REVIEW: {
      const newState = {...state}
      newState[action.review.id] = action.review
      return newState
    }
    default:
      return state;
  }
};

export default reviewReducer