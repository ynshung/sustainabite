import { useContext } from "react";
import { AdminContext } from "./AdminContext";

export function useAdminContext() {
  return useContext(AdminContext);
}
