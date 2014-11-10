
var $ = require("jquery")
var _ = require("lodash")
var MediumEditor = require("medium-editor")
var dialog = require("./editor/dialog")

var editorOpts = {
  cleanPastedHTML: true,
    placeholder: "Kerro jotain lenkistäsi ..."

}

var titleEditorOpts = {
  cleanPastedHTML: true,
  disableReturn: true,
  disableDoubleReturn: true,
  firstHeader: 'h1',
  secondHeader: 'h2',
  disableToolbar: true,
  placeholder: "Naseva otsikko lenkillesi!"
}

$(document).ready(function() {
  var titleEditor = new MediumEditor("#ex-title", titleEditorOpts) // instantiate content editor
  var contentEditor = new MediumEditor(".editable", editorOpts) // instantiate content editor

  var dlg = dialog.create()
})
