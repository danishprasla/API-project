import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./ReviewForm.css"

function ReviewFormModal() {
  const dispatch = useDispatch();
  const [reviewMessage, setReviewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();

  };

  return (
    <>
      <h1>How was your stay?</h1>
      <form onSubmit={handleSubmit}>
        <div className="review-form-wrapper">
          <label>
            <textarea
              type="text"
              value={reviewMessage}
              placeholder="Leave your review here..."
              onChange={(e) => setReviewMessage(e.target.value)}
              required
            />
          </label>
          <label>
          <i class="fa-regular fa-star fa-xl"></i>
          <i class="fa-solid fa-star fa-xl"></i>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <button type="submit">Submit Your Review</button>
        </div>
      </form>
    </>
  );
}

export default ReviewFormModal;