import { useGetMyUser, useUpdateMyUser } from "@/api/MyUserApi";
import UserProflieForm from "@/forms/user-profile-form/UserProflieForm";

const UserProfliePage = () => {
  const { isLoading: isGetLoading, currentUser } = useGetMyUser();
  const { isLoading: isUpdateLoading, updateUser } = useUpdateMyUser();

  if (isGetLoading) {
    return <span>Loading...</span>;
  }
  if (!currentUser) {
    return <span>Unable to load user profile</span>;
  }
  return (
    <UserProflieForm
      currentUser={currentUser}
      isLoading={isUpdateLoading}
      onSave={updateUser}
    />
  );
};

export default UserProfliePage;
