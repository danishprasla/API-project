import { csrfFetch } from "./csrf";

const CREATE_SPOT_IMAGE = "spotImage/create"

const createSpotImage = (spotImage) => {
  return {
    type: CREATE_SPOT_IMAGE,
    spotImage
  }
}

export const createSpotImageThunk = (spotImage) => async (dispatch) => {
  console.log('spotImage from spot image thunk -->',spotImage)
  const spotImageBody = {}
  spotImageBody.url = spotImage.url
  spotImageBody.preview = spotImage.preview
  console.log('value being passed into request ->', spotImageBody)
  const res = await csrfFetch(`/api/spots/${spotImage.spotId}/images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(spotImageBody)
  })
  if (res.ok) {
    const spotImage = await res.json()
    dispatch(createSpotImage(spotImage))
    return spotImage
  } else {
    const errors = await res.json()
    return errors
  }
  
}

const initialState = {}
const SpotImageReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SPOT_IMAGE: {
      const newState = { ...state }
      newState[action.spotImage.id] = action.spotImage
      return newState
    }
    default:
      return state;
  }
};

export default SpotImageReducer