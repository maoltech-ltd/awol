
"use client";
import { useState, useEffect } from "react";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { updateUserProfile } from "@/src/redux/slice/userSlice";
import { Button } from "@headlessui/react";
import { createImage } from "@/src/redux/slice/ImageSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

const EditProfile = ({ user }: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.userName,
    bio: user.bio,
    profilePicture: user.profilePicture,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(user.profilePicture);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "bio") {
      setFormData({ ...formData, bio: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Create a preview URL for the image
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let profilePictureUrl = formData.profilePicture;

    try {
      if (imageFile) {
        const resultAction = await dispatch(createImage(imageFile as File));
        if (createImage.fulfilled.match(resultAction)) {
          profilePictureUrl = resultAction; 
        } else {
          console.error("Image upload failed:", resultAction.payload || "Unknown error");
          setIsLoading(false);
          return;
        }
      }

      const bioArray = formData.bio.split("\n");

      const updateResult = await dispatch(
        updateUserProfile({
          data: { ...formData, bio: bioArray, profilePicture: profilePictureUrl },
          token: user.token,
        })
      );

      if (updateUserProfile.fulfilled.match(updateResult)) {
        router.push("/userprofile");
      } else {
        console.error("Profile update failed:", updateResult.payload || "Unknown error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Header */}
          <div className="bg-slate-950 px-6 py-8 dark:bg-slate-800">
            <h1 className="text-3xl font-bold text-white text-center">Edit Profile</h1>
            <p className="mt-2 text-center text-slate-200">Update your personal information</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Profile Picture Section */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-slate-800">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Profile Preview"
                      width={128}
                      height={128}
                      quality={35}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-slate-800">
                      <span className="text-sm text-slate-600 dark:text-slate-300">No image</span>
                    </div>
                  )}
                </div>
                <label htmlFor="profilePictureFile" className="cursor-pointer">
                  <div className="absolute bottom-0 right-0 rounded-full bg-emerald-600 p-2 text-white shadow-md transition-colors hover:bg-emerald-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </label>
                <input
                  type="file"
                  id="profilePictureFile"
                  name="profilePictureFile"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Click the camera icon to change your profile picture</p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="firstName">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-950 transition-all duration-200 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-950 transition-all duration-200 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-950 transition-all duration-200 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="bio">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full resize-none rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-950 transition-all duration-200 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                rows={4}
                placeholder="Tell us about yourself..."
              />
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Use line breaks to separate paragraphs</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row">
              <Button
                type="button"
                onClick={() => router.back()}
                className="flex-1 rounded-md border border-slate-300 px-6 py-3 font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-md bg-emerald-700 px-6 py-3 font-medium text-white shadow-sm transition-all duration-200 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
