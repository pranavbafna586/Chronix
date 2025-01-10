export interface Message {
  sender: string
  id: string
  content: string
  senderId: string
  timestamp: Date
  isDeleted?: boolean
  isDeletedForEveryone?: boolean
  isEdited?: boolean
  originalContent?: string
  forwardedFrom?: string
  type: 'text' | 'image' | 'pdf' | 'audio'
  fileUrl?: string
}

export interface User {
  id: string
  name: string
  avatar?: string
  isOnline?: boolean
  role?: string
  status?: string
  contactNumber?: string
  personalInfo?: string
}

export interface Chat {
  admins: any
  id: string
  name: string
  avatar?: string
  isGroup: boolean
  participants: User[]
  lastMessage?: Message
  unreadCount: number
}

export interface Group extends Chat {
  admins: string[]
}

export interface Contact {
  id: string
  name: string
  avatar?: string
  status?: string
}

