import { csrfFetch, readErrorResponse } from "./csrf"

const GET_ALL_SPOTS = 'spots/spots'
const GET_SPOT_DETAILS = 'spots/single_spot'
const GET_USER_SPOTS='spots/currentUser'
const DELETE_SPOT='spots/delete'
const UPDATE_SPOT='spots/update'
// const CREATE_SPOT = 'spots/create'
// const ADD_IMAGE = 'spots/images/add'

const getAllSpotsAction = spots => ({
        type: GET_ALL_SPOTS,
        spots
})

const getSpotDetailAction = spot => ({
    type: GET_SPOT_DETAILS,
    spot
})

const getUserSpots = spots => ({
    type: GET_USER_SPOTS,
    spots
})

const updateSpot = spot => ({
    type: UPDATE_SPOT,
    spot
})

const deleteSpot = spotId => ({
    type: DELETE_SPOT,
    spotId
})

// const createImage = image => ({
//     type: ADD_IMAGE,
//     image
// })

// const createSpot = spot => ({
//     type: CREATE_SPOT,
//     spot
// })

export const allSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')
    const spots = await res.json();
    if (res.ok) {
        dispatch(getAllSpotsAction(spots["Spots"]))
        return spots;
    } else {
        const errorData = await res.json()
        return errorData
    }
}

export const getUserSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current')
    const spots = await res.json();
    if (res.ok) {
        dispatch(getUserSpots(spots["Spots"]))
        return spots;
    } else {
        const errorData = await res.json()
        return errorData
    }
}

export const singleSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`)
    const spot = await res.json()
    if (res.ok) {
        dispatch(getSpotDetailAction(spot))
        return spot;
    } else {
        const errorData = await res.json()
        return errorData
    }
}

// The create and update thunks resolve to { ok: true, spot } or { ok: false, errors, message }.
export const createSpotThunk = (spot, owner, imagesArray) => async (dispatch) => {
    let newSpot;
    try {
        const res = await csrfFetch('/api/spots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(spot)
        })
        newSpot = await res.json();
    } catch (err) {
        return { ok: false, ...(await readErrorResponse(err)) };
    }

    const spotImagesArray = [];
    try {
        for (let image of imagesArray) {
            const imageData = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(image)
            })
            spotImagesArray.push(await imageData.json())
        }
    } catch (err) {
        // Remove the spot so it isn't left without its images and a retry doesn't create a duplicate.
        const removed = await csrfFetch(`/api/spots/${newSpot.id}`, { method: 'DELETE' }).then(() => true, () => false);
        return {
            ok: false,
            errors: {},
            message: removed
                ? "An image couldn't be uploaded, so your spot wasn't saved. Please try again."
                : "Your spot was created, but an image couldn't be uploaded. You can find it under Manage Spots."
        };
    }

    newSpot.SpotImages = spotImagesArray;
    newSpot.owner = owner
    dispatch(getSpotDetailAction(newSpot))
    return { ok: true, spot: newSpot }
}

export const updateSpotThunk = (spot) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/spots/${spot.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(spot)
        });
        const updatedSpot = await res.json()
        dispatch(updateSpot(updatedSpot))
        return { ok: true, spot: updatedSpot }
    } catch (err) {
        return { ok: false, ...(await readErrorResponse(err)) };
    }
}

// Splits a failed create/update result into errors for the form's fields (the forms call "name" "title")
// and one general message for everything else: lat/lng, which have no inputs, and errors like 401, 403 or a network failure.
const SPOT_FORM_FIELDS = { address: 'address', city: 'city', state: 'state', country: 'country', name: 'title', description: 'description', price: 'price' };
export const spotFormErrors = ({ errors, message }) => {
    const fields = {};
    const general = [];
    for (const [key, text] of Object.entries(errors)) {
        if (SPOT_FORM_FIELDS[key]) fields[SPOT_FORM_FIELDS[key]] = text;
        else if (key === 'lat' || key === 'lng') general.push(text);
    }
    if (!Object.keys(fields).length && !general.length) general.push(message);
    return { fields, general: general.join(' ') };
}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })
    if (res.ok) {
        dispatch(deleteSpot(spotId))
    } else {
        const errorData = await res.json()
        return errorData
    }
}

// export const createImageThunk = (image, spotId) => async dispatch => {
//     const res = await csrfFetch(`/api/spots/${spotId}/images`, {
//         method: "POST",
//         headers: {
//             "content-type": "application/json"
//         },
//         body: JSON.stringify(image)
//     })
//     const data = await res.json();
//     if (res.ok) {
//         dispatch(createImage(image))
//         return data
//     }
//     else {
//         const errorData = await res.json()
//         return errorData
//     }
// }


export const spotReducer = (state =  {}, action) => {
    let newState;
    switch(action.type) {
        case GET_ALL_SPOTS:
            newState = {...state, allSpots: action.spots}
            return newState
        case GET_SPOT_DETAILS:
            newState = {...state, singleSpot: action.spot}
            return newState
        // case CREATE_SPOT:
        //     newState = {...state, allSpots: {...state.AllSpots, [action.spot.id]: action.spot}}
        //     return newState;
        // case ADD_IMAGE:
        //     newState = {...state, singleSpot: {...state.singleSpot, spotImages: [action.image]}}
        case GET_USER_SPOTS:
            newState =  {...state, allSpots: action.spots}
            return newState
        case UPDATE_SPOT: {
            newState = {...state, singleSpot: action.spot}
            return newState
        }
        case DELETE_SPOT:
            newState = {...state}
            delete newState[action.spotId];
            return newState
        default:
            return state
    }
}
