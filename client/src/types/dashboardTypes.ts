
export interface NavLink {
  label: string;
  icon: string;
}

export interface PrimaryAction {
  label: string;
}

export interface Stat {
  label: string;
  value: string;
  note?: string;
  action?: string;
}

export interface ActiveProject {
  name: string;
  manager: string;
  status: "On Track" | "Planning" | "Completed";
  due: string;
  progressPercent: number;
}

export interface Team {
  name: string;
  members: number;
}

export interface RecentActivity {
  text: string;
  time: string;
}
