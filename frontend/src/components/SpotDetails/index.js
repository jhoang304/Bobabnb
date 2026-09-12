import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { singleSpotThunk } from "../../store/spot";
import { spotReviewsThunk } from "../../store/review";
import { useParams } from "react-router-dom";
import "./SpotDetails.css";
import OpenModalButton from "../OpenModalButton";
import CreateReviewModal from "../CreateReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";

const NO_PHOTO = "https://placehold.co/600x400/e8e8e8/777777.png?text=No+Photo+Available";

export default function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spot.singleSpot);
  const reviews = useSelector((state) => state.review.reviews);
  // const user = useSelector((state) => state.review.reviews);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(singleSpotThunk(spotId));
    console.log("spot:", spot);
  }, [dispatch, spotId]);

  useEffect(() => {
    dispatch(spotReviewsThunk(spotId));
  }, [dispatch, spotId]);

  if (!spot) {
    return <div>Loading Spot...</div>;
  }

  if (!spot.SpotImages) {
    return <div>Loading Spot...</div>;
  }

  if (!reviews) {
    return <div>Loading Reviews...</div>
  }

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
            {spot.avgStarRating}
          </div>
          <div className="reviewCount">{spot.numReviews} reviews</div> */}
          <div className={spot.numReviews === 0 ? "noReviews" : "reviews"}>
              {spot.numReviews === 0 ? (
                <div className="noReviews">
                  <i className="fa-solid fa-star"></i>
                  <div className="newListing">New</div>
                </div>
              ) : (
                <div className="reviews">
                <div className="starRating">
                  <i className="fa-solid fa-star"></i>
                  {spot.avgStarRating.toFixed(2)}
                </div>
                <div className="dot">·</div>
                  {/* <div className="reviewCount">{spot.numReviews} reviews</div> */}
                  {spot.numReviews === 1 ? <div className="reviewCount">{spot.numReviews} review</div> : <div className="reviewCount">{spot.numReviews} reviews</div>}
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
               <div className={spot.numReviews === 0 ? "noReviews" : "mainReviews"}>
                {spot.numReviews === 0 ? (
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
                {spot.avgStarRating.toFixed(2)}
                </div>
                <div className="dot">·</div>
                {/* <div className="reviewCount">{spot.numReviews} reviews</div> */}
                {spot.numReviews === 1 ? <div className="reviewCount">{spot.numReviews} review</div> : <div className="reviewCount">{spot.numReviews} reviews</div>}
              </div>
            //   <div className="reviewCount">{spot.numReviews} reviews</div>
            // </div>
            )}
            {/* <div> */}
            </div>
            <div className="postReview">
              {sessionUser && sessionUser.id !== spot.ownerId && (!reviews.find((review) => review.userId === sessionUser.id)) &&
               <OpenModalButton
              //  id="deleteButton"
               buttonText="Post Your Review"
               modalComponent={<CreateReviewModal spot={spot} user={sessionUser} />}
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
              modalComponent={<DeleteReviewModal spot={spot} review={review} />}
              />
              )}
            </div>
          ))}
      </div>
      </div>
    </div>
  );
}
