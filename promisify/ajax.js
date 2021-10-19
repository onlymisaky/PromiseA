/** 
 * @param {{[key:string]: any}} params 
 * @returns {string}
 */
function paramsSerializer(params) {
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    return '';
  }
  const keys = Object.keys(params);
  return keys.reduce((prev, key, index, arr) => {
    let query = `${key}=${params[key]}`;
    if (arr.length - 1 > index) {
      query = `${query}&`;
    }
    return prev + query;
  }, keys.length ? '?' : '');
}

/** 
 * @param {{[key:string]: string}} headers 
 * @returns {{[key:string]: string}}
 */
function formatHeaders(headers) {
  return Object.keys(headers).reduce((prev, key) => {
    prev[key.toLowerCase()] = headers[key];
    return prev;
  }, {});
}

/**
 * @param {string|number|FormData|ArrayBuffer|FormData|Blob|File|{[key:string]: string}} data 
 * @param {{[key:string]: string}} headers 
 * @returns {{data: any, headers: {[key:string]: string}}}
 */
function transformRequest(data, headers) {
  let defaultHeaders = formatHeaders({
    'content-type': 'application/x-www-form-urlencoded',
    'accept': 'application/json, text/plain, */*',
    ...headers,
  });

  if (
    Object.prototype.toString.call(data) === '[object Object]'
    || defaultHeaders['content-type'] === 'application/json'
  ) {
    defaultHeaders['content-type'] = 'application/json';
    return {
      data: JSON.stringify(data),
      headers: defaultHeaders,
    };
  }

  return {
    data,
    headers: defaultHeaders,
  };
}

/** 
 * @param {{url: string, method: string, headers:{[key:string]: string}, params: {[key:string]: any}, data: {[key:string]: string}, responseType: XMLHttpRequestResponseType}} config 
 * @returns 
 */
function ajax(config) {
  return new Promise((resolve, reject) => {
    const {
      url = '',
      method = 'get',
      headers = null,
      params = null,
      data = null,
      responseType = '',
    } = config;
    const {
      data: requestData,
      headers: requestHeaders,
    } = transformRequest(data, headers);

    const xhr = new XMLHttpRequest();
    xhr.open(method.toUpperCase(), url + paramsSerializer(params), true);
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        let responseData = !responseType || responseType === 'text' || responseType === 'json'
          ? JSON.parse(xhr.responseText) : xhr.response;
        resolve(responseData);
      }
    });
    xhr.addEventListener('error', () => {
      reject(new Error('error'));
    });
    xhr.addEventListener('abort', () => {
      reject(new Error('abort'));
    });
    xhr.addEventListener('timeout', () => {
      reject(new Error('timeout'));
    });
    Object.keys(requestHeaders).forEach((key) => {
      xhr.setRequestHeader(key, requestHeaders[key]);
    });
    if (!responseType) {
      xhr.responseType = responseType;
    }
    xhr.send(requestData);
  });
}
