// ✅ без useAuthStore()
import { useAuthStore } from '../store/useAuthStore';

export const fetchWithAuth = async (
    input: RequestInfo,
    init: RequestInit = {}
): Promise<Response> => {
    const { token, logout } = useAuthStore.getState(); // ✅ правильно!

    const headers = new Headers(init.headers);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(input, {
        ...init,
        headers,
    });

    if (response.status === 401) {
        console.warn('⛔️ Токен истёк. Logout + редирект.');
        logout();
        window.location.href = '/login';
    }

    return response;
};
