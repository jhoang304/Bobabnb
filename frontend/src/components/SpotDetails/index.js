import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { singleSpotThunk } from "../../store/spot";
import { spotReviewsThunk } from "../../store/review";
import { useParams } from "react-router-dom";
import "./SpotDetails.css";
import OpenModalButton from "../OpenModalButton";
import CreateReviewModal from "../CreateReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";
import { NO_PHOTO } from "../../constants";
import NotFound from "../NotFound";

export default function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spot.singleSpot);
  const reviewsById = useSelector((state) => state.review.bySpot[spotId]);
  // const user = useSelector((state) => state.review.reviews);
  const sessionUser = useSelector((state) => state.session.user);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setNotFound(false);
    dispatch(singleSpotThunk(spotId)).catch(() => setNotFound(true));
  }, [dispatch, spotId]);

  useEffect(() => {
    // A missing spot is reported by the request above
    dispatch(spotReviewsThunk(spotId)).catch(() => {});
  }, [dispatch, spotId]);

  if (notFound) {
    return <NotFound message="That spot doesn't exist or has been deleted." />;
  }

  if (!spot) {
    return <div>Loading Spot...</div>;
  }

  if (!spot.SpotImages) {
    return <div>Loading Spot...</div>;
  }

  if (!reviewsById) {
    return <div>Loading Reviews...</div>
  }

  const reviews = Object.values(reviewsById);
  // Worked out from the loaded reviews so the summary changes as soon as a review is posted or deleted
  const numReviews = reviews.length;
  const avgStarRating = numReviews ? reviews.reduce((sum, review) => sum + review.stars, 0) / numReviews : null;

  // The API does not guarantee image order, so pick the preview explicitly and
  // keep it out of the thumbnail grid.
  const previewImage = spot.SpotImages.find((image) => image.preview === true);
  const otherImages = spot.SpotImages.filter((image) => image !== previewImage);

  const handleReserveClick = () => {
    alert("Feature Coming Soon...");
  };

  const convertedDate = (date) => {
    const newDate = new Date(date);
    const style = { month: 'long', year: 'numeric' };
    const goodDate = newDate.toLocaleString('en-US', style);
    return goodDate;
  }

  return (
    <div id="page">
    <div className="spot-container">
      <div className="name"> {spot.name}</div>
      <div className="location">
        {" "}
        {spot.city}, {spot.state}, {spot.country}{" "}
      </div>
      <div className="images-container">
        <div className="preview-image">
        {previewImage ? (
              <img
                id="main-img"
                src={previewImage.url}
                alt="Preview Pic of Spot"
              />
            ) : (
              <img
                id="main-img"
                src={NO_PHOTO}
                alt="No Preview Available"
              />
            )}
          </div>
        <div className="other-images">
        {[0, 1, 2, 3].map((index) => (
          <img
            key={otherImages[index] ? `spot-image-${otherImages[index].id}` : `placeholder-${index}`}
            className="other-image"
            src={otherImages[index] ? otherImages[index].url : NO_PHOTO}
            alt="Pic of Spot"
          />
        ))}
        </div>
      </div>
      <div className="belowImages">
        <div className="belowImages-info">
        <div className="hostInfo">
            Hosted by {spot.Owner && spot.Owner.firstName}{" "}
            {spot.Owner && spot.Owner.lastName}{" "}
          </div>
        <div className="description"> {spot.description}</div>
        </div>
        <div className="reserve-container">
            <div className="price-reviews">
          <div className="price">${spot.price} night</div>
          {/* <div className="reviews">
          <div className="starRating">
            <i className="fa-solid fa-star"></i>
            {avgStarRating}
          </div>
          <div className="reviewCount">{numReviews} reviews</div> */}
          <div className={numReviews === 0 ? "noReviews" : "reviews"}>
              {numReviews === 0 ? (
                <div className="noReviews">
                  <i className="fa-solid fa-star"></i>
                  <div className="newListing">New</div>
                </div>
              ) : (
                <div className="reviews">
                <div className="starRating">
                  <i className="fa-solid fa-star"></i>
                  {avgStarRating.toFixed(2)}
                </div>
                <div className="dot">·</div>
                  {/* <div className="reviewCount">{numReviews} reviews</div> */}
                  {numReviews === 1 ? <div className="reviewCount">{numReviews} review</div> : <div className="reviewCount">{numReviews} reviews</div>}
                </div>
              )}
          </div>
          </div>
          <button className="reserveButton" onClick={handleReserveClick}>
            Reserve Now
          </button>
        </div>
      </div>
      <div className="reviewsContainer">
      {/* <div className="mainReviews">
              <div className="starRating"> */}
               <div className={numReviews === 0 ? "noReviews" : "mainReviews"}>
                {numReviews === 0 ? (
                 <div className="noReviewsContainer">
                 <div className="noReviews">
                 <i className="fa-solid fa-star"></i>
                 <div className="newListing">New</div>
                </div>
                {sessionUser && sessionUser.id !== spot.ownerId && <div className="first">Be the first to post a review!</div>}
                </div>
                ) : (
                <div className="mainReviews">
                <div className="starRating">
                <i className="fa-solid fa-star"></i>
                {avgStarRating.toFixed(2)}
                </div>
                <div className="dot">·</div>
                {/* <div className="reviewCount">{numReviews} reviews</div> */}
                {numReviews === 1 ? <div className="reviewCount">{numReviews} review</div> : <div className="reviewCount">{numReviews} reviews</div>}
              </div>
            //   <div className="reviewCount">{numReviews} reviews</div>
            // </div>
            )}
            {/* <div> */}
            </div>
            <div className="postReview">
              {sessionUser && sessionUser.id !== spot.ownerId && (!reviews.find((review) => review.userId === sessionUser.id)) &&
               <OpenModalButton
              //  id="deleteButton"
               buttonText="Post Your Review"
               modalComponent={<CreateReviewModal spot={spot} />}
               />}
            </div>
        {/* </div> */}
        {reviews &&
          [...reviews].reverse().map((review) => (
            <div className="individualReview" key={`review-${review.id}`}>
              <div className="reviewUser">{review.User.firstName}</div>
              <div className="createdAt">{convertedDate(review.createdAt)}</div>
              <div className="reviewDescription">{review.review}</div>
              {/* {user && review.userId === user.id
              && <OpenModalButton
              buttonText="Delete Your Review"
                modalComponent={<DeleteReviewModal spot={spot} review={review}
                 />}
              />
              } */}
              {sessionUser && sessionUser.id === review.userId && (
              <OpenModalButton
              buttonText="Delete Your Review"
              modalComponent={<DeleteReviewModal review={review} />}
              />
              )}
            </div>
          ))}
      </div>
      </div>
    </div>
  );
}
