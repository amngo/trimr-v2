const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface Link {
  id: string;
  name?: string;
  slug: string;
  original: string;
  clicks: number;
  createdAt: string;
  lastUpdated: string;
  shortUrl: string;
}

export interface CreateLinkRequest {
  url: string;
  name?: string;
}

export interface CreateLinkResponse {
  shortUrl: string;
  slug: string;
}

export async function createLink(data: CreateLinkRequest): Promise<CreateLinkResponse> {
  const response = await fetch(`${API_BASE_URL}/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create link');
  }

  return response.json();
}

export async function getLinks(): Promise<Link[]> {
  const response = await fetch(`${API_BASE_URL}/links`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch links');
  }

  return response.json();
}