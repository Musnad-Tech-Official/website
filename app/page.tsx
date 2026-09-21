import Image from "next/image";
import { Navbar } from "@/components/navbar/navbar";

export default function Home() {
  const { theme, setTheme, resolvedTheme } = useTheme();



  return (
    <>
      <Navbar />
    </>
  );
}