/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 * 
 * Shared OTP storage
 * In production, use Redis or a database
 */

interface OTPData {
  otp: string;
  expiresAt: number;
}

class OTPStore {
  private store: Map<string, OTPData>;

  constructor() {
    this.store = new Map();
  }

  set(email: string, otp: string, expiresAt: number): void {
    this.store.set(email.toLowerCase(), { otp, expiresAt });
  }

  get(email: string): OTPData | undefined {
    return this.store.get(email.toLowerCase());
  }

  delete(email: string): boolean {
    return this.store.delete(email.toLowerCase());
  }

  clear(): void {
    this.store.clear();
  }
}

// Export singleton instance
export const otpStore = new OTPStore();
