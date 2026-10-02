import Cookies from 'js-cookie';

export async function csrfFetch(url, options = {}) {
    // set options.method to 'GET' if there is no method
    options.method = options.method || 'GET';
    // set options.headers to an empty object if there is no headers
    options.headers = options.headers || {};

    // if the options.method is not 'GET', then set the "Content-Type" header to
        // "application/json", and set the "XSRF-TOKEN" header to the value of the
        // "XSRF-TOKEN" cookie
    if (options.method.toUpperCase() !== 'GET') {
        options.headers['Content-Type'] =
            options.headers['Content-Type'] || 'application/json';
        options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    }
    // call the default window's fetch with the url and the options passed in
    const res = await window.fetch(url, options);

    // if the response status code is 400 or above, then throw an error with the
        // error being the response
    if (res.status >= 400) throw res;

    // if the response status code is under 400, then return the response to the
        // next promise chain
    return res;
}

// call this to get the "XSRF-TOKEN" cookie, should only be used in development
export function restoreCSRF() {
    return csrfFetch('/api/csrf/restore');
}

// Reads the body of a response that csrfFetch threw and returns { errors, message }.
// Network failures and responses that aren't JSON get a generic message.
export async function readErrorResponse(err) {
    const fallback = 'Something went wrong. Please try again.';
    if (!(err instanceof Response)) return { errors: {}, message: fallback };
    try {
        const data = await err.json();
        return { errors: data.errors || {}, message: data.message || fallback };
    } catch {
        return { errors: {}, message: fallback };
    }
}
