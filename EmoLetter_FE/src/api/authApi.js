import { api } from './http';

/** POST /api/user — 회원가입 */
export const signup = ({ userId, email, nickname, password }) =>
  api.post('/user', { userId, email, nickname, password }, { auth: false });

/** POST /api/user/login — 로그인. accessToken이 담긴 UserResponse를 돌려준다. */
export const login = ({ userId, password }) =>
  api.post('/user/login', { userId, password }, { auth: false });

/** DELETE /api/user/logout — refreshToken 쿠키를 지운다. */
export const logout = () => api.del('/user/logout', { auth: false });

/** GET /api/user — 현재 로그인한 사용자 정보 */
export const getMe = () => api.get('/user');

/** PUT /api/user/info — 닉네임 수정 */
export const updateNickname = (nickname) => api.put('/user/info', { nickname });

/** PUT /api/user/info/password — 비밀번호 변경 */
export const updatePassword = ({ oldPassword, newPassword }) =>
  api.put('/user/info/password', { oldPassword, newPassword });

/** DELETE /api/user — 회원 탈퇴 */
export const deleteAccount = () => api.del('/user');

/** 백엔드 UserResponse -> 프런트에서 쓰는 형태로 정규화 */
export const toUser = (response) => ({
  userId: response?.userId ?? '',
  nickname: response?.nickName ?? '',
  email: response?.email ?? '',
  role: response?.role ?? '',
  createAt: response?.createAt ?? null,
});
