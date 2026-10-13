export interface ITempUserData {
    firstName:string,
    lastName:string,
    email:string,
    phone:string,
    password:string,
    profileImage?:string
}

export interface ITempUserStore {
  save(email: string, data:ITempUserData, ttlSecond: number): Promise<void>
  get(email: string): Promise<ITempUserData|null>
  delete(email: string): Promise<void>
}