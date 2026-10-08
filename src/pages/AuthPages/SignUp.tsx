import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Markeltree | ERP - Admin Dashboard"
        description="Markeltree | ERP - Admin Dashboard - ReactJs"
      />
      <AuthLayout imageSrc="/woman-laptop.png">
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
