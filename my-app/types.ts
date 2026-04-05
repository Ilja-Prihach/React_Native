export type UserProfile = {
  name: string;
  bio: string;
  avatarUrl: string;
};

export type ProfileCardProps = {
  profile: UserProfile;
  onEdit: () => void;
};

export type ProfileFormProps = {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
};
