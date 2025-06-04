const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const createPaste = async (paste) => {
  const response = await fetch(`${API_URL}/pastes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: paste.content,
      language: paste.language,
      expiresIn: getExpirationTime(paste.expiration),
      burnAfterRead: paste.burnAfterRead,
      isPrivate: paste.isPrivate,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create paste');
  }

  return response.json();
};

export const getPaste = async (id) => {
  const response = await fetch(`${API_URL}/pastes/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Paste not found or has been burned');
    }
    throw new Error('Failed to fetch paste');
  }

  return response.json();
};

export const getAllPastes = async () => {
  const response = await fetch(`${API_URL}/pastes`);

  if (!response.ok) {
    throw new Error('Failed to fetch pastes');
  }

  return response.json();
};

const getExpirationTime = (expiration) => {
  switch (expiration) {
    case '5min':
      return 5 * 60 * 1000;
    case '10min':
      return 10 * 60 * 1000;
    case '1hour':
      return 60 * 60 * 1000;
    case '1day':
      return 24 * 60 * 60 * 1000;
    case '1week':
      return 7 * 24 * 60 * 60 * 1000;
    default:
      return null;
  }
};
