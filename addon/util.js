 /**
* Google app script properties are stored as strings
* via: https://developers.google.com/apps-script/guides/properties#data_format
* This function returns a numeric version of the property stored
*
* @private
* @param {String} key property key to retrieve
*/
function _getNumProperty(props, key) {
  var p = props.getProperty(key);
  if (p !== null) {
    try {
        p = p++;
    } catch(e) {
        var msg =  Utilities.formatString('Property %s is not numeric', key);
        throw new CustomError(msg, 'utils.js', '26');
    }
  }
  return p;
}

