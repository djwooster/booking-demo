/**
 * Mock Stripe integration
 * In production, replace with real Stripe SDK calls
 */

export interface MockCheckoutSession {
  id: string
  url: string
  amount: number
  currency: string
  status: 'complete' | 'open' | 'expired'
}

export async function createMockCheckoutSession(
  planId: string,
  amount: number,
  planName: string
): Promise<MockCheckoutSession> {
  // Simulate API call delay
  await new Promise(r => setTimeout(r, 800))

  return {
    id: `cs_mock_${Math.random().toString(36).substring(2)}`,
    url: `#mock-checkout-${planId}`,
    amount: amount * 100,
    currency: 'usd',
    status: 'complete',
  }
}

export async function simulatePayment(amount: number): Promise<{ success: boolean; paymentIntentId?: string; error?: string }> {
  await new Promise(r => setTimeout(r, 1500))

  // 95% success rate in mock mode
  if (Math.random() > 0.05) {
    return {
      success: true,
      paymentIntentId: `pi_mock_${Math.random().toString(36).substring(2)}`,
    }
  }

  return { success: false, error: 'Payment declined. Please try again.' }
}
