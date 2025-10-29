import { useAuthStore } from '@/store/useAuthStore';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  body?: BodyInit | null;
  headers?: Record<string, string>;
  authenticated?: boolean;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api/v1';

const buildHeaders = (body?: BodyInit | null) => {
  const headers: Record<string, string> = {};

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const token = useAuthStore.getState().token;
  const { authenticated = false, method = 'GET', body, headers = {} } = options;

  const mergedHeaders = {
    ...buildHeaders(body),
    ...headers,
    ...(authenticated && token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_URL}/${path}`, {
    method,
    headers: mergedHeaders,
    body,
  });

  const contentType = response.headers.get('Content-Type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(isJson ? payload.message ?? 'Request failed' : 'Request failed');
  }

  return payload as T;
};

export const authApi = {
  registerAdmin: (data: { name: string; email: string; password: string }) =>
    apiRequest<{ token: string; user: any }>('auth/admin/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  loginAdmin: (data: { email: string; password: string }) =>
    apiRequest<{ token: string; user: any }>('auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  registerParent: (data: { name: string; email: string; password: string }) =>
    apiRequest<{ token: string; user: any }>('auth/parent/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  registerParentInvite: (data: { invite_token: string; name: string; password: string }) =>
    apiRequest<{ token: string; user: any; lecture_id: number }>('auth/parent/signup-invite', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  loginParent: (data: { email: string; password: string }) =>
    apiRequest<{ token: string; user: any }>('auth/parent/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  logout: () =>
    apiRequest<{ message: string }>('auth/logout', {
      method: 'POST',
      authenticated: true,
    }),
};

export const lectureApi = {
  listAdminLectures: () =>
    apiRequest<{ lectures: any[] }>('lectures', { authenticated: true }),
  createLecture: (
    data: {
      title: string;
      description?: string;
      scheduled_at: string;
      image?: {
        uri: string;
        name: string;
        type: string;
      } | null;
    }
  ) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('scheduled_at', data.scheduled_at);

    if (data.description) {
      formData.append('description', data.description);
    }

    if (data.image) {
      formData.append('image', data.image as any);
    }

    return apiRequest<{ lecture: any }>('lectures', {
      method: 'POST',
      body: formData,
      authenticated: true,
    });
  },
  createInvite: (lectureId: number, payload: { parent_email: string }) =>
    apiRequest<{ invite: any }>(`lectures/${lectureId}/invites`, {
      method: 'POST',
      body: JSON.stringify(payload),
      authenticated: true,
    }),
  listInvites: (lectureId: number) =>
    apiRequest<{ invites: any[] }>(`lectures/${lectureId}/invites`, {
      authenticated: true,
    }),
  getInvite: (token: string) =>
    apiRequest<{ invite: any; lecture: any }>(`invites/${token}`),
  listParentLectures: () =>
    apiRequest<{ lectures: any[] }>('lectures/invited', {
      authenticated: true,
    }),
  listChildren: (lectureId: number) =>
    apiRequest<{ children: any[] }>(`lectures/${lectureId}/children`, {
      authenticated: true,
    }),
  addChild: (lectureId: number, payload: { name: string; age: number }) =>
    apiRequest<{ child: any }>(`lectures/${lectureId}/children`, {
      method: 'POST',
      body: JSON.stringify(payload),
      authenticated: true,
    }),
};

// Simple fetch wrapper for direct API calls
export const api = {
  post: async (path: string, data: any, options: RequestOptions = {}) => {
    const url = path.startsWith('http') ? path : `${API_BASE_URL}/api${path}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { response: { data: errorData, status: response.status } };
    }
    
    return response.json();
  },

  get: async (path: string, options: RequestOptions = {}) => {
    const url = path.startsWith('http') ? path : `${API_BASE_URL}/api${path}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: options.headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { response: { data: errorData, status: response.status } };
    }
    
    return response.json();
  },
};
