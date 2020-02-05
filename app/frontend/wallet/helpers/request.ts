import NamedError from '../../helpers/NamedError'
import debugLog from '../../helpers/debugLog'
import sleep from '../../helpers/sleep'
import {DELAY_AFTER_TOO_MANY_REQUESTS} from '../constants'

const errors = {
  503: 'NodeOutOfSync',
}

const request = async function request(url, method = 'GET', body = null, headers = {}) {
  let requestParams = {
    method,
    headers,
    //credentials: 'include',
    //mode: 'no-cors',
  }
  if (method.toUpperCase() !== 'GET') {
    requestParams = Object.assign({}, requestParams, {body})
  }
  try {
    const response = await fetch(url, requestParams as any).catch((e) => {
      throw NamedError('NetworkError', `${method} ${url} returns error: ${e}`)
    })
    if (!response) throw NamedError('NetworkError')
    if (response.status === 429) {
      await sleep(DELAY_AFTER_TOO_MANY_REQUESTS)
      return await request(url, method, body, headers)
    } else if (response.status === 503) {
      throw NamedError('NodeOutOfSync')
    } else if (response.status >= 400) {
      throw NamedError(
        'NetworkError',
        `${method} ${url} returns error: ${response.status} on payload: ${JSON.stringify(
          requestParams
        )}`
      )
    }
    return response.json()
  } catch (e) {
    debugLog(e)
    throw e
  }

  // try {
  //   const response = await fetch(url, requestParams as any) // TS does not like credentials
  //   if (!response) throw NamedError('NetworkError')
  //   if (response.status === 429) {
  //     await sleep(DELAY_AFTER_TOO_MANY_REQUESTS)
  //     return await request(url, method, body, headers)
  //   } else if (response.status === 503) {
  //     throw NamedError('NodeOutOfSync')
  //   } else if (response.status >= 400) {
  //     throw NamedError(
  //       'NetworkError',
  //       `${url} returns error: ${response.status} on payload: ${JSON.stringify(requestParams)}`
  //     )
  //   }
  //   return response.json()
  // } catch (e) {
  //   debugLog(e)
  //   throw NamedError(
  //     e.name === 'NodeOutOfSync' ? e.name : 'NetworkError',
  //     `${method} ${url} returns error: ${e}`
  //   )
  // }
}

export default request
