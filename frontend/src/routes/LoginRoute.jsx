import { LoginScreen } from '../components/login/LoginScreen';
import { useAuthCtx } from './context';

export function LoginRoute() {
  const auth = useAuthCtx();
  return (
    <LoginScreen
      onSignIn={auth.signIn}
      onSubmitNewPassword={auth.submitNewPassword}
      onSignUp={auth.signUp}
      onConfirmSignUp={auth.confirmSignUp}
      onResendCode={auth.resendCode}
      onForgotPassword={auth.forgotPassword}
      onConfirmForgotPassword={auth.confirmForgotPassword}
    />
  );
}
