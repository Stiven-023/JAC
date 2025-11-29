import { Suspense } from "react";
import LoginPage from "./ui/LoginPage";

export default function Page() {
  return (
    <Suspense>
      <LoginPage/>
    </Suspense>
  );
}