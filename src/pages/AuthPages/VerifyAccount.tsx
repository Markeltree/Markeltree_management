// import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
// import SignInForm from "../../components/auth/SignInForm";
import VerifyAccount from "../../components/auth/VerifyAccount";

export default function VerifyAccountForm() {
  return (
    <>
      {/* <PageMeta
        title="Teamora | ERP - Admin Dashboard"
        description="Teamora | ERP - Admin Dashboard - ReactJs"
      /> */}
      <AuthLayout imageSrc="/woman-laptop.png">
        <VerifyAccount />
      </AuthLayout>
    </>
  );
}
