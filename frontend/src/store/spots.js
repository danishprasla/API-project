import { csrfFetch } from "./csrf";

//action types
const LOAD_ALL_SPOTS = 'spots/loadAllSpots'

//creators
const loadAllSpots = (spots) => {
  return {
    type: LOAD_ALL_SPOTS,
    spots
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
    default:
      return state;
  }
};

export default spotsReducer