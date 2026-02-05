import api from './api';

const getToken = () => {
  try {
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr || '{}');
    const token = user?.token;
    return typeof token === 'string' && token.trim().length > 0 ? token : undefined;
  } catch {
    return undefined;
  }
};

const getAuthHeaders = () => {
  const token = getToken();

  if (!token) {
    throw new Error('Authentication required');
  }

  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const getMyMaterials = async () => {
  try {
    const response = await api.get('/api/ai/materials', getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching my materials:', error);
    throw error;
  }
};

export const getPublicMaterials = async () => {
  try {
    const response = await api.get('/api/ai/materials/public', getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching public materials:', error);
    throw error;
  }
};

export const uploadMaterial = async (formData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await api.post('/api/ai/materials/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading material:', error);
    throw error;
  }
};

export const submitMaterialForApproval = async (id) => {
  try {
    const response = await api.post(`/api/ai/materials/${id}/submit-for-approval`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error submitting material for approval:', error);
    throw error;
  }
};

export const approveMaterial = async (id) => {
  try {
    const response = await api.post(`/api/ai/materials/${id}/approve`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error approving material:', error);
    throw error;
  }
};

export const rejectMaterial = async (id, reason) => {
  try {
    const response = await api.post(`/api/ai/materials/${id}/reject`, { reason }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error rejecting material:', error);
    throw error;
  }
};

export const indexMaterial = async (id) => {
  try {
    const response = await api.post(`/api/ai/materials/${id}/index`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error indexing material:', error);
    throw error;
  }
};

export const getAllMaterialsAdmin = async (filter = 'all') => {
  try {
    const auth = getAuthHeaders();
    const response = await api.get('/api/ai/materials/admin', {
      ...auth,
      params: { filter },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin materials:', error);
    throw error;
  }
};

export const updateMaterial = async (id, payload) => {
  try {
    const response = await api.put(`/api/ai/materials/${id}`, payload, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
};

export const deleteMaterial = async (id) => {
  try {
    const response = await api.delete(`/api/ai/materials/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error deleting material:', error);
    throw error;
  }
};

export const getAiSettings = async () => {
  try {
    const response = await api.get('/api/ai/settings', getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching AI settings:', error);
    throw error;
  }
};

export const updateAiSettings = async ({ requireApproval }) => {
  try {
    const response = await api.put('/api/ai/settings', { requireApproval }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating AI settings:', error);
    throw error;
  }
};

export const askAI = async ({ question, materialIds }) => {
  try {
    const response = await api.post('/api/ai/query', { question, materialIds }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error querying AI:', error);
    throw error;
  }
};

export const askAIWithConversation = async ({ question, materialIds, conversationId }) => {
  try {
    const response = await api.post(
      '/api/ai/query',
      { question, materialIds, conversationId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error querying AI:', error);
    throw error;
  }
};

export const listAiConversations = async () => {
  try {
    const response = await api.get('/api/ai/conversations', getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error listing AI conversations:', error);
    throw error;
  }
};

export const getAiStats = async () => {
  try {
    const response = await api.get('/api/ai/stats', getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching AI stats:', error);
    throw error;
  }
};

export const getAiConversation = async (id) => {
  try {
    const response = await api.get(`/api/ai/conversations/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching AI conversation:', error);
    throw error;
  }
};

export const getAiChunk = async (id) => {
  try {
    const response = await api.get(`/api/ai/chunks/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching AI chunk:', error);
    throw error;
  }
};

export const streamAskAI = async ({ question, materialIds, onToken, onEnd, onError, signal }) => {
  try {
    const baseURL = api.defaults.baseURL || '';
    const url = `${baseURL}/api/ai/query/stream`;

    const auth = getAuthHeaders();

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        ...auth.headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, materialIds }),
      signal,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error('Streaming not supported by this browser/runtime');

    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split('\n\n');
      buffer = parts.pop() || '';

      for (const part of parts) {
        const lines = part.split('\n');
        const eventLine = lines.find((l) => l.startsWith('event:'));
        const dataLine = lines.find((l) => l.startsWith('data:'));
        const event = eventLine ? eventLine.replace('event:', '').trim() : 'message';
        const dataStr = dataLine ? dataLine.replace('data:', '').trim() : '';

        if (event === 'end') {
          onEnd?.();
          return;
        }

        if (event === 'error') {
          const payload = dataStr ? JSON.parse(dataStr) : { message: 'Stream error' };
          onError?.(new Error(payload.message || 'Stream error'));
          return;
        }

        if (dataStr) {
          const payload = JSON.parse(dataStr);
          if (payload.token) onToken?.(payload.token);
        }
      }
    }

    onEnd?.();
  } catch (error) {
    console.error('Error streaming AI query:', error);
    onError?.(error);
    throw error;
  }
};

export const summarizeMaterial = async ({ materialIds, style, saveConversation = false, conversationId }) => {
  try {
    const response = await api.post('/api/ai/summarize', { materialIds, style, conversationId, saveConversation }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error summarizing material:', error);
    throw error;
  }
};

export const summarizeMaterialSaved = async ({ materialIds, style, conversationId }) => {
  return summarizeMaterial({ materialIds, style, conversationId, saveConversation: true });
};

export const generateExam = async ({ materialIds, count }) => {
  try {
    const response = await api.post('/api/ai/exam-engine/generate', { materialIds, count }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error generating exam:', error);
    throw error;
  }
};

export const generateExamSaved = async ({ materialIds, count, conversationId }) => {
  try {
    const response = await api.post(
      '/api/ai/exam-engine/generate',
      { materialIds, count, conversationId, saveConversation: true },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error generating exam:', error);
    throw error;
  }
};

export const advisorPlan = async ({ prompt }) => {
  try {
    const response = await api.post('/api/ai/advisor/plan', { prompt }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error generating advisor plan:', error);
    throw error;
  }
};
