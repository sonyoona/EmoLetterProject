import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/authApi';
import { getAccessToken, setAccessToken, setUnauthorizedHandler } from '../api/http';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const clearSession = useCallback(() => {
    setAccessToken('');
    setUser(null);
  }, []);

  // 토큰이 만료/무효라 401이 오면 세션을 정리한다.
  // (refreshToken은 httpOnly 쿠키라 프런트에서 재발급 요청을 만들 수 없다.)
  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  // 새로고침 후에도 저장된 accessToken으로 사용자 정보를 복구한다.
  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      if (!getAccessToken()) {
        setInitializing(false);
        return;
      }
      try {
        const me = await authApi.getMe();
        if (!cancelled) setUser(authApi.toUser(me));
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setInitializing(false);
      }
    };

    restore();
    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  const login = useCallback(async ({ userId, password }) => {
    const response = await authApi.login({ userId, password });
    setAccessToken(response?.accessToken);
    const loggedInUser = authApi.toUser(response);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const signup = useCallback(
    async ({ userId, email, nickname, password }) => {
      await authApi.signup({ userId, email, nickname, password });
      // 가입 직후 바로 로그인시켜 준다.
      return login({ userId, password });
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // 쿠키가 이미 없거나 서버가 죽어 있어도 클라이언트 세션은 정리한다.
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const changePassword = useCallback(async ({ oldPassword, newPassword }) => {
    // 성공해도 로그아웃시키지 않는다. 서버가 accessToken을 무효화하지 않기 때문에
    // 지금 들고 있는 토큰은 그대로 유효하다. (다음 로그인부터 새 비밀번호를 쓴다)
    await authApi.updatePassword({ oldPassword, newPassword });
  }, []);

  const deleteAccount = useCallback(async () => {
    await authApi.deleteAccount();
    // 계정이 사라졌으니 남은 토큰은 어차피 못 쓴다. 화면 상태를 먼저 정리한다.
    clearSession();
  }, [clearSession]);

  const updateNickname = useCallback(async (nickname) => {
    const response = await authApi.updateNickname(nickname);
    setUser((prev) => (prev ? { ...prev, nickname: response?.nickName ?? nickname } : prev));
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      initializing,
      login,
      signup,
      logout,
      updateNickname,
      changePassword,
      deleteAccount,
    }),
    [user, initializing, login, signup, logout, updateNickname, changePassword, deleteAccount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
