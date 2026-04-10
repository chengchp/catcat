const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8089'

interface FetchOptions extends RequestInit {
  params?: Record<string, string>
}

// 获取存储的Token
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('catcat_token')
}

// 设置Token
export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('catcat_token', token)
}

// 清除Token
export function clearToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('catcat_token')
}

export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options

  let url = `${API_BASE_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}

// 品种相关 API
export const breedApi = {
  getAll: () => fetchApi<{ success: boolean; data: Breed[] }>('/api/breeds'),
  getById: (breedId: string) => fetchApi<{ success: boolean; data: Breed }>(`/api/breeds/${breedId}`),
  search: (keyword: string) => fetchApi<{ success: boolean; data: Breed[] }>(`/api/breeds/search?keyword=${encodeURIComponent(keyword)}`),
  sync: () => fetchApi<{ success: boolean; data: number }>('/api/breeds/sync', { method: 'POST' }),
}

// 猫咪相关 API
export const catApi = {
  getMyCats: () => fetchApi<{ success: boolean; data: Cat[] }>('/api/cats'),
  adopt: (params?: { name?: string; breedId?: string }) => fetchApi<{ success: boolean; data: Cat }>('/api/cats/adopt', {
    method: 'POST',
    body: JSON.stringify(params ?? {}),
  }),
  setCurrent: (catId: number) => fetchApi<{ success: boolean; data: Cat }>(`/api/cats/${catId}/current`, { method: 'PUT' }),
  delete: (catId: number) => fetchApi<{ success: boolean }>(`/api/cats/${catId}`, { method: 'DELETE' }),
}

// 房间相关 API
export const roomApi = {
  getMyRoom: () => fetchApi<{ success: boolean; data: Room }>('/api/room'),
  getAvailableFurniture: () => fetchApi<{ success: boolean; data: Furniture[] }>('/api/room/furniture'),
  addFurniture: (roomId: number, furnitureId: number, positionX: number, positionY: number, rotation: number = 0) =>
    fetchApi<{ success: boolean; data: RoomFurniture }>(`/api/room/furniture`, {
      method: 'POST',
      body: JSON.stringify({ furnitureId, positionX, positionY, rotation }),
    }),
  updateFurniturePosition: (roomFurnitureId: number, positionX: number, positionY: number, rotation: number) =>
    fetchApi<{ success: boolean; data: RoomFurniture }>(`/api/room/furniture/${roomFurnitureId}`, {
      method: 'PUT',
      body: JSON.stringify({ positionX, positionY, rotation }),
    }),
  removeFurniture: (roomFurnitureId: number) =>
    fetchApi<{ success: boolean }>(`/api/room/furniture/${roomFurnitureId}`, { method: 'DELETE' }),
}

// 用户认证相关 API
export const authApi = {
  login: (account: string, password: string) =>
    fetchApi<{ success: boolean; data: { token: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ account, password }),
    }),
  register: (data: { email: string; password: string; nickname: string }) =>
    fetchApi<{ success: boolean; data: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  logout: () =>
    fetchApi<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),
  getCurrentUser: () =>
    fetchApi<{ success: boolean; data: User }>('/api/auth/current'),
}

// 类型定义
export interface Breed {
  id: number
  breedId: string
  name: string
  temperament: string
  origin: string
  description: string
  lifeSpan: string
  adaptability: number
  affectionLevel: number
  childFriendly: number
  dogFriendly: number
  energyLevel: number
  grooming: number
  healthIssues: number
  intelligence: number
  sheddingLevel: number
  socialNeeds: number
  strangerFriendly: number
  vocalisation: number
  hypoallergenic: number
  imageUrl: string
  wikipediaUrl: string
  weightImperial: string
  weightMetric: string
}

export interface Cat {
  id: number
  userId: number
  name: string
  breedId: string
  breedName: string
  dna: string
  isCurrent: boolean
  imageUrl: string
}

export interface Room {
  id: number
  userId: number
  name: string
  furniture: RoomFurniture[]
  currentCatId: number | null
}

export interface RoomFurniture {
  id: number
  furnitureId: number
  name: string
  category: string
  imageUrl: string
  emoji: string
  positionX: number
  positionY: number
  rotation: number
}

export interface Furniture {
  id: number
  name: string
  category: string
  imageUrl: string
  emoji: string
}

export interface User {
  id: number
  username: string
  nickname: string
  email: string
  avatarUrl: string
  currentCatId: number | null
  currentRoomId: number | null
}
