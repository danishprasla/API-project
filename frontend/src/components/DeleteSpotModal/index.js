import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteUserSpotThunk } from "../../store/spots";
import './DeleteSpotModal.css'

const DeleteSpotModal = ({ spotId }) => {

  console.log(spotId)
  const dispatch = useDispatch()
  const { closeModal } = useModal();



  const handleDeleteClick = (e) => {
    e.preventDefault()
    closeModal()
    dispatch(deleteUserSpotThunk(spotId))
  }

  return (
    <div className="delete-modal-container">
      <h1 className="confirm-delete">
        Confirm Delete
      </h1>
      <h4 className="confirm-delete-message">
        Are you sure you want to remove this spot from the listings?
      </h4>
      <div className="delete-modal-button-container">
        <button className="delete-button" onClick={(e) => handleDeleteClick(e)}>
          Yes (Delete Spot)
        </button>
        <button className="dont-delete-button" onClick={(e) => closeModal()}>
          No (Keep Spot)
        </button>
      </div>

    </div>
  )


}

export default DeleteSpotModal