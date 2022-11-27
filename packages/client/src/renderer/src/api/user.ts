import { UserDto, UserOnboardingDto } from '@dotz/shared';
import { trpcClient } from '@renderer/trpc';

export const userService = {
  completeOnboarding(data: UserOnboardingDto) {
    return trpcClient.user.onboarding.mutate(data) as Promise<UserDto>;
  }
};
