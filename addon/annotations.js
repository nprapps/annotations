var doc = DocumentApp.getActiveDocument();
var body = doc.getBody();
var headings = DocumentApp.ParagraphHeading;

var p = function(index, text) {
  return body.insertParagraph(index, text || '');
};

var h4 = function(index, text) {
  var pg = p(index, text);
  pg.setHeading(headings.HEADING4);
  return pg;
};

var h3 = function(index, text) {
  var pg = p(index, text);
  pg.setHeading(headings.HEADING3);
  return pg;
};

function getParagraph(id) {
  var selection = doc.getSelection();

  var elements = selection.getRangeElements();
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    // Only modify elements that can be edited as text; skip images and other non-text elements.
    if (element.getElement().editAsText) {
      var text = element.getElement().editAsText();

      // Bold the selected part of the element, or the full element if it's completely selected.
      if (element.isPartial()) {
        text.setLinkUrl(element.getStartOffset(), element.getEndOffsetInclusive(), ('#' + id));
      } else {
        text.setLinkUrl(('#' + id));
      }
    }
  }

  // Insert below the last selected element
  var lastElement = elements[elements.length - 1];
  if (lastElement.isPartial()) {
      el = lastElement.getElement().getParent();
  }
  else {
      el = lastElement.getElement()
  }
  return body.getChildIndex(el) + 1;
}

function addDraftAnnotation(draft) {
  var date = new Date();
  // Get last anno id and increase
  var props = PropertiesService.getDocumentProperties();
  var anno_num = _getNumProperty(props, 'ANNO_ID');
  anno_num = anno_num ? anno_num + 1 : 1;

  var slug = 'annotation-' + anno_num;

  var index = getParagraph(slug);
  draft.id = slug;
  addAnnotationText(draft, index);
  // Set last anno id if everything was successful.
  props.setProperty("ANNO_ID", anno_num);
}

function addAnnotationText(draft, index) {
  h3(index++, '{.annotation}');
  p(index++, `id: ${draft.id}`);
  if (draft.author == "other") {
    p(index++, "author: " + draft.other);
  } else {
    var sheetID = getConfig("authorSheet");
    var authors = readSheetAsObjects(sheetID, "authors");
    var row = authors.filter(function(r) { return r.key == draft.author }).pop();
    p(index++, "author: " + row.name);
    if (row.role) p(index++, "role: " + row.role);
    if (row.page) p(index++, "page: " + row.page);
    if (row.img) p(index++, "image: " + row.img);
  }
  h4(index++, "published: false");
  h4(index++, "editing: draft");
  p(index++);
  p(index++, "text::");
  p(index++);
  p(index++, "[ annotation contents go here ]");
  p(index++);
  p(index++, "::text")
  h3(index++, '{}')
}

function openDraftPanel() {
  var selection = doc.getSelection();

  // Maybe don't be this restrictive
  if (!selection) {
    DocumentApp.getUi().alert("You must highlight a range of text");
    return;
  }

  var sheetID = getConfig("authorSheet");
  var data = {
    authors: sheetID ? readSheetAsObjects(sheetID, "authors") : []
  };
  var html = HtmlService.createHtmlOutput(template("addAnnotationPanel", data)).setTitle("Configure add-on");
  var ui = DocumentApp.getUi();
  ui.showSidebar(html);
}

function publishAnnotation() {
  var selection = doc.getSelection();
  var cursor = doc.getCursor();
  var now = new Date();
  var date = now.toISOString();
  var replacer = "false|\\d[\\dT\\.:-]+Z";
  var element;
  if (selection) {
    var elements = selection.getRangeElements();
    var start = elements[0];
    element = start.getElement();
  } else {
    element = cursor.getElement();
  }
  var text = element.editAsText();
  var content = text.getText();
  if (!content.match(/published: /)) throw "Cursor is not placed on a publish line";
  text.replaceText(replacer, date);
}