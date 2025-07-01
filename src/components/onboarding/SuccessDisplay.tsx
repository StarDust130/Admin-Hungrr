import { motion, Variants } from "framer-motion";

// By explicitly importing and using the `Variants` type, we ensure TypeScript
// correctly validates our animation objects, fixing the "ease" property error.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const circleVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      duration: 0.7,
    },
  },
};

const checkmarkVariants: Variants = {
  hidden: { pathLength: 0 },
  visible: {
    pathLength: 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut", // This is now correctly typed
      delay: 0.5,
    },
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut", // This is now correctly typed
    },
  },
};

const DarkModeSuccess = () => {
  return (
    <motion.div
      key="dark-mode-success"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center gap-6 text-center"
    >
      {/* Animated Circle and Checkmark */}
      <motion.div
        variants={circleVariants}
        // Using a semi-transparent background for a better look on dark UI
        className="w-28 h-28 flex items-center justify-center rounded-full bg-green-500/20"
      >
        <svg
          // Increased icon size and brighter color for visibility
          className="w-14 h-14 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <motion.path
            variants={checkmarkVariants}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>

      {/* Animated Text */}
      <div className="flex flex-col items-center">
        <motion.h2
          variants={textVariants}
          // Increased font size and lighter color for the heading
          className="text-4xl font-bold dark:text-gray-100"
        >
          Success!
        </motion.h2>
        <motion.p
          variants={textVariants}
          // Increased font size and lighter color for the subheading
          className="mt-2 text-xl dark:text-gray-400"
        >
          Your changes have been saved.
        </motion.p>

        <motion.p
          variants={textVariants}
          // Increased font size and lighter color for the subheading
          className=" text-sm mt-3 dark:text-gray-300"
        >
          Redirect to Dashoard page...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default DarkModeSuccess;
