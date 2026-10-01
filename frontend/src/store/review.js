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



const getSpotReviews = reviews => ({
    type: GET_ALL_SPOT_REVIEWS,
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

const deleteReview = reviewId => ({
    type: DELETE_REVIEW,
    reviewId
})
export const spotReviewsThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
    const reviews = await res.json();
    if (res.ok) {
        dispatch(getSpotReviews(reviews["Reviews"]))
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
export const createReviewThunk = (spotId, review) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
    })
    const newReview = await res.json();
    dispatch(createReview(newReview))
    return newReview
}

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })
    if (res.ok) {
        dispatch(deleteReview(reviewId))
    } else {
        const errorData = await res.json()
        return errorData
    }
}


export const reviewReducer = (state =  {}, action) => {
    let newState;
    switch(action.type) {
        case GET_ALL_SPOT_REVIEWS:
            newState = {...state, reviews: action.reviews}
            return newState
        case GET_CURRENT_USER_REVIEWS:
            newState = {...state, reviews: action.reviews}
            return newState
        case CREATE_REVIEW:
            newState = {...state, review: action.reviews}
            return newState
        case DELETE_REVIEW:
            newState = {...state}
            delete newState[action.reviewId];
            return newState
        default:
            return state
    }
}
