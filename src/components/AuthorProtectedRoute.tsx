"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../redux/store";

interface AuthorProtectedRouteProps {
  children: any;
}

const AuthorProtectedRoute = ({ children }: AuthorProtectedRouteProps) => {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Not logged in → redirect to signin
    if (!user.userId || user.userId === "") {
      router.push("/signin");
      return;
    }

    // Logged in but not author → redirect home
    if (!user.isAuthor) {
      router.push("/");
      return;
    }
  }, [user, router]);

  // Pass user to child (if your structure needs it)
  return children({ user });
};

export default AuthorProtectedRoute;
