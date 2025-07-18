export class WorkoutFormatter {
  static formatDuration(startTime: Date, endTime?: Date): string {
    const end = endTime || new Date();
    const durationMs = end.getTime() - startTime.getTime();
    const minutes = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  }

  static formatWeight(weight: number): string {
    if (weight === 0) return '0lbs';
    return weight % 1 === 0 ? `${weight}lbs` : `${weight.toFixed(1)}lbs`;
  }

  static formatProgress(completed: number, total: number): string {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return `${completed}/${total} (${percentage}%)`;
  }

  static formatSet(reps: number, weight?: number, duration?: number): string {
    let result = `${reps} rep${reps !== 1 ? 's' : ''}`;
    
    if (weight && weight > 0) {
      result += ` × ${this.formatWeight(weight)}`;
    }
    
    if (duration && duration > 0) {
      const durationStr = this.formatDuration(new Date(0), new Date(duration * 1000));
      result += ` (${durationStr})`;
    }
    
    return result;
  }

  static formatExerciseSummary(sets: number, reps: number, weight?: number): string {
    let result = `${sets} set${sets !== 1 ? 's' : ''} × ${reps} rep${reps !== 1 ? 's' : ''}`;
    
    if (weight && weight > 0) {
      result += ` @ ${this.formatWeight(weight)}`;
    }
    
    return result;
  }

  static formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  static formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  static formatRestTime(seconds: number): string {
    if (seconds === 0) return 'No rest';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
      return `${seconds}s`;
    }
    
    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }
    
    return `${minutes}m ${remainingSeconds}s`;
  }

  static formatVolume(volume: number): string {
    if (volume === 0) return '0 lbs';
    
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K lbs`;
    }
    
    return `${volume} lbs`;
  }
}