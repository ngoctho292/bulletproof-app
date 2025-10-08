import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>
      <LoginForm />
    </div>
  );
}