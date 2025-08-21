export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
}

export interface Task {
  id: number
  title: string
  description: string
  due_date: string
  completed?: boolean
  user: User
  category: Category
}

export const dummyUser: User = {
  id: 3,
  first_name: 'Carl Michael',
  last_name: 'Codog',
  email: 'carl@gmail.com',
  email_verified_at: null,
  created_at: '2025-08-18T17:54:02.000000Z',
  updated_at: '2025-08-18T17:54:02.000000Z',
}

export const dummyCategories: Category[] = [
  { id: 1, name: 'Work' },
  { id: 2, name: 'Lifestyle' },
  { id: 3, name: 'Personal' },
  { id: 4, name: 'Health' },
  { id: 5, name: 'Learning' },
]

export const dummyTasks: Task[] = [
  {
    id: 1,
    title: 'Push Up Day',
    description: 'Push-up 20 times a day',
    due_date: '2025-08-20T00:00:00.000000Z',
    completed: false,
    user: dummyUser,
    category: { id: 2, name: 'Lifestyle' },
  },
  {
    id: 2,
    title: 'Complete Project Proposal',
    description: 'Finish the quarterly project proposal for the marketing team',
    due_date: '2025-08-22T00:00:00.000000Z',
    completed: false,
    user: dummyUser,
    category: { id: 1, name: 'Work' },
  },
  {
    id: 3,
    title: 'Read 30 Pages',
    description: "Continue reading 'The Psychology of Programming' book",
    due_date: '2025-08-21T00:00:00.000000Z',
    completed: true,
    user: dummyUser,
    category: { id: 5, name: 'Learning' },
  },
  {
    id: 4,
    title: 'Doctor Appointment',
    description: 'Annual health checkup at 2:00 PM',
    due_date: '2025-08-25T00:00:00.000000Z',
    completed: false,
    user: dummyUser,
    category: { id: 4, name: 'Health' },
  },
  {
    id: 5,
    title: 'Grocery Shopping',
    description: 'Buy vegetables, fruits, and household items',
    due_date: '2025-08-19T00:00:00.000000Z',
    completed: false,
    user: dummyUser,
    category: { id: 3, name: 'Personal' },
  },
  {
    id: 6,
    title: 'Team Meeting',
    description: 'Weekly standup meeting with development team',
    due_date: '2025-08-21T00:00:00.000000Z',
    completed: true,
    user: dummyUser,
    category: { id: 1, name: 'Work' },
  },
  {
    id: 7,
    title: 'Meditation Session',
    description: '15-minute mindfulness meditation',
    due_date: '2025-08-20T00:00:00.000000Z',
    completed: false,
    user: dummyUser,
    category: { id: 4, name: 'Health' },
  },
  {
    id: 8,
    title: 'Update Portfolio',
    description: 'Add recent projects to personal portfolio website',
    due_date: '2025-08-28T00:00:00.000000Z',
    completed: false,
    user: dummyUser,
    category: { id: 3, name: 'Personal' },
  },
]
