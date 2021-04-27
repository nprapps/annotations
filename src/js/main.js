// observable annotation elements
require("./observed-annotation");

var morphdom = require("morphdom");
var getDocument = require("./getDocument");
var flags = require("./flags");
var $ = require("./lib/qsa");
var container = $.one("main.speech");

var { DateFormatter, plural} = require('./util.js');

var updateAnnotations = function (newSpeech, lastModified) {
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
    updateOverview();
  } catch (err) {
    console.error(err);
    return;
  }
};

var removeUnpublishedLinks = function () {
  var annos = $(".annotation").map(a => a.id);
  $("main.speech > *:not(.annotation) a").forEach(function (tag, i) {
    var [_,link] = tag.href.split("#");
    if (!link || !annos.includes(link)) {
      tag.removeAttribute("href");
    }
  });
};

const updateOverview = function() {
  // Update both last updated fields.
  var time = DateFormatter(new Date());
  $('.last-updated').forEach(t => t.innerHTML = `Last Updated: ${time}`);

  var allAnnos = $('.annotation');
  $.one('.num-annotations').innerHTML = `${allAnnos.length} annotation${plural(allAnnos.length)}`;
  
  
  // TODO: add in current unseen 
  var numNew = 0 || 'no';
  $.one('.update-number').innerHTML = `${numNew} annotation${plural(0)}`
}

var initializePage = (function () {
  updateOverview();
  removeUnpublishedLinks();
  setInterval(refresh, flags.refresh * 1000);
})();

// activate live features
document.body.classList.add("javascript");

// set listeners for link<->annotation connection
document.body.addEventListener("click", function(e) {
  var link = e.target.closest(`[href^="#annotation"]`);
  if (link) {
    e.preventDefault();
    var annotation = $.one(link.getAttribute("href"));
    annotation.scrollIntoView({ behavior: "smooth", block: "center" });
    annotation.querySelector(".content").animate([
      { borderColor: "", background: "" },
      { borderColor: "#efc637", background: "#f5ebc8" },
      { borderColor: "", background: "" }
    ], {
      fill: "both",
      duration: 1000
    });
    return;
  }
});