// data optional
// returns (err, JSON object || null)
module.exports = function (type, url, data, callback) {

  if (callback == null) {
    callback = data;
    data = null;
  }

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open(type, url, true);

  xmlhttp.onload = function () {

    if (callback != null) {
      callback(null, JSON.parse(xmlhttp.responseText || null));
      callback = null; // prevent multiple callbacks
    }
  };

  xmlhttp.onreadystatechange = function () {

    if (xmlhttp.readyState === 4 ) {

      let err = null;
      if (xmlhttp.status !== 200) {
        err = xmlhttp.status + ':' + url;
      }

      if (callback != null) {
        callback(err, JSON.parse(xmlhttp.responseText || null));
        callback = null;
      }
    }
  };

  if (data != null && typeof data === "object") {
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    data = JSON.stringify(data);
  }

  xmlhttp.send(data);
};