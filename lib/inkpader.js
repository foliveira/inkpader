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
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'text/plain'
    },
    json: true
  }

  if (editor && editor.getPath) {
    fs.createReadStream(editor.getPath())
      .on('error', function(err) {
        atom.notifications.addError('An error ocurred!', {dismissable: true})
      })
      .pipe(request(options, function(err, res, body) {
        if (res.statusCode === 201) {
          atom.notifications.addSuccess('Created! Open at https://www.inkpad.io/' + body['public_id'], {dismissable: true})
        } else {
          atom.notifications.addError('An error ocurred!', {dismissable: true})
        }
      }))
  }
}
