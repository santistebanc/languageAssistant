function htmlDecode(input) {
  // eslint-disable-next-line no-undef
  var doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
}

export default text => htmlDecode(text);
