import type { User } from '../types/user'

export const mockUsers: User[] = [
  {
    id: 'user-01',
    firstName: 'Pablo',
    lastName: 'Ramírez',
    email: 'pablo.cliente@example.com',
    role: 'client',
    favoriteWorkerIds: ['worker-01', 'worker-03'],
  },
  {
    id: 'user-02',
    firstName: 'Carlos',
    lastName: 'Gómez',
    email: 'carlos.electricista@example.com',
    role: 'provider',
    workerId: 'worker-01',
  },
  {
    id: 'user-03',
    firstName: 'María',
    lastName: 'Fernández',
    email: 'maria.plomera@example.com',
    role: 'provider',
    workerId: 'worker-02',
  },
  {
    id: 'user-04',
    firstName: 'Admin',
    lastName: 'OficiosYa',
    email: 'admin@oficiosya.com',
    role: 'admin',
  },
  {
    id: 'user-05',
    firstName: 'Sofía',
    lastName: 'López',
    email: 'sofia.cliente@example.com',
    role: 'client',
    favoriteWorkerIds: [],
  },
]