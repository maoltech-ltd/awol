// import React from "react";
// import { useTheme } from "next-themes";

// const LoadingSpinner: React.FC = () => {
//   const { theme } = useTheme();

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <div
//         className={`w-12 h-12 border-4 border-t-transparent ${
//           theme === "dark" ? "border-white" : "border-black"
//         } rounded-full animate-spin`}
//       />
//     </div>
//   );
// };

// export default LoadingSpinner;
import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div
        className="
          w-12 h-12 
          border-4 
          border-gray-300 
          dark:border-white
          border-t-transparent 
          rounded-full 
          animate-spin
        "
      />
    </div>
  );
};

export default LoadingSpinner;

