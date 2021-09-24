/* global m */

import { getAuth } from './auth.js';

const API_PATH = '/api';

const request = async (path, options = {}) => {
  const token = getAuth();

  if (token) {
    if (!options.headers) {
      options.headers = {};
    }

    options.headers.Authorization = token;
  }

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
