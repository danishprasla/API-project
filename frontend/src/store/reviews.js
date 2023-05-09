import { csrfFetch } from "./csrf";

//action types
const GET_SPOT_REVIEWS = 'reviews/spotId'

//creator
const loadSpotReviews = (reviews) => {
  return {
    type: GET_SPOT_REVIEWS,
    reviews
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
    }
    default:
      return state;
  }
};

export default reviewReducer