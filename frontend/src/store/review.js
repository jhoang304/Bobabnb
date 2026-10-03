// import { csrfFetch } from "./csrf"

// const GET_ALL_SPOT_REVIEWS = 'spot/reviews'

// const getSpotReviews = reviews => ({
//     type: GET_ALL_SPOT_REVIEWS,
//     reviews
// })

// export const spotReviewsThunk = (spotId) => async (dispatch) => {
//     const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
//     const reviews = await res.json();
//     if (res.ok) {
//         dispatch(getSpotReviews(reviews["Reviews"]))
//     }
//     return reviews;
// }


// export const reviewReducer = (state =  {}, action) => {
//     let newState;
//     switch(action.type) {
//         case GET_ALL_SPOT_REVIEWS:
//             newState = {...state, reviews: action.reviews}
//             return newState
//         default:
//             return state
//     }
// }
import { csrfFetch } from "./csrf"

const GET_ALL_SPOT_REVIEWS = 'spot/reviews'
const GET_CURRENT_USER_REVIEWS = 'spots/review'
const CREATE_REVIEW='spots/review/create'
const DELETE_REVIEW = 'spots/review/delete'



const getSpotReviews = (spotId, reviews) => ({
    type: GET_ALL_SPOT_REVIEWS,
    spotId,
    reviews
})

const getUserReviews = reviews => ({
    type: GET_CURRENT_USER_REVIEWS,
    reviews
})

const createReview = review => ({
    type: CREATE_REVIEW,
    review
})

const deleteReview = review => ({
    type: DELETE_REVIEW,
    review
})
export const spotReviewsThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
    const reviews = await res.json();
    if (res.ok) {
        dispatch(getSpotReviews(spotId, reviews["Reviews"]))
    }
    return reviews;
}

export const getCurrentUserReviewsThunk = (review) => async (dispatch) => {
    const res = await csrfFetch('/api/reviews/current')
    const reviews = await res.json();
    if (res.ok) {
        dispatch(getUserReviews(reviews["Reviews"]))
        return reviews;
    } else {
        const errorData = await res.json()
        return errorData
    }
}

// csrfFetch throws the response when the server rejects the review, so callers can read its errors
export const createReviewThunk = (spotId, review) => async (dispatch, getState) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
    })
    const newReview = await res.json();
    // The create response doesn't include the author or images the review list shows
    const { id, firstName, lastName } = getState().session.user;
    newReview.User = { id, firstName, lastName };
    newReview.ReviewImages = [];
    dispatch(createReview(newReview))
    return newReview
}

export const deleteReviewThunk = (review) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${review.id}`, {
        method: 'DELETE'
    })
    if (res.ok) {
        dispatch(deleteReview(review))
    } else {
        const errorData = await res.json()
        return errorData
    }
}

const byId = list => Object.fromEntries(list.map(item => [item.id, item]));

// bySpot[spotId] holds that spot's reviews by id; userReviews holds the current user's reviews by id.
export const reviewReducer = (state = { bySpot: {} }, action) => {
    switch(action.type) {
        case GET_ALL_SPOT_REVIEWS:
            return {...state, bySpot: {...state.bySpot, [action.spotId]: byId(action.reviews)}}
        case GET_CURRENT_USER_REVIEWS:
            return {...state, userReviews: byId(action.reviews)}
        case CREATE_REVIEW: {
            const { review } = action;
            const spotReviews = state.bySpot[review.spotId];
            // If this spot's reviews haven't been loaded, the next fetch will include the new one
            if (!spotReviews) return state;
            return {...state, bySpot: {...state.bySpot, [review.spotId]: {...spotReviews, [review.id]: review}}}
        }
        case DELETE_REVIEW: {
            const { review } = action;
            const without = list => {
                if (!list) return list;
                const rest = {...list};
                delete rest[review.id];
                return rest;
            };
            return {
                ...state,
                bySpot: {...state.bySpot, [review.spotId]: without(state.bySpot[review.spotId])},
                userReviews: without(state.userReviews)
            }
        }
        default:
            return state
    }
}
