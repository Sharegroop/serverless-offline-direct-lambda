const serializeError = require('serialize-error');
const path = require('path');

function handler(event, context, callback) {
  // extract the path to the handler (relative to the project root)
  // and the function to call on the handler
  const [targetHandlerFile, targetHandlerFunction] = event.targetHandler.split(".");
  const target = require(path.resolve(__dirname, '../..', event.location, targetHandlerFile));

  target[targetHandlerFunction](event.body).then((response) => {
      callback(null, {
        StatusCode: 200,
        Payload: JSON.stringify(response),
      });
  }).catch((error) => {
      callback(null, {
        StatusCode: 500,
        FunctionError: 'Handled',
        Payload: serializeError(error)
      })
  });
}

module.exports.handler = handler;
