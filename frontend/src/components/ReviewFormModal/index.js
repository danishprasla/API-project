import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./ReviewForm.css"
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { createSpotReviewThunk } from "../../store/reviews";

function ReviewFormModal() {
  const dispatch = useDispatch();
  const [reviewMessage, setReviewMessage] = useState("");
  const [starRating, setStarRating] = useState(0);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const userId = useSelector(state => state.session.user.id)
  const spot = useSelector(state => state.spots)
  const spotId = Object.keys(spot)[0]
  console.log(spotId)


  useEffect(() => {

  }, [starRating])

  const handleSubmit = (e) => {
    e.preventDefault();
    closeModal()
    const review = {
      spotId: spotId,
      review: reviewMessage,
      stars: starRating
    }
    const newReview = dispatch(createSpotReviewThunk(review))

  };

  return (
    <>
      <h2>How was your stay?</h2>
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
          <div>
            <label>
              <input
                type="radio"
                name="rating"
                onChange={() => setStarRating(1)}
                className="star"
              />
              {(starRating >= 1) ? (
                <i className="fa-solid fa-star fa-xl"></i>

              ) : (
                <i className="fa-regular fa-star fa-xl"></i>
              )}
            </label>
            <label>
              <input
                type="radio"
                name="rating"
                className="star"
                onChange={() => setStarRating(2)}
              />
              {(starRating >= 2) ? (
                <i className="fa-solid fa-star fa-xl"></i>

              ) : (
                <i className="fa-regular fa-star fa-xl"></i>
              )}
            </label>
            <label>
              <input
                type="radio"
                name="rating"
                className="star"
                onChange={() => setStarRating(3)} />
              {(starRating >= 3) ? (
                <i className="fa-solid fa-star fa-xl"></i>

              ) : (
                <i className="fa-regular fa-star fa-xl"></i>
              )}
            </label>
            <label>
              <input
                type="radio"
                name="rating"
                className="star"
                onChange={() => setStarRating(4)}
              />
              {(starRating >= 4) ? (
                <i className="fa-solid fa-star fa-xl"></i>

              ) : (
                <i className="fa-regular fa-star fa-xl"></i>
              )}
            </label>
            <label>
              <input type="radio"
                name="rating"
                className="star"
                onChange={() => setStarRating(5)}
              />
              {(starRating >= 5) ? (
                <i className="fa-solid fa-star fa-xl"></i>

              ) : (
                <i className="fa-regular fa-star fa-xl"></i>
              )}

            </label>
            Stars

          </div>

          <button type="submit">Submit Your Review</button>
        </div>
      </form>
    </>
  );
}

export default ReviewFormModal;