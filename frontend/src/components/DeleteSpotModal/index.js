import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteUserSpotThunk } from "../../store/spots";

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
      <h1>
        Confirm Delete
      </h1>
      <h4>
        Are you sure you want to remove this spot from the listings?
      </h4>
      <button onClick={(e) => handleDeleteClick(e)}>
        Yes (Delete Spot)
      </button>
      <button onClick={(e) => closeModal()}>
        No (Keep Spot)
      </button>

    </div>
  )


}

export default DeleteSpotModal