'use babel'

import fs from 'fs'
import request from 'request'
import config from './config'

export default {
  config,
  activate() {
    atom.commands.add('atom-workspace', 'inkpader:send', send)
  }
}

const send = () => {
  let editor = atom.workspace.getActivePaneItem()
  let options = {
    baseUrl: 'https://www.inkpad.io',
    uri: '/pads',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'text/plain'
    },
    json: true
  }

  if (!editor || !editor.getPath) {
    return
  }

  fs.createReadStream(editor.getPath())
    .on('error', function(err) {
      atom.notifications.addError('An error ocurred!', {dismissable: true})
    })
    .pipe(request(options, (err, res, body) => {
      if (res.statusCode === 201) {
        atom.notifications.addSuccess('Created! ' +
                        'Open at https://www.inkpad.io/' + body['public_id'],
                        {dismissable: true})
      } else {
        atom.notifications.addError('An error ocurred!', {dismissable: true})
      }
    }).auth(atom.config.get('inkpader.apiKey'), ''))
}
