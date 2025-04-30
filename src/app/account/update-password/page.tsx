import type { Metadata } from 'next';
import Main from '@/components/main';
import UpdatePasswordForm from '@/components/update-password-form';

export const metadata: Metadata = {
  title: 'Update Password',
  description: 'Set a new password for your account.',
};

export default function UpdatePasswordPage() {
  return (
    <Main>
      <div className="flex flex-col items-center justify-center h-screen">
        <UpdatePasswordForm />
      </div>
    </Main>
  );
}
