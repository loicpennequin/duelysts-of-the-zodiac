import type { EmailTemplate } from '../types';

export const lostPasswordTemplate: EmailTemplate<'username' | 'link'> = ({
  username,
  link
}) => {
  return {
    subject: `Duelysts of the Zodiac - Password reset`,
    body: `<p>Hello ${username}, please <a target="_blank" href="${link}">follow this link to reset your password</a>.`
  };
};
