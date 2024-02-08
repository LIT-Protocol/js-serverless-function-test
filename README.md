# Lit Action Examples

All the useful examples in this repo are in the js-sdkTests folder. 


Note: many of these examples are broken and use the V2 SDK.  Some examples have been fixed to use the new V3 SDK.

Examples that are confirmed to be working with V3 are listed below:
* nesting.js - Shows how to use Lit.Actions.call() to run child Lit Actions
* params.js - Shows how to pass params in the `jsParams` key when running lit actions and how to use the params in a lit action
* authContext.js - Shows how to log your auth context so you can see what's inside it.  Note that this example requires a access token or JWT from some auth method - Sign in With Google, or Sign in with Apple, for example.  If you run this out of the box, you should see a "Apple JWT expired" error because the included JWT is expired.
* consoleAndResponse.js - Shows how to see console.log in your response, and how to set your "response" key in the response itself

Broken examples (still useful for reference):



More docs and info are here: https://getlit.dev
