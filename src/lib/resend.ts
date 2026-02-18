/**
 * Mock Resend email integration
 * In production, replace with real Resend API calls
 */

export interface MockEmailResult {
  success: boolean
  id?: string
  error?: string
}

export async function sendBookingConfirmation(
  userEmail: string,
  userName: string,
  className: string,
  classTime: string,
  instructorName: string
): Promise<MockEmailResult> {
  // Simulate API call
  await new Promise(r => setTimeout(r, 200))
  console.log(`[MOCK EMAIL] Booking confirmation sent to ${userEmail}`)
  console.log(`  Class: ${className} with ${instructorName} at ${classTime}`)
  return { success: true, id: `email_${Math.random().toString(36).substring(2)}` }
}

export async function sendCancellationEmail(
  userEmail: string,
  userName: string,
  className: string,
  classTime: string
): Promise<MockEmailResult> {
  await new Promise(r => setTimeout(r, 200))
  console.log(`[MOCK EMAIL] Cancellation email sent to ${userEmail} for ${className}`)
  return { success: true, id: `email_${Math.random().toString(36).substring(2)}` }
}

export async function sendWelcomeEmail(
  userEmail: string,
  userName: string
): Promise<MockEmailResult> {
  await new Promise(r => setTimeout(r, 200))
  console.log(`[MOCK EMAIL] Welcome email sent to ${userEmail}`)
  return { success: true, id: `email_${Math.random().toString(36).substring(2)}` }
}

export async function sendMembershipConfirmation(
  userEmail: string,
  userName: string,
  planName: string,
  amount: number
): Promise<MockEmailResult> {
  await new Promise(r => setTimeout(r, 200))
  console.log(`[MOCK EMAIL] Membership confirmation sent to ${userEmail} for ${planName}`)
  return { success: true, id: `email_${Math.random().toString(36).substring(2)}` }
}
