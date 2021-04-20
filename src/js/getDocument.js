var etags = {};

module.exports = function(url) {
  return new Promise(function(ok, fail) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "document";
    if (etags[url]) {
      xhr.setRequestHeader("If-None-Match", etags[url]);
    }
    xhr.send();
    xhr.onload = function() {
      if (xhr.status == 304) {
        console.log("Annotations haven't changed since last request");
        return ok(null);
      }
      if (xhr.status >= 400) {
        return fail(`Annotations failed with status "${xhr.statusText}"`);
      }
      var response = xhr.response;
      var etag = xhr.getResponseHeader("ETag");
      etags[url] = etag;
      ok(xhr.response);
    };
    xhr.onerror = function(err) {
      var message = xhr.statusText || `Request for ${url} failed without status.`
      fail(message);
    }
  });
};