import { useModal } from "../../context/Modal";

const DeleteSpotModal = ({ spotId }) => {

  console.log(spotId)

  const { closeModal } = useModal();



  const onClick = () => {

  }

  return (
    <div className="delete-modal-container">
      <h1>
        Confirm Delete
      </h1>
      <h4>
        Are you sure you want to remove this spot from the listings?
      </h4>
      <button onClick={() => onClick()}>
        Yes (Delete Spot)
      </button>
      <button onClick={() => closeModal()}>
        No (Keep Spot)
      </button>

    </div>
  )


}

export default DeleteSpotModal