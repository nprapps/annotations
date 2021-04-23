var observer = new IntersectionObserver(function(list) {
  for (var observation of list) {
    if (observation.isIntersecting) {
      observation.target.dataset.seen = true;
    }
  }
});

class ObservedAnnotation extends HTMLElement {
  connectedCallback() {
    observer.observe(this);
  }

  disconnectedCallback() {
    observer.disconnect(this);
  }
}

window.customElements.define("observed-annotation", ObservedAnnotation);