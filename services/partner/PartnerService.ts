import { WorkoutPartner, UserType } from '../../types';
import { MOCK_COACHES, MOCK_TRAINEES } from '../../constants/workoutData';

export class PartnerService {
  getAvailablePartners(userType: UserType): WorkoutPartner[] {
    switch (userType) {
      case 'coach':
        return MOCK_TRAINEES.map(partner => ({ ...partner, isSelected: false }));
      case 'trainee':
        return MOCK_COACHES.map(partner => ({ ...partner, isSelected: false }));
      default:
        return [];
    }
  }
}
