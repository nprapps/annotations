// require("./lib/pym");
var morphdom = require("morphdom");
var getDocument = require("./getDocument");
var events = require("./events");
var $ = require("./lib/qsa");
console.log($);

var updateAnnotations = function (newSpeech) {
  var from = $.one("main.speech");
  console.log(from, newSpeech)
  morphdom(from, newSpeech, {});
};

var refresh = async function () {
  events.send("updating");
  try {
    var updated = await getDocument(window.location.href);
    // updated will be null if the response was a 304
    if (!updated) return;
    var speech = $.one("main.speech", updated);

    if (!speech)
      return console.log("Remote document was missing content.");
    updateAnnotations(speech);
  } catch (err) {
    console.error(err);
    return;
  }
  // TODO: maybe add event send/update code here
};

setInterval(refresh, 2 * 1000);
