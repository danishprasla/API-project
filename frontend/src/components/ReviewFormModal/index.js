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
  const [starHover, setStarHover] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  // const userId = useSelector(state => state.session.user.id)
  const spot = useSelector(state => state.spots)
  const spotId = Object.keys(spot)[0]
  // console.log(spotId)


  // useEffect(() => {
  //   // console.log(starHover)
  // }, [starRating, starHover])
  useEffect(() => {
    let errors = {}
    if (starRating === 0) {
      errors.stars = 'Select a star rating before submitting'
    } if (reviewMessage.length < 10) {
      errors.review = 'You must provide a review of at least 10 characters before submitting'
    }if (reviewMessage.length > 255) {
      errors.review = 'Review must be less than 255 characters'
    }
    setErrors(errors)
    // console.log(errors)
  }, [starRating, reviewMessage, submitted])


  const handleSubmit = (e) => {
    e.preventDefault();
    closeModal()
    const review = {
      spotId: spotId,
      review: reviewMessage,
      stars: starRating
    }

    if (Object.values(errors).length === 0) {

      const newReview = dispatch
        (createSpotReviewThunk(review))
      if (newReview.errors) {
        setErrors(newReview.errors)
      }
    } else {
      setSubmitted(true)
    }

  };

  return (
    <div className="review-form-modal">
      <h2 className="review-form-modal-header">How was your stay?</h2>
      <form onSubmit={handleSubmit}>
        <div className="review-form-wrapper">
          <label>
            {(errors.review && submitted) && (
              <div className="error-message">
                {errors.reviewMessage}
              </div>
            )}
            <textarea
              type="text"
              value={reviewMessage}
              placeholder="Leave your review here (must be 30 characters or more)..."
              className="review-form-input"
              onChange={(e) => setReviewMessage(e.target.value)}
              required
            />
          </label>
          <div className="star-review-container">
            {(errors.stars && submitted) && (
              <div className="error-message">
                {errors.star}
              </div>
            )}
            <label>
              <input
                type="radio"
                name="rating"
                onChange={() => setStarRating(1)}
                className="star"
              />
              {(starRating >= 1 || starHover >= 1) ? (
                <i className="fa-solid fa-star fa-xl"
                  onMouseEnter={() => setStarHover(1)}
                  onMouseLeave={() => setStarHover(0)}></i>

              ) : (
                <i className="fa-regular fa-star
                 fa-xl"
                  onMouseEnter={() => setStarHover(1)}
                  onMouseLeave={() => setStarHover(0)}></i>
              )}
            </label>
            <label>
              <input
                type="radio"
                name="rating"
                className="star"
                onChange={() => setStarRating(2)}

              />
              {(starRating >= 2 || starHover >= 2) ? (
                <i className="fa-solid fa-star fa-xl"
                  onMouseEnter={() => setStarHover(2)}
                  onMouseLeave={() => setStarHover(0)}></i>

              ) : (
                <i className="fa-regular fa-star fa-xl"
                  onMouseEnter={() => setStarHover(2)}
                  onMouseLeave={() => setStarHover(0)}></i>
              )}
            </label>
            <label>
              <input
                type="radio"
                name="rating"
                className="star"
                onChange={() => setStarRating(3)}
              />
              {(starRating >= 3 || starHover >= 3) ? (
                <i className="fa-solid fa-star fa-xl"
                  onMouseEnter={() => setStarHover(3)}
                  onMouseLeave={() => setStarHover(0)}></i>

              ) : (
                <i className="fa-regular fa-star fa-xl"
                  onMouseEnter={() => setStarHover(3)}
                  onMouseLeave={() => setStarHover(0)}></i>
              )}
            </label>
            <label>
              <input
                type="radio"
                name="rating"
                className="star"
                onChange={() => setStarRating(4)}

              />
              {(starRating >= 4 || starHover >= 4) ? (
                <i className="fa-solid fa-star fa-xl"
                  onMouseEnter={() => setStarHover(4)}
                  onMouseLeave={() => setStarHover(0)}></i>

              ) : (
                <i className="fa-regular fa-star fa-xl"
                  onMouseEnter={() => setStarHover(4)}
                  onMouseLeave={() => setStarHover(0)}></i>
              )}
            </label>
            <label>
              <input type="radio"
                name="rating"
                className="star"
                onChange={() => setStarRating(5)}
              />
              {(starRating >= 5 || starHover >= 5) ? (
                <i className="fa-solid fa-star fa-xl"
                  onMouseEnter={() => setStarHover(5)}
                  onMouseLeave={() => setStarHover(0)}></i>

              ) : (
                <i className="fa-regular fa-star fa-xl"
                  onMouseEnter={() => setStarHover(5)}
                  onMouseLeave={() => setStarHover(0)}></i>
              )}

            </label>
            <div className="review-modal-star-text">

              Stars
            </div>

          </div>

          <button
            type="submit"
            className={Object.values(errors).length > 0 ? "disabled-review-modal-submit" : "enabled-review-modal-submit"}
            disabled={Object.values(errors).length > 0 ? true : false}
          >Submit Your Review</button>
        </div>
      </form>
    </div>
  );
}

export default ReviewFormModal;