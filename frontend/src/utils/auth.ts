// src/utils/auth.ts

export interface Tokens {
    access: string;
    refresh: string;
}

export const saveTokens = (tokens: Tokens): void => {
    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
};

export const clearTokens = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

export const getAccessToken = (): string | null => {
    return localStorage.getItem("access_token");
};

export const authFetch = async (
    url: string,
    options: RequestInit = {}
): Promise<Response> => {
    const token = getAccessToken();

    const headers: HeadersInit = {
        ...(options.headers || {}),
    };

    if (token) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    if (!(headers as Record<string, string>)["Content-Type"]) {
        (headers as Record<string, string>)["Content-Type"] = "application/json";
    }

    return fetch(url, {
        ...options,
        headers,
    });
};