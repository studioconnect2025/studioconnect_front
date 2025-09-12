export interface BasicInfo {
  id: string;
  email: string;
  role: string | null;
  isActive: boolean | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  profilePhoto?: string | null;
  businessBio?: string | null;
}
