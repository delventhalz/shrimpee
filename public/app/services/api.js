/* global m */

const API_PATH = '/api';

const request = async (path, options) => {
  try {
    return await m.request(API_PATH + path, options);
  } catch (err) {
    console.warn(`[${err.code}] ${err.response.errorMessage}`);
    throw err;
  }
}

const getSimpleRequester = (method, dataLocation) => async (path, data) => {
  return request(path, {
    method,
    ...(data ? { [dataLocation]: data } : {}),
  });
};

export const api = {
  request,
  get: getSimpleRequester('GET', 'params'),
  post: getSimpleRequester('POST', 'body'),
  put: getSimpleRequester('PUT', 'body'),
  delete: getSimpleRequester('DELETE', 'params'),
};
