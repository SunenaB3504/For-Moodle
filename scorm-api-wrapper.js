/*
 * SCORM API Wrapper v1.2
 * Based on pipwerks SCORM API Wrapper
 */

var pipwerks = {};  // Ensure global namespace

pipwerks.SCORM = {
    version: "1.2",
    API: null,
    connection: false,
    data: {},
    debug: true,

    // Find the SCORM API in the LMS
    find: function() {
        var API = null,
            win = window;
        
        // Look for the API in the current window and each parent window
        while (win && !API) {
            // SCORM 1.2
            API = win.API || null;
            if (!API && win.parent && win.parent != win) {
                win = win.parent;
            } else {
                break;
            }
        }
        
        if (this.debug && !API) {
            console.log("SCORM API not found. Running in standalone mode.");
        }
        
        return API;
    },

    // Initialize the connection to the LMS
    init: function() {
        var success = false,
            API = this.API || this.find();
        
        if (API) {
            this.API = API;
            
            // Try to initialize the session
            try {
                success = this.API.LMSInitialize("");
                this.connection = success === "true" || success === true;
                
                if (this.debug) {
                    console.log("SCORM API Initialized: " + this.connection);
                }
            } catch (e) {
                console.error("Error initializing SCORM API:", e);
            }
        } else {
            // Fallback for standalone mode
            this.connection = false;
            if (this.debug) {
                console.log("SCORM API not available. Running in standalone mode.");
            }
        }
        
        return this.connection;
    },

    // Get a value from the LMS
    get: function(param) {
        var value = "",
            success = false;
        
        if (this.connection) {
            try {
                value = this.API.LMSGetValue(param);
                success = true;
                
                if (this.debug) {
                    console.log("SCORM Get '" + param + "' = " + value);
                }
            } catch (e) {
                console.error("Error getting SCORM value for '" + param + "':", e);
            }
        } else {
            if (this.debug) console.log("SCORM not connected, can't get " + param);
        }
        
        return value;
    },

    // Set a value in the LMS
    set: function(param, value) {
        var success = false;
        
        if (this.connection) {
            try {
                success = this.API.LMSSetValue(param, value);
                success = success === "true" || success === true;
                
                if (this.debug) {
                    console.log("SCORM Set '" + param + "' = " + value + " (" + success + ")");
                }
            } catch (e) {
                console.error("Error setting SCORM value for '" + param + "':", e);
            }
        } else {
            if (this.debug) console.log("SCORM not connected, can't set " + param);
        }
        
        return success;
    },

    // Save the current state
    save: function() {
        var success = false;
        
        if (this.connection) {
            try {
                success = this.API.LMSCommit("");
                success = success === "true" || success === true;
                
                if (this.debug) {
                    console.log("SCORM Data Committed: " + success);
                }
            } catch (e) {
                console.error("Error saving SCORM data:", e);
            }
        } else {
            if (this.debug) console.log("SCORM not connected, can't save");
        }
        
        return success;
    },

    // End the SCORM session
    quit: function() {
        var success = false;
        
        if (this.connection) {
            try {
                success = this.API.LMSFinish("");
                success = success === "true" || success === true;
                this.connection = false;
                
                if (this.debug) {
                    console.log("SCORM Connection Terminated: " + success);
                }
            } catch (e) {
                console.error("Error terminating SCORM connection:", e);
            }
        } else {
            if (this.debug) console.log("SCORM not connected, can't quit");
        }
        
        return success;
    },

    // Get the last error from the LMS
    getLastError: function() {
        var error = "0";
        
        if (this.API) {
            try {
                error = this.API.LMSGetLastError();
            } catch (e) {
                console.error("Error getting last SCORM error:", e);
            }
        }
        
        return error;
    },

    // Get the error description
    getErrorDescription: function(errorCode) {
        var description = "";
        
        if (this.API) {
            try {
                description = this.API.LMSGetErrorString(errorCode);
            } catch (e) {
                console.error("Error getting SCORM error description:", e);
            }
        }
        
        return description;
    }
};

// Auto-initialize when the page loads
window.addEventListener("load", function() {
    // Initialize in a timeout to ensure the LMS API is fully loaded
    setTimeout(function() {
        pipwerks.SCORM.init();
        
        // Set some basic SCORM data
        if (pipwerks.SCORM.connection) {
            pipwerks.SCORM.set("cmi.core.lesson_status", "incomplete");
            pipwerks.SCORM.save();
        }
    }, 500);
});
