import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const backendOrigin = env.VITE_BACKEND_ORIGIN || 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      // 개발 중에는 /api 요청을 스프링 서버로 프록시한다.
      // 같은 오리진으로 요청이 나가므로 CORS 없이도 httpOnly refreshToken 쿠키가 그대로 오간다.
      proxy: {
        '/api': {
          target: backendOrigin,
          changeOrigin: true,
        },
      },
    },
  }
})
