// import { useDispatch, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import "./CreateReviewModal.css";
import "./Rating"
import { singleSpotThunk } from "../../store/spot";
import { spotReviewsThunk } from "../../store/review";
import { createReviewThunk } from "../../store/review";
import Rating from "./Rating";

function CreateReviewModal({ spot }) {
  const [errors, setErrors] = useState({});
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [formDisabled, setFormDisabled] = useState(true);
  const { closeModal } = useModal();
  const dispatch = useDispatch();
//   const history = useHistory();

  useEffect(() => {
    const errors = {};
    if (comment && !stars) {
      errors.stars = "Please input a star rating";
    }
    if (comment && comment.length < 10) {
      errors.review = "Comment needs a minimum of 10 characters";
    }
    setErrors(errors);
  }, [stars, comment]);

  useEffect(() => {
    if (!stars || !comment || stars < 1 || comment.length < 10) {
      setFormDisabled(true);
    } else {
      setFormDisabled(false);
    }
  }, [stars, comment]);

  const onChange = (stars) => {
    setStars(stars);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const submittedReview = { review: comment, stars };

    return dispatch(createReviewThunk(spot.id, submittedReview))
      .then(() => {
        closeModal();
        dispatch(singleSpotThunk(spot.id));
        dispatch(spotReviewsThunk(spot.id));
      })
      .catch(async (res) => {
        const data = await res.json();
        const fieldErrors = data.errors || {};
        if (fieldErrors.review || fieldErrors.stars) {
          setErrors(fieldErrors);
        } else {
          // e.g. "User already has a review for this spot" or "Spot couldn't be found"
          setErrors({ server: data.message || "Something went wrong. Please try again." });
        }
      });
  };

  return (
    <div id="postReviewContainer">
      <div className="postReviewHeading">How was your stay?</div>
      <label>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="comment-input"
          placeholder="Leave your review here..."
        />
      </label>
      {errors.review && <p>{errors.review}</p>}
      <div className="rating-input">
        <Rating disabled={false} stars={stars} onChange={onChange} />
        <div>Stars</div>
      </div>
      {errors.stars && <p>{errors.stars}</p>}
      {errors.server && <p>{errors.server}</p>}
      <button
        onClick={handleSubmit}
        className={formDisabled ? "submit-button-inactive" : "submit-button"}
        type="submit"
        disabled={formDisabled}
      >
        Submit Your Review
      </button>
    </div>
  );
}

export default CreateReviewModal;
