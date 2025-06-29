import MenuPage from "@/components/menuComp/MenuPage"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu Management",
  description: "Manage your cafe's menu items and categories efficiently.",
};

const page = () => {
  return (
    <MenuPage />
  )
}
export default page