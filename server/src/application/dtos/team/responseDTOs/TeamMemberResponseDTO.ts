export interface TeamMemberResponseDTO {
  id: string;
  userId: string;
  teamId: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
  joinedAt: Date;
}