'use strict;'

var request = require('request')
var fs = require('fs')

module.exports = {
  config: require('./config'),
  activate: activate
}

function activate() {

  console.log('activate inkpader-send')
  atom.commands.add('atom-workspace', 'inkpader:send', send)
}

function send() {
  var editor = atom.workspace.getActivePaneItem()
  var options = {
    baseUrl: 'https://www.inkpad.io',
    uri: '/pads',
    method: 'POST'
    headers: {
      Accept: 'application/json',
      'Content-type': 'text/plain'
    }
  }

  if (editor && editor.getPath) {
    fs.createReadStream(editor.getPath())
      .pipe(request(options))
      .on('response', function(response) {
        atom.notifications.addSuccess('Created! Open at https://www.inkpad.io/'
                                      + public_id, {dismissable: true})
      })
  }
}
