/**
 * Enterprise POS Sound System Utility
 * Synthesizes ultra-crisp audio feedback using Web Audio API for zero latency and 100% reliability (No missing MP3 files!).
 * Inspired by Shopify POS, Square POS, and Apple Pay interaction sounds.
 */

class SoundSystem {
  private ctx: AudioContext | null = null

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  // 1. Soft Tactile Click / Button Press
  playClick() {
    try {
      const ctx = this.getContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(1000, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03)

      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.03)
    } catch (e) {
      console.warn('Audio Context error', e)
    }
  }

  // 2. Success Double Chime (Product Added / Operation Succeeded)
  playSuccess() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime

      const notes = [523.25, 659.25, 783.99] // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + idx * 0.05)

        gain.gain.setValueAtTime(0.15, now + idx * 0.05)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.12)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + idx * 0.05)
        osc.stop(now + idx * 0.05 + 0.12)
      })
    } catch (e) {}
  }

  // 3. Error Buzz (Out of stock / Validation error)
  playError() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(180, now)
      osc.frequency.setValueAtTime(140, now + 0.08)

      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.2)
    } catch (e) {}
  }

  // 4. Warning Beep
  playWarning() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.setValueAtTime(350, now + 0.08)

      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.15)
    } catch (e) {}
  }

  // 5. Delete Item Swoosh
  playDelete() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, now)
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.1)

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.1)
    } catch (e) {}
  }

  // 6. Checkout Celebration Cash Register Sweep (Complete & Pay)
  playCheckout() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime

      const freqs = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(f, now + i * 0.06)

        gain.gain.setValueAtTime(0.2, now + i * 0.06)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + i * 0.06)
        osc.stop(now + i * 0.06 + 0.25)
      })
    } catch (e) {}
  }

  // 7. Cash Payment Chime
  playCash() {
    this.playCheckout()
  }

  // 8. KHQR Scan / Generated Beep
  playQR() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(1760, now) // A6
      osc.frequency.setValueAtTime(2637, now + 0.05) // E7

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.1)
    } catch (e) {}
  }

  // 9. Barcode Scanner Laser Beep
  playBarcode() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(2400, now)

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.04)
    } catch (e) {}
  }

  // 10. Notification Ping
  playNotification() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, now) // A5

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.2)
    } catch (e) {}
  }
}

export const sound = new SoundSystem()
