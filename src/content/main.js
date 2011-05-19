/* Main JS */

// Construct an instance and provide 'instanceKey'.
// This is the same as the instance variable name.
var app = new Application('app');

// Left the loadConfig here, in hopes that I can 
// test at some point without going through chrome
// callbacks.
app.loadConfig();
