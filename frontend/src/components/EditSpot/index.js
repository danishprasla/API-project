import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { loadOneSpotThunk } from "../../store/spots"
import CreateSpotFormIndex from "../CreateSpotForm"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"


const EditReportIndex = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { spotId } = useParams()

  const userId = useSelector(state => state.session.user.id)

  useEffect(() => {
    dispatch(loadOneSpotThunk(spotId))

  }, [dispatch])

  const spotsObj = useSelector(state => state.spots)

  const spot = spotsObj[spotId]



  if (!spot) {
    return (
      <h3>Loading spot...</h3>
    )
  }
  const ownerId = spot.ownerId
  if (ownerId !== userId) {
    history.push('/')    
  }

  return (
    <CreateSpotFormIndex spot={spot} formType={'edit'}/>
  )
}

export default EditReportIndex