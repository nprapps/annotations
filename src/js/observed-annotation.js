var ANNOTATION_VISIBILITY = "annotationvisibility";

var observer = new IntersectionObserver(function(list) {
  for (var observation of list) {
    var { target, isIntersecting } = observation;
    if (isIntersecting) {
      if ("seen" in target.dataset) continue;
      target.dataset.seen = true;
      var event = new CustomEvent(ANNOTATION_VISIBILITY, { bubbles: true, composed: true });
      target.dispatchEvent(event);
    }
  }
});

class ObservedAnnotation extends HTMLElement {
  connectedCallback() {
    if (this.isConnected) observer.observe(this);
  }

  disconnectedCallback() {
    observer.unobserve(this);
  }
}

window.customElements.define("observed-annotation", ObservedAnnotation);

module.exports = {
  ObservedAnnotation,
  ANNOTATION_VISIBILITY
}