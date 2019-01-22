var APP = {};

(function() {
  // Client ID and API key from the Developer Console
  var CLIENT_ID =
    '18128763918-hqqggo942mbjuljfe5l7ou6o9eg7kdgp.apps.googleusercontent.com';
  var API_KEY = 'AIzaSyC6thBBiZ7W4ITXPPbJSsLIP5XvuJ4bL5Q';

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
  ];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

  var authorizeButton = document.getElementById('authorize_button');
  var signoutButton = document.getElementById('signout_button');

  /**
   *  On load, called to load the auth2 library and API client library.
   */
  APP.handleClientLoad = function() {
    gapi.load('client:auth2', APP.initClient);
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  APP.initClient = function() {
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(
        function() {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(APP.updateSigninStatus);

          // Handle the initial sign-in state.
          APP.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = APP.handleAuthClick;
          signoutButton.onclick = APP.handleSignoutClick;
        },
        function(error) {
          APP.appendPre(JSON.stringify(error, null, 2));
        }
      );
  }

  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  APP.updateSigninStatus = function(isSignedIn) {
    if (isSignedIn) {
      authorizeButton.style.display = 'none';
      signoutButton.style.display = 'block';
      APP.listLabels();
    } else {
      authorizeButton.style.display = 'block';
      signoutButton.style.display = 'none';
    }
  }

  /**
   *  Sign in the user upon button click.
   */
  APP.handleAuthClick = function(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  APP.handleSignoutClick = function(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  /**
   * Append a pre element to the body containing the given message
   * as its text node. Used to display the results of the API call.
   *
   * @param {string} message Text to be placed in pre element.
   */
  APP.appendPre = function(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  }

  /**
   * Print all Labels in the authorized user's inbox. If no labels
   * are found an appropriate message is printed.
   */
  APP.listLabels = function() {
    gapi.client.gmail.users.labels
      .list({
        userId: 'me',
      })
      .then(function(response) {
        var labels = response.result.labels;
        APP.appendPre('Labels:');

        if (labels && labels.length > 0) {
          for (i = 0; i < labels.length; i++) {
            var label = labels[i];
            APP.appendPre(label.name);
          }
        } else {
          APP.appendPre('No Labels found.');
        }
      });
  }
})();
