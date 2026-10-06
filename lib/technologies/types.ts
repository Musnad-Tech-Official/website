export interface ManagedTechnology {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Database" | "DevOps & Cloud" | "Mobile & Desktop" | "AI & Realtime" | "Other";
  enabledHome: boolean;
  displayOrder: number;
  createdAt?: string;
}

export interface NewTechnologyInput {
  id?: string;
  name: string;
  category?: ManagedTechnology["category"];
  enabledHome?: boolean;
}
