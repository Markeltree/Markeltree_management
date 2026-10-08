import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Teamora | ERP - Admin Dashboard"
        description="Teamora | ERP - Admin Dashboard - ReactJs"
      />
      <AuthLayout imageSrc="/laptop.png">
  <SignInForm />
</AuthLayout>
    </>
  );
}
