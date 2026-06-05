"use client";
import { Avatar, Button, useDisclosure } from "@nextui-org/react";
import React from "react";
import AuthModal from "../Auth/AuthModal";
import moment from "moment";
import Link from "next/link";
import { BackIcon } from "../icon";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/src/redux/slice/userSlice";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";

const ProfileDetails = ({ user }: any) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            {user.profilePicture == "" ? (
              <Avatar
                src={user.profilePicture}
                className="h-24 w-24 border-4 border-white shadow-lg dark:border-slate-800 md:h-32 md:w-32"
                name={user.username}
              />
            ) : (
              <div className="relative h-24 w-24 md:h-32 md:w-32">
                <Image
                  src={user.profilePicture}
                  alt={user.username}
                  quality={35}
                  fill
                  className="rounded-full border-4 border-white object-cover shadow-lg dark:border-slate-800"
                />
              </div>
            )}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-slate-950 dark:text-white md:text-3xl">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-slate-600 dark:text-slate-300">@{user.userName}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button
              color="primary"
              radius="full"
              className="font-medium px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600"
              as={Link}
              href="/edituserprofile"
            >
              Edit Profile
            </Button>

            <Button
              color="danger"
              radius="full"
              variant="flat"
              className="font-medium px-6 py-3 border border-red-200"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-slate-950 dark:text-white">About</h2>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            {user.bio && Array.isArray(user.bio) ? (
              user.bio.map((paragraph: string, index: number) => (
                <p
                  key={index}
                  className="mb-2 leading-relaxed text-slate-700 last:mb-0 dark:text-slate-300"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="leading-relaxed text-slate-700 dark:text-slate-300">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-center dark:border-blue-900/50 dark:bg-blue-950/40">
            <p className="text-2xl font-bold text-blue-600">2</p>
            <p className="text-sm text-blue-800 dark:text-blue-200">Following</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-center dark:border-emerald-900/50 dark:bg-emerald-950/40">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">3</p>
            <p className="text-sm text-emerald-800 dark:text-emerald-200">Followers</p>
          </div>
          <div className="rounded-lg border border-violet-100 bg-violet-50 p-4 text-center dark:border-violet-900/50 dark:bg-violet-950/40">
            <p className="text-2xl font-bold text-violet-600 dark:text-violet-300">12</p>
            <p className="text-sm text-violet-800 dark:text-violet-200">Posts</p>
          </div>
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-center dark:border-amber-900/50 dark:bg-amber-950/40">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-300">24</p>
            <p className="text-sm text-amber-800 dark:text-amber-200">Likes</p>
          </div>
        </div>

        {/* Join Date */}
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-slate-900">
            <BackIcon name="cake" className="text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-300">Member since</p>
            <p className="font-medium text-slate-950 dark:text-white">
              {moment(user.createdAt).format("MMMM Do, YYYY")}
            </p>
          </div>
        </div>

        {/* Mobile Only Button */}
        {user.moreInfo ? null : (
          <Button
            variant="bordered"
            fullWidth
            radius="full"
            size="lg"
            className="mt-6 font-semibold text-slate-700 dark:text-slate-100 md:hidden"
          >
            View {user.username}&apos;s Activity
          </Button>
        )}
      </div>

      <AuthModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </section>
  );
};

export default ProfileDetails;
