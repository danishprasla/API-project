import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteUserReviewThunk } from "../../store/reviews";


const DeleteReviewModal = ({ reviewId }) => {
  console.log('delete review modal review id =>', reviewId)
  const dispatch = useDispatch()
  const { closeModal } = useModal();



  const handleDeleteClick = (e) => {
    e.preventDefault()
    closeModal()
    dispatch(deleteUserReviewThunk(reviewId))
  }

  return (
    <div className="delete-modal-container">
      <h1 className="confirm-delete">
        Confirm Delete
      </h1>
      <h4 className="confirm-delete-message">
        Are you sure you want to delete this review?
      </h4>
      <div className="delete-modal-button-container">

        <button className="delete-button" onClick={(e) => handleDeleteClick(e)}>
          Yes (Delete Review)
        </button>
        <button className="dont-delete-button" onClick={(e) => closeModal()}>
          No (Keep Review)
        </button>
      </div>

    </div>
  )


}

export default DeleteReviewModal