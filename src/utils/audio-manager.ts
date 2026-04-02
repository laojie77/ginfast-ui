const AUDIO_STATE_KEY = 'audio_playing';
const AUDIO_INTERACTED_KEY = 'audio_interacted';

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  public onPlayError: ((error: any) => void) | null = null;

  isPlaying(): boolean {
    return localStorage.getItem(AUDIO_STATE_KEY) === 'true';
  }

  hasInteracted(): boolean {
    return localStorage.getItem(AUDIO_INTERACTED_KEY) === 'true';
  }

  toggle(): boolean {
    localStorage.setItem(AUDIO_INTERACTED_KEY, 'true');
    const playing = this.isPlaying();
    if (playing) {
      this.stop();
      localStorage.setItem(AUDIO_STATE_KEY, 'false');
      return false;
    } else {
      this.play();
      localStorage.setItem(AUDIO_STATE_KEY, 'true');
      return true;
    }
  }

  play(): void {
    if (!this.audio) {
      this.audio = new Audio('/mp3/notice.mp3');
      this.audio.loop = true;
    }
    this.audio.play().catch(err => {
      console.log('播放失败:', err);
      if (this.onPlayError) {
        this.onPlayError(err);
      }
    });
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }
}

export const audioManager = new AudioManager();
