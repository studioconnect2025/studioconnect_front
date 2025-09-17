import { http } from "@/lib/http";
import { toApiError } from "@/utils/ApiError";
import { BasicInfo } from "@/types/owner";

export async function getOwnerBasicInfoById(id: string): Promise<BasicInfo> {
  try {
    const { data } = await http.get(`/users/${id}`);
    return {
      id: data.id,
      email: data.email,
      role: data.role ?? null,
      isActive: typeof data.isActive === "boolean" ? data.isActive : null,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      phoneNumber: data.phoneNumber ?? null,
      profilePhoto: data.profilePhoto ?? null,
      businessBio: data.businessBio ?? null,
    };
  } catch (e) {
    throw toApiError(e);
  }
}
