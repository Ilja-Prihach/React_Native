export type UserProfile = {
  id?: string;
  name: string;
  bio: string;
  avatarUrl: string;
};

export type ProfileCardProps = {
  profile: UserProfile;
  loading: boolean;
  error: string | null;
  saving: boolean;
  isEditing: boolean;
  onSave: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
};

export type ProfileFormProps = {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
};

export type DemoItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
};
