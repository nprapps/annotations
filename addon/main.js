function onOpen() {
  var ui = DocumentApp.getUi();
  var menu = ui.createMenu("Annotation");
  menu.addItem("Add annotation", "openDraftPanel");
  menu.addItem("Publish annotation", "publishAnnotation");
  menu.addSeparator();
  menu.addItem("Check document for errors", "noop");
  menu.addItem("Configure annotation add-on", "openConfigPanel");
  menu.addItem("Reset document", "noop");
  menu.addToUi();
}

function noop() {
  
}

function onInstall() {
  onOpen();
}