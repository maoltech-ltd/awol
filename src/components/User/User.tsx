"use client";
import { Avatar, Button, useDisclosure } from "@nextui-org/react";
import React, { useEffect } from "react";
import AuthModal from "../Auth/AuthModal";
import moment from "moment";
import Link from "next/link";
import { BackIcon } from "../icon";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { useSelector } from "react-redux";
import mutate from "swr";
import { getUserDetails } from "@/src/redux/slice/secondUserSlice";

const User =  ({ user, username }: any) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

   const dispatch = useAppDispatch();
  //  await dispatch(getUserDetails({username, token:user.token}));
   const secondUser = useSelector((state: any) => state.secondUser);

   useEffect(() => {
    if (!user?.token) return;
    if (username && user?.token) {
      dispatch(getUserDetails({ username, token: user.token }));
    }
  }, [username, user?.token, dispatch]);

  const handleFollow = () => {
    if (user.isLoggedIn) {
       mutate({ userId: user.id });
     } else {
       onOpen();
     }
  };

  return (
    <section className="md:w-[80%] m-auto md:pt-16 pt-12">
      <div className="bg-white p-4  md:rounded-md">
        <div className="flex items-center justify-between md:pl-4">
          <Avatar
            src={user.profilePicture}
            className="lg:h-28 lg:w-28 md:h-24 md:w-24 outline-[5px] outline-neutral-100 outline-offset-0 h-20 w-20 relative -mt-16"
            name={user.username}
          />
          <div className="flex flex-col justify-end gap-4">
             {user?.id === user.id
             ? (
              <Button color="primary" radius="sm" as={Link} href="/setting">
                Edit Profile
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Button color="primary" radius="sm" onClick={handleFollow}>
                   {/* currentUser.user?.followingIDs.includes(user.id) */}
                    {true
                    ? "unFollow"
                    : "Follow"}
                </Button>
                <Button isIconOnly variant="light">
                    {//more icon
                    }
                  <BackIcon name="more-horizontal" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="pt-4">
          <h1 className="lg:text-2xl md:text-xl text-lg md:font-bold font-medium">
            {user.name}
          </h1>
          <p>
            {user.username}
          </p>
          <p className="text-lg py-2">{user.bio}</p>
          <div className="flex gap-4 py-2">
            <div className="flex gap-1">
              <p className="font-semibold text-default-500 text-small">
                {user.followingIDs.length}
              </p>
              <p className=" text-default-500 text-small">Following</p>
            </div>
            <div className="flex gap-1">
              <p className="font-semibold text-default-500 text-small">
               3 {/* {user.followerIDs.length} */}
              </p>
              <p className="text-default-500 text-small">Followers</p>
            </div>
          </div>
          <div className="text-small text-default-500 py-2 flex gap-3 items-center">
            
            <BackIcon name="cake" />
            <span>
               joined on {moment(user.createdAt).format("LL")}
            </span>
          </div>
        </div>
        
        {user.moreInfo ? null : (
          <Button
            variant="bordered"
            fullWidth
            radius="sm"
            size="lg"
            className="font-semibold mt-4 md:hidden text-neutral-600"
            // onClick={() => dispatch(setMoreInfo(true))}
          >
            {user.username}
          </Button>
         )} 
      </div>

      <AuthModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </section>
  );
};

export default User;
