var flags = {
  refresh: {
    type: Number,
    value: 15
  },
  notifications: {
    type: Boolean,
    value: false
  }
};

var search = new URLSearchParams(window.location.search);

var resolved = {};
for (var k in flags) {
  var def = flags[k];
  if (search.has(k)) {
    if (def.type == Boolean) {
      resolved[k] = true;
    } else {
      resolved[k] = def.type(search.get(k));
    }
  } else {
    resolved[k] = def.value;
  }
}

console.log(resolved);

module.exports = resolved;