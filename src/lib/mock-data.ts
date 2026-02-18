import { addDays, addHours, setHours, setMinutes, startOfDay, format } from 'date-fns'
import type { Instructor, FitnessClass, Schedule, MembershipPlan, User } from '@/types'

export const MOCK_ADMIN_EMAIL = 'admin@apexstudio.com'
export const MOCK_ADMIN_PASSWORD = 'admin123'
export const MOCK_USER_EMAIL = 'demo@example.com'
export const MOCK_USER_PASSWORD = 'demo123'

export const mockAdminUser: User = {
  id: 'admin-001',
  email: MOCK_ADMIN_EMAIL,
  name: 'Alex Morgan',
  role: 'admin',
  phone: '+1 (555) 000-0001',
  createdAt: '2023-01-01T00:00:00Z',
}

export const mockCustomerUser: User = {
  id: 'user-001',
  email: MOCK_USER_EMAIL,
  name: 'Jordan Rivera',
  role: 'customer',
  phone: '+1 (555) 123-4567',
  createdAt: '2024-03-15T00:00:00Z',
}

export const mockInstructors: Instructor[] = [
  {
    id: 'inst-001',
    name: 'Samantha Chen',
    bio: 'Certified yoga instructor with 8 years of experience in Vinyasa, Hatha, and Yin yoga. Trained in Bali and India.',
    specialties: ['Yoga', 'Pilates', 'Meditation'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=face',
    rating: 4.9,
    classCount: 1240,
  },
  {
    id: 'inst-002',
    name: 'Marcus Johnson',
    bio: 'Former professional athlete turned fitness coach. Specializes in high-intensity interval training and functional strength.',
    specialties: ['HIIT', 'Boxing', 'Strength'],
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=400&fit=crop&crop=face',
    rating: 4.8,
    classCount: 980,
  },
  {
    id: 'inst-003',
    name: 'Jake Rivera',
    bio: 'Cycling enthusiast and certified spin instructor. Known for high-energy playlists and motivating cues.',
    specialties: ['Spin', 'HIIT', 'Cardio'],
    image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&h=400&fit=crop&crop=face',
    rating: 4.7,
    classCount: 756,
  },
  {
    id: 'inst-004',
    name: 'Emma Williams',
    bio: 'Pilates master trainer and former ballet dancer. Brings grace and precision to every class.',
    specialties: ['Pilates', 'Barre', 'Yoga'],
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    rating: 4.9,
    classCount: 1102,
  },
  {
    id: 'inst-005',
    name: 'Carlos Mendez',
    bio: 'Ex-professional boxer with 15 years of training experience. Brings real-world technique to every session.',
    specialties: ['Boxing', 'HIIT', 'Strength'],
    image: 'https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?w=400&h=400&fit=crop&crop=face',
    rating: 4.8,
    classCount: 634,
  },
  {
    id: 'inst-006',
    name: 'Lily Park',
    bio: 'Dance artist and certified fitness instructor. Combines ballet barre technique with modern movement.',
    specialties: ['Barre', 'Dance', 'Yoga'],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop&crop=face',
    rating: 4.9,
    classCount: 890,
  },
]

export const mockClasses: FitnessClass[] = [
  {
    id: 'class-001',
    name: 'Vinyasa Flow',
    description: 'A dynamic, flowing yoga practice linking breath with movement. Build strength, flexibility and mindfulness in a heated room.',
    category: 'yoga',
    duration: 60,
    capacity: 20,
    difficulty: 'intermediate',
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&h=500&fit=crop',
    instructorId: 'inst-001',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'class-002',
    name: 'Power HIIT',
    description: 'High-intensity intervals designed to torch calories and build lean muscle. Expect burpees, sprints, and battle ropes.',
    category: 'hiit',
    duration: 45,
    capacity: 18,
    difficulty: 'advanced',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop',
    instructorId: 'inst-002',
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 'class-003',
    name: 'Rhythm Spin',
    description: 'A heart-pumping cycling session choreographed to the beat. Climb hills, sprint flats, and dance on the bike.',
    category: 'spin',
    duration: 50,
    capacity: 24,
    difficulty: 'all-levels',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop',
    instructorId: 'inst-003',
    color: 'from-purple-400 to-indigo-500',
  },
  {
    id: 'class-004',
    name: 'Core Pilates',
    description: 'Precision mat work targeting your deep core muscles. Improve posture, balance, and body awareness.',
    category: 'pilates',
    duration: 55,
    capacity: 16,
    difficulty: 'all-levels',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=500&fit=crop',
    instructorId: 'inst-004',
    color: 'from-pink-400 to-rose-500',
  },
  {
    id: 'class-005',
    name: 'Boxing Cardio',
    description: 'Learn real boxing techniques while getting an incredible cardio workout. No experience needed — just bring your energy.',
    category: 'boxing',
    duration: 60,
    capacity: 16,
    difficulty: 'beginner',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop',
    instructorId: 'inst-005',
    color: 'from-red-400 to-orange-500',
  },
  {
    id: 'class-006',
    name: 'Ballet Barre',
    description: 'Ballet-inspired movements at the barre to sculpt lean muscles and improve posture. Elegant yet intense.',
    category: 'barre',
    duration: 50,
    capacity: 16,
    difficulty: 'all-levels',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=500&fit=crop',
    instructorId: 'inst-006',
    color: 'from-violet-400 to-purple-500',
  },
  {
    id: 'class-007',
    name: 'Strength Circuit',
    description: 'Full-body strength training using barbells, dumbbells, and kettlebells. Progressive overload principles for maximum gains.',
    category: 'strength',
    duration: 60,
    capacity: 14,
    difficulty: 'advanced',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop',
    instructorId: 'inst-002',
    color: 'from-slate-400 to-gray-600',
  },
  {
    id: 'class-008',
    name: 'Yin Yoga',
    description: 'A slow-paced practice holding poses for 3-5 minutes to release deep connective tissue. Perfect for recovery and stress relief.',
    category: 'yoga',
    duration: 75,
    capacity: 20,
    difficulty: 'beginner',
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&h=500&fit=crop',
    instructorId: 'inst-001',
    color: 'from-teal-400 to-cyan-500',
  },
  {
    id: 'class-009',
    name: 'Dance Fusion',
    description: 'A fun, high-energy mix of hip-hop, Latin, and contemporary dance styles. No dance experience required!',
    category: 'dance',
    duration: 60,
    capacity: 22,
    difficulty: 'beginner',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=500&fit=crop',
    instructorId: 'inst-006',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    id: 'class-010',
    name: 'Mindful Meditation',
    description: 'Guided meditation and breathwork sessions to reduce stress, improve focus, and cultivate inner calm.',
    category: 'meditation',
    duration: 45,
    capacity: 25,
    difficulty: 'all-levels',
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&h=500&fit=crop',
    instructorId: 'inst-001',
    color: 'from-blue-400 to-indigo-500',
  },
]

// Schedule generation — creates 2 weeks of classes
function createSchedule(
  id: string,
  classId: string,
  instructorId: string,
  daysFromNow: number,
  hour: number,
  minute: number,
  bookedCount: number,
  waitlistCount = 0
): Schedule {
  const classItem = mockClasses.find(c => c.id === classId)!
  const duration = classItem.duration
  const base = startOfDay(new Date())
  const start = setMinutes(setHours(addDays(base, daysFromNow), hour), minute)
  const end = addHours(start, Math.floor(duration / 60))
  const endWithMinutes = setMinutes(end, (start.getMinutes() + (duration % 60)) % 60)

  return {
    id,
    classId,
    instructorId,
    startTime: start.toISOString(),
    endTime: endWithMinutes.toISOString(),
    status: 'active',
    bookedCount,
    waitlistCount,
    availableSpots: classItem.capacity - bookedCount,
    class: classItem,
    instructor: mockInstructors.find(i => i.id === instructorId),
  }
}

export const mockSchedules: Schedule[] = [
  // Today
  createSchedule('sched-001', 'class-001', 'inst-001', 0, 6, 0, 12),
  createSchedule('sched-002', 'class-002', 'inst-002', 0, 7, 0, 18, 2),
  createSchedule('sched-003', 'class-003', 'inst-003', 0, 9, 30, 20),
  createSchedule('sched-004', 'class-004', 'inst-004', 0, 12, 0, 8),
  createSchedule('sched-005', 'class-005', 'inst-005', 0, 17, 30, 15),
  createSchedule('sched-006', 'class-006', 'inst-006', 0, 18, 30, 16),
  createSchedule('sched-007', 'class-008', 'inst-001', 0, 19, 30, 6),

  // Tomorrow
  createSchedule('sched-008', 'class-002', 'inst-002', 1, 6, 0, 14),
  createSchedule('sched-009', 'class-001', 'inst-001', 1, 7, 30, 10),
  createSchedule('sched-010', 'class-007', 'inst-002', 1, 9, 0, 13),
  createSchedule('sched-011', 'class-004', 'inst-004', 1, 12, 0, 6),
  createSchedule('sched-012', 'class-003', 'inst-003', 1, 17, 0, 22),
  createSchedule('sched-013', 'class-009', 'inst-006', 1, 18, 0, 15),
  createSchedule('sched-014', 'class-010', 'inst-001', 1, 20, 0, 18),

  // Day 2
  createSchedule('sched-015', 'class-005', 'inst-005', 2, 6, 30, 10),
  createSchedule('sched-016', 'class-006', 'inst-006', 2, 8, 0, 14),
  createSchedule('sched-017', 'class-002', 'inst-002', 2, 12, 0, 18, 1),
  createSchedule('sched-018', 'class-001', 'inst-001', 2, 17, 30, 17),
  createSchedule('sched-019', 'class-003', 'inst-003', 2, 19, 0, 20),

  // Day 3
  createSchedule('sched-020', 'class-008', 'inst-001', 3, 7, 0, 15),
  createSchedule('sched-021', 'class-002', 'inst-002', 3, 9, 0, 16),
  createSchedule('sched-022', 'class-004', 'inst-004', 3, 12, 30, 10),
  createSchedule('sched-023', 'class-007', 'inst-002', 3, 17, 0, 12),
  createSchedule('sched-024', 'class-009', 'inst-006', 3, 18, 30, 18),

  // Day 4
  createSchedule('sched-025', 'class-001', 'inst-001', 4, 6, 0, 8),
  createSchedule('sched-026', 'class-005', 'inst-005', 4, 7, 30, 14),
  createSchedule('sched-027', 'class-003', 'inst-003', 4, 17, 0, 21),
  createSchedule('sched-028', 'class-006', 'inst-006', 4, 18, 0, 9),
  createSchedule('sched-029', 'class-010', 'inst-001', 4, 19, 30, 22),

  // Day 5
  createSchedule('sched-030', 'class-002', 'inst-002', 5, 8, 0, 16),
  createSchedule('sched-031', 'class-004', 'inst-004', 5, 10, 0, 14),
  createSchedule('sched-032', 'class-009', 'inst-006', 5, 11, 0, 20),
  createSchedule('sched-033', 'class-007', 'inst-002', 5, 16, 0, 10),

  // Day 6
  createSchedule('sched-034', 'class-001', 'inst-001', 6, 9, 0, 12),
  createSchedule('sched-035', 'class-003', 'inst-003', 6, 10, 0, 19),
  createSchedule('sched-036', 'class-008', 'inst-001', 6, 11, 30, 16),
  createSchedule('sched-037', 'class-005', 'inst-005', 6, 14, 0, 8),

  // Day 7-14
  createSchedule('sched-038', 'class-002', 'inst-002', 7, 7, 0, 13),
  createSchedule('sched-039', 'class-001', 'inst-001', 7, 9, 30, 10),
  createSchedule('sched-040', 'class-006', 'inst-006', 7, 18, 0, 7),
  createSchedule('sched-041', 'class-004', 'inst-004', 8, 12, 0, 4),
  createSchedule('sched-042', 'class-007', 'inst-002', 9, 17, 0, 9),
  createSchedule('sched-043', 'class-009', 'inst-006', 10, 18, 30, 14),
  createSchedule('sched-044', 'class-003', 'inst-003', 11, 9, 0, 20),
  createSchedule('sched-045', 'class-010', 'inst-001', 12, 20, 0, 11),
  createSchedule('sched-046', 'class-002', 'inst-002', 13, 6, 30, 17),
  createSchedule('sched-047', 'class-001', 'inst-001', 14, 7, 0, 8),
]

export const mockMembershipPlans: MembershipPlan[] = [
  {
    id: 'plan-001',
    name: 'Drop-In Pass',
    description: 'Perfect for trying out classes. Pay per session with no commitment.',
    price: 20,
    type: 'dropin',
    features: [
      'Single class access',
      'All class types',
      'No commitment',
      'Book up to 7 days ahead',
    ],
    color: 'border-stone-200',
  },
  {
    id: 'plan-002',
    name: '10-Class Pack',
    description: 'Best value for regulars. Save 25% vs drop-in and use credits at your own pace.',
    price: 150,
    type: 'pack',
    credits: 10,
    durationDays: 90,
    features: [
      '10 class credits',
      'All class types',
      'Valid for 90 days',
      'Book up to 14 days ahead',
      'Priority waitlist',
    ],
    popular: true,
    color: 'border-green-500',
  },
  {
    id: 'plan-003',
    name: 'Unlimited Monthly',
    description: 'The ultimate commitment for dedicated members. Unlimited classes all month.',
    price: 120,
    type: 'unlimited',
    durationDays: 30,
    features: [
      'Unlimited classes',
      'All class types',
      'Month-to-month',
      'Book up to 14 days ahead',
      'Priority waitlist',
      'Guest pass (1/month)',
    ],
    color: 'border-teal-500',
  },
]

// Pre-loaded bookings for the demo user
export const mockUserBookings = [
  {
    id: 'booking-001',
    userId: 'user-001',
    scheduleId: 'sched-003',
    status: 'confirmed' as const,
    bookedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    schedule: mockSchedules.find(s => s.id === 'sched-003'),
  },
  {
    id: 'booking-002',
    userId: 'user-001',
    scheduleId: 'sched-009',
    status: 'confirmed' as const,
    bookedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    schedule: mockSchedules.find(s => s.id === 'sched-009'),
  },
  {
    id: 'booking-003',
    userId: 'user-001',
    scheduleId: 'sched-031',
    status: 'confirmed' as const,
    bookedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    schedule: mockSchedules.find(s => s.id === 'sched-031'),
  },
]

export const mockUserMembership = {
  id: 'memb-001',
  userId: 'user-001',
  planId: 'plan-002',
  plan: mockMembershipPlans[1],
  status: 'active' as const,
  startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 80).toISOString(),
  creditsRemaining: 7,
  creditsUsed: 3,
}

