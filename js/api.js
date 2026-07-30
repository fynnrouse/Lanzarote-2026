/****************************************************************
 * Holiday Restaurant League
 * API Library
 * --------------------------------------------------------------
 * Version: 1.0
 *
 * This file is the ONLY place in the website that communicates
 * with Google Apps Script.
 *
 * Every page should call:
 *
 *     API.someFunction()
 *
 * Never use fetch() anywhere else in the project.
 *
 ****************************************************************/


/***************************************************************
 * CONFIGURATION
 ***************************************************************/

const API = {};

API.VERSION = "1.0.0";

/*
 * Paste your Apps Script deployment URL below.
 * Keep the /exec on the end.
 */

API.BASE_URL =
"https://script.google.com/macros/s/AKfycbyI7zqK8a_LBWRFzQFITJPIzaFJg3P7FcBDWt1LoqZBXlVbtp_bE-Atw2BT3TXqf1r4/exec";


/*
 * Request timeout (milliseconds)
 */

API.TIMEOUT = 10000;



/***************************************************************
 * INTERNAL HELPERS
 *
 * These should NEVER be called directly by pages.
 ***************************************************************/


/**
 * Builds a GET URL.
 */

API.buildUrl = function(action, parameters = {}) {

    const url = new URL(API.BASE_URL);

    url.searchParams.append(
        "action",
        action
    );

    for (const key in parameters) {

        url.searchParams.append(

            key,

            parameters[key]

        );

    }

    return url;

};



/**
 * Generic GET request.
 */

API.get = async function(action, parameters = {}) {

    try {

        const controller = new AbortController();

        const timeout = setTimeout(() => {

            controller.abort();

        }, API.TIMEOUT);

        const response = await fetch(

            API.buildUrl(action, parameters),

            {

                method: "GET",

                signal: controller.signal

            }

        );

        clearTimeout(timeout);

        if (!response.ok) {

            throw new Error(

                "HTTP " + response.status

            );

        }

        return await response.json();

    }

    catch (error) {

        console.error(error);

        return API.error(

            error.message

        );

    }

};



/**
 * Generic POST request.
 */

API.post = async function(action, data = {}) {

    try {

        const controller = new AbortController();

        const timeout = setTimeout(() => {

            controller.abort();

        }, API.TIMEOUT);

        const response = await fetch(

            API.BASE_URL,

            {

                method: "POST",

                signal: controller.signal,

                headers: {

                    "Content-Type":
                    "application/json"

                },

                body: JSON.stringify({

                    action,

                    data

                })

            }

        );

        clearTimeout(timeout);

        if (!response.ok) {

            throw new Error(

                "HTTP " + response.status

            );

        }

        return await response.json();

    }

    catch (error) {

        console.error(error);

        return API.error(

            error.message

        );

    }

};



/***************************************************************
 * ERROR HANDLING
 ***************************************************************/


API.error = function(message) {

    return {

        success: false,

        message: message,

        data: null

    };

};



API.success = function(message, data = null) {

    return {

        success: true,

        message,

        data

    };

};



/***************************************************************
 * DEBUG
 ***************************************************************/

/*
 * Enable this while developing.
 */

API.DEBUG = true;



API.log = function(...args) {

    if (!API.DEBUG) return;

    console.log(

        "[Holiday API]",

        ...args

    );

};



/***************************************************************
 * PUBLIC READ FUNCTIONS
 *
 * These are the functions that every page should use.
 ***************************************************************/


/**
 * Returns API status information.
 */

API.status = async function () {

    API.log("Checking API status...");

    const response = await API.get("status");

    if (!response.success) {

        throw new Error(response.message);

    }

    return response.data;

};



/**
 * Returns the current holiday settings.
 */

API.getSettings = async function () {

    API.log("Loading settings...");

    const response = await API.get("getSettings");

    if (!response.success) {

        throw new Error(response.message);

    }

    return response.data;

};



/**
 * Returns today's scores.
 */

API.getTodaysScores = async function () {

    API.log("Loading today's scores...");

    const response = await API.get("getTodaysScores");

    if (!response.success) {

        throw new Error(response.message);

    }

    return response.data;

};



/***************************************************************
 * PUBLIC WRITE FUNCTIONS
 *
 * Functions that modify backend data.
 ***************************************************************/


/**
 * Submit one participant's scores.
 *
 * data =
 * {
 *   person,
 *   restaurant,
 *   food,
 *   service,
 *   ambiance
 * }
 */

API.submitScore = async function (data) {

    API.log("Submitting score...", data);

    const response = await API.post(
        "submitScore",
        data
    );

    if (!response.success) {

        throw new Error(response.message);

    }

    return response;

};



/**
 * Update website settings.
 *
 * data =
 * {
 *   holidayName,
 *   holidayDay,
 *   currentRestaurant,
 *   currentRestaurantTime
 * }
 */

API.updateSettings = async function (data) {

    API.log("Updating settings...", data);

    const response = await API.post(
        "updateSettings",
        data
    );

    if (!response.success) {

        throw new Error(response.message);

    }

    return response;

};



/**
 * Deletes every submission for the
 * currently selected restaurant.
 */

API.deleteTodaysScores = async function () {

    API.log("Deleting today's scores...");

    const response = await API.post(
        "deleteTodaysScores"
    );

    if (!response.success) {

        throw new Error(response.message);

    }

    return response;

};

/****************************************************************
 * API INITIALISATION
 * --------------------------------------------------------------
 * Final section of the API library.
 *
 * Performs a small amount of startup work and provides
 * utility functions that are useful to every page.
 ****************************************************************/


/**
 * Tests whether the backend is reachable.
 *
 * Returns:
 *      true  - Backend online
 *      false - Backend unavailable
 */

API.isOnline = async function () {

    try {

        await API.status();

        return true;

    }

    catch {

        return false;

    }

};



/**
 * Returns the Apps Script URL.
 *
 * Mainly useful for debugging.
 */

API.getBaseUrl = function () {

    return API.BASE_URL;

};



/**
 * Returns the current API version.
 */

API.getVersion = function () {

    return API.VERSION;

};



/**
 * Prints useful debugging information.
 */

API.info = function () {

    console.group("Holiday Restaurant League API");

    console.log("Version:", API.VERSION);

    console.log("Backend:", API.BASE_URL);

    console.log("Timeout:", API.TIMEOUT);

    console.log("Debug:", API.DEBUG);

    console.groupEnd();

};



/**
 * Freeze the API object.
 *
 * Prevents accidental overwriting of functions
 * elsewhere in the website.
 */

Object.freeze(API);



/****************************************************************
 * END OF FILE
 ****************************************************************/
