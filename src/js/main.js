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
  removeUnpublishedLinks();
  tagged.forEach(el => (el.dataset.seen = true));
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

var removeUnpublishedLinks = function () {
  var annos = $(".annotation").map(a => a.id);
  $("main.speech > *:not(.annotation) a").forEach(function (tag, i) {
    // Is there a more built in way to get this without using split
    var link = tag.href.split("#");
    if (!link[1] || !annos.includes(link[1])) {
      tag.href = "";
    }
  });
};

var initializePage = (function () {
  removeUnpublishedLinks();
  setInterval(refresh, flags.refresh * 1000);
})();

// activate live features
document.body.classList.add("javascript");
