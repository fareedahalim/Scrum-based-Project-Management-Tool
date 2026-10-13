export interface TeamResponseDTO {
  id: string;
  name: string;
  description: string;
  lead: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}