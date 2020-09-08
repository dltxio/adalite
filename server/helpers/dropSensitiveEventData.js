module.exports = function dropSensitiveData(event) {
  if (event.request && event.request.data) delete event.request.data
  if (event.request && event.request.cookies) delete event.request.cookies
  return event
}
