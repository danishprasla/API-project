import { csrfFetch } from "./csrf";

//action types
const LOAD_ALL_SPOTS = 'spots/loadAllSpots'
const LOAD_ONE_SPOT = 'spots/loadOneSpot'

//creators
const loadAllSpots = (spots) => {
  return {
    type: LOAD_ALL_SPOTS,
    spots
  }
}

const loadOneSpot = (spot) => {
  return {
    type: LOAD_ONE_SPOT,
    spot
  }
}

//thunks
//get all spots thunk
export const loadAllSpotsThunk = () => async (dispatch) => {
   const res = await csrfFetch('/api/spots')
   if (res.ok) {
    const spots = await res.json()
    dispatch(loadAllSpots(spots))
    //return value is {'Spots':[{},{}...]}
   }
}
//get one spot thunk
export const loadOneSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`)
  if (res.ok) {
    const spot = await res.json()
    dispatch(loadOneSpot(spot))
  }
}

const initialState = {}
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALL_SPOTS: {
      const newState = {...state}
      const spotsArr = action.spots.Spots
      spotsArr.forEach((spot) => {
        newState[spot.id] = spot
      })
      return newState
    }
    case LOAD_ONE_SPOT: {
      const newState = {}
      newState[action.spot.id] = action.spot
      return newState
    }
    default:
      return state;
  }
};

export default spotsReducer