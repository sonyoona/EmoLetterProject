/**
 * 백엔드(Spring) 호출을 위한 얇은 fetch 래퍼.
 *
 * - accessToken은 메모리 + localStorage에 보관하고 Authorization 헤더로 붙인다.
 * - refreshToken은 백엔드가 httpOnly 쿠키로 내려주므로 JS가 건드리지 않는다.
 *   대신 모든 요청에 credentials: 'include'를 붙여 쿠키가 함께 전송되게 한다.
 * - accessToken이 만료돼 401이 오면 POST /token으로 한 번 재발급을 시도하고 원래 요청을 재시도한다.
 *   재발급도 실패하면 그때 세션을 정리한다.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const TOKEN_STORAGE_KEY = 'emoletter.accessToken';

let accessToken = null;
let unauthorizedHandler = null;

/** 401을 받았을 때 실행할 콜백 (AuthContext가 세션 정리용으로 등록한다) */
export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

export const getAccessToken = () => {
  if (accessToken === null) {
    accessToken = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  }
  return accessToken;
};

export const setAccessToken = (token) => {
  accessToken = token || '';
  if (accessToken) {
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

const DEFAULT_MESSAGES = {
  400: '요청 형식이 올바르지 않습니다.',
  401: '로그인이 필요합니다.',
  403: '권한이 없습니다.',
  404: '요청한 정보를 찾을 수 없습니다.',
  409: '이미 존재하는 정보입니다.',
  500: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
};

const parseBody = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const extractMessage = (body, status) => {
  if (typeof body === 'string' && body.trim()) return body;
  if (body && typeof body === 'object') {
    // Spring 기본 에러 응답 / @Valid 실패 응답 모두를 커버
    if (typeof body.message === 'string' && body.message) return body.message;
    if (Array.isArray(body.errors) && body.errors.length) {
      return body.errors.map((e) => e.defaultMessage || e.message).join('\n');
    }
  }
  return DEFAULT_MESSAGES[status] || `요청에 실패했습니다. (${status})`;
};

const buildUrl = (path, params) => {
  const url = `${BASE_URL}${path}`;
  if (!params) return url;
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
  ).toString();
  return query ? `${url}?${query}` : url;
};

/**
 * 동시에 여러 요청이 401을 받아도 재발급은 한 번만 하도록 진행 중인 Promise를 공유한다.
 */
let refreshPromise = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = request('/token', { method: 'POST', body: {}, auth: false, retry: false })
      .then((data) => {
        const token = data?.accessToken;
        if (!token) throw new ApiError('재발급 응답에 accessToken이 없습니다.', 0, data);
        setAccessToken(token);
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

export const request = async (path, { method = 'GET', body, params, auth = true, retry = true } = {}) => {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const token = getAccessToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      headers,
      credentials: 'include',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (cause) {
    throw new ApiError('서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.', 0, cause);
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    if (response.status === 401 && auth) {
      // 보낼 토큰이 있었는데 거부당한 경우에만 재발급을 시도한다.
      // (애초에 로그인하지 않은 요청이면 재발급해도 소용이 없다.)
      if (retry && getAccessToken()) {
        try {
          await refreshAccessToken();
          return request(path, { method, body, params, auth, retry: false });
        } catch {
          // 재발급 실패 -> 아래에서 세션 정리
        }
      }
      if (unauthorizedHandler) unauthorizedHandler();
    }
    throw new ApiError(extractMessage(payload, response.status), response.status, payload);
  }

  return payload;
};

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  del: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
