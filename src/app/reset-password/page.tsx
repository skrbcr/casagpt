import type { Metadata } from 'next';
import Main from '@/components/main';
import ResetPasswordForm from '@/components/reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your password.',
};

export default function ResetPasswordPage() {
  return (
    <Main>
      <div className="flex flex-col items-center justify-center h-screen">
        <ResetPasswordForm />
      </div>
    </Main>
  );
}
