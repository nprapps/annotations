// observable annotation elements
require("./observed-annotation");

var morphdom = require("morphdom");
var getDocument = require("./getDocument");
var flags = require("./flags");
var $ = require("./lib/qsa");
var container = $.one("main.speech");

var updateAnnotations = function (newSpeech) {
  // collect annotations that have been seen before
  var tagged = $("[data-seen]");
  morphdom(container, newSpeech, {});
  // put those attributes back
  tagged.forEach(el => el.dataset.seen = true);
};

var refresh = async function () {
  try {
    var updated = await getDocument(window.location.href);
    // updated will be null if the response was a 304
    if (!updated) return;

    var speech = $.one("main.speech", updated);
    if (!speech) throw "Remote document was missing content.";
    
    updateAnnotations(speech);
  } catch (err) {
    console.error(err);
    return;
  }
  // TODO: maybe add event send/update code here
};

setInterval(refresh, flags.refresh * 1000);