// All bookings for admin view
export const mockAllBookings = [
  ...mockUserBookings,
  { id: 'booking-004', userId: 'user-002', scheduleId: 'sched-001', status: 'confirmed' as const, bookedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), schedule: mockSchedules.find(s => s.id === 'sched-001') },
  { id: 'booking-005', userId: 'user-003', scheduleId: 'sched-001', status: 'confirmed' as const, bookedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), schedule: mockSchedules.find(s => s.id === 'sched-001') },
  { id: 'booking-006', userId: 'user-004', scheduleId: 'sched-002', status: 'confirmed' as const, bookedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), schedule: mockSchedules.find(s => s.id === 'sched-002') },
  { id: 'booking-007', userId: 'user-005', scheduleId: 'sched-005', status: 'confirmed' as const, bookedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), schedule: mockSchedules.find(s => s.id === 'sched-005') },
  { id: 'booking-008', userId: 'user-006', scheduleId: 'sched-003', status: 'cancelled' as const, bookedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), schedule: mockSchedules.find(s => s.id === 'sched-003') },
]

// Revenue data for charts (last 7 days)
export const revenueData = Array.from({ length: 7 }, (_, i) => ({
  date: format(addDays(new Date(), -6 + i), 'EEE'),
  revenue: Math.floor(Math.random() * 800) + 200,
  bookings: Math.floor(Math.random() * 25) + 10,
}))

// Bookings by class type for charts
export const classTypeData = [
  { name: 'Yoga', bookings: 42, color: '#16A34A' },
  { name: 'HIIT', bookings: 38, color: '#EF4444' },
  { name: 'Spin', bookings: 35, color: '#8B5CF6' },
  { name: 'Pilates', bookings: 28, color: '#EC4899' },
  { name: 'Boxing', bookings: 22, color: '#F97316' },
  { name: 'Barre', bookings: 19, color: '#0D9488' },
]
