function DateFormatter(date) {
  var dateString = "...";

  var hours = date.getHours();
  if (!isNaN(hours)) {
    var suffix = hours < 12 ? "AM" : "PM";
    if (!hours) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
    }
    var minutes = date.getMinutes().toString().padStart(2, "0");
    dateString = `${hours}:${minutes} ${suffix}`;
  }
  return dateString;
}

function plural(num) {
  return (num == 1) ? '' :'s';
}

module.exports = { DateFormatter, plural};
