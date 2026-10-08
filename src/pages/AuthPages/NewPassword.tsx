import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import NewPassword from "../../components/auth/NewPassword";

export default function NewPasswordForm() {
  return (
    <>
      <PageMeta
        title="Teamora | ERP - Admin Dashboard"
        description="Teamora | ERP - Admin Dashboard - ReactJs"
      />
      <AuthLayout imageSrc="/laptop.png">
    <NewPassword />
</AuthLayout>
    </>
  );
}
