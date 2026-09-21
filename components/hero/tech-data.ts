export type TechId =
  | "vite"
  | "nextjs"
  | "react"
  | "react-native"
  | "expo"
  | "figma"
  | "typescript"
  | "javascript"
  | "tailwind"
  | "nodejs"
  | "nestjs"
  | "springboot"
  | "java"
  | "electron"
  | "graphql"
  | "clerk"
  | "firebase"
  | "supabase"
  | "postgresql"
  | "mysql"
  | "mongodb"
  | "php"
  | "docker";

export interface TechItem {
  id: TechId;
  name: string;
  rotation: number;
}

export interface TechRow {
  id: string;
  items: TechItem[];
}

export const TECH_ROWS: TechRow[] = [
  {
    id: "row-1",
    items: [
      { id: "vite", name: "Vite", rotation: -3 },
      { id: "nextjs", name: "Next.js", rotation: 2 },
      { id: "react", name: "React", rotation: -1 },
    ],
  },
  {
    id: "row-2",
    items: [
      { id: "react-native", name: "React Native", rotation: 2 },
      { id: "expo", name: "Expo", rotation: -2 },
      { id: "figma", name: "Figma", rotation: 3 },
    ],
  },
  {
    id: "row-3",
    items: [
      { id: "typescript", name: "TypeScript", rotation: -2 },
      { id: "javascript", name: "JavaScript", rotation: 2 },
      { id: "tailwind", name: "Tailwind CSS", rotation: -3 },
    ],
  },
  {
    id: "row-4",
    items: [
      { id: "nodejs", name: "Node.js", rotation: 2 },
      { id: "nestjs", name: "NestJS", rotation: -2 },
      { id: "springboot", name: "Spring Boot", rotation: 1 },
      { id: "java", name: "Java", rotation: -3 },
    ],
  },
  {
    id: "row-5",
    items: [
      { id: "electron", name: "Electron", rotation: -1 },
      { id: "graphql", name: "GraphQL", rotation: 3 },
      { id: "clerk", name: "Clerk", rotation: -2 },
    ],
  },
  {
    id: "row-6",
    items: [
      { id: "firebase", name: "Firebase", rotation: 2 },
      { id: "supabase", name: "Supabase", rotation: -3 },
      { id: "postgresql", name: "PostgreSQL", rotation: 1 },
    ],
  },
  {
    id: "row-7",
    items: [
      { id: "mysql", name: "MySQL", rotation: -2 },
      { id: "mongodb", name: "MongoDB", rotation: 2 },
      { id: "php", name: "PHP", rotation: -1 },
      { id: "docker", name: "Docker", rotation: 3 },
    ],
  },
];

export const ALL_TECH_ITEMS: TechItem[] = TECH_ROWS.flatMap((row) => row.items);

