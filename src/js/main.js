// observable annotation elements

var $ = require("./lib/qsa");
var debounce = require("./lib/debounce");

var { ANNOTATION_VISIBILITY } = require("./observed-annotation");
var morphdom = require("morphdom");
var getDocument = require("./getDocument");
var flags = require("./flags");

var container = $.one("main.speech");

var { DateFormatter, plural } = require("./util.js");

// Annotation IDs that appear on visit, to differentiate from ones appearing upon refresh
var annotationsOnVisit = new Set($(".annotation").map(el => el.id));

var updateAnnotations = function (newSpeech, lastModified) {
  // collect annotations that have been seen before
  var tagged = $(".annotation[data-seen]");

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
    var [_, link] = tag.href.split("#");
    if (!link || !annos.includes(link)) {
      tag.removeAttribute("href");
    }
  });
};

var updateOverview = function () {
  // Update both last updated fields.
  var time = DateFormatter(new Date());
  $(".last-updated").forEach(t => (t.innerHTML = `Last Updated: ${time}`));

  var annotationsAll = $(".annotation");
  var numAll = annotationsAll.length;
  $.one(".num-annotations").innerHTML = `${numAll} annotation${plural(numAll)}`;

  var numRead = $(".annotation[data-seen]").length;
  // New (updated & unseen) annotations since visit
  var annotationsNew = annotationsAll.filter(
    el => !annotationsOnVisit.has(el.id) && el.dataset.seen !== "true"
  );
  var numNew = annotationsNew.length;

  var nodeNotice = $.one(".update-notice");
  var nodeNumber = $.one(".update-number");

  if (numNew === 0) {
    // No new annotations. Show annotation count
    nodeNumber.innerHTML =
      numRead === numAll ? "&#10003;" : `${numRead}/${numAll} read`;
    // Hide new annotations notice
    nodeNotice.href = "#0";
    nodeNotice.innerHTML = "";
  } else {
    // There's at least one new annotation post-refresh
    var positions = annotationsNew.map(el => ({
      id: el.id,
      y: el.getBoundingClientRect().top,
    }));
    // Find topmost new annotation (smallest y) to scroll to
    var positionTopmost = positions.reduce(
      (top, curr) => (top = curr.y < top.y ? curr : top)
    );
    // Show new annotations notice
    nodeNotice.href = `#${positionTopmost.id}`;
    nodeNotice.innerHTML = "New annotations were added";
    // Hide annotation count
    nodeNumber.innerHTML = "";
  }
};

var initializePage = function () {
  updateOverview();
  removeUnpublishedLinks();
  setInterval(refresh, flags.refresh * 1000);
};

initializePage();

// activate live features
document.body.classList.add("javascript");

// set listeners for link<->annotation connection
document.body.addEventListener("click", function (e) {
  var link = e.target.closest(`[href^="#annotation"]`);
  if (link) {
    e.preventDefault();
    var annotation = $.one(link.getAttribute("href"));
    annotation.scrollIntoView({ behavior: "smooth", block: "center" });
    annotation.querySelector(".content").animate(
      [
        { borderColor: "", background: "" },
        { borderColor: "#efc637", background: "#f5ebc8" },
        { borderColor: "", background: "" },
      ],
      {
        fill: "both",
        duration: 1000,
      }
    );
    return;
  }
});

container.addEventListener(ANNOTATION_VISIBILITY, debounce(updateOverview));
