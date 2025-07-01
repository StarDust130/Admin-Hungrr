import { motion, Variants } from "framer-motion";

// Define animation variants with proper typing for TypeScript
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
      ease: "easeInOut",
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
      ease: "easeOut",
    },
  },
};

interface SuccessDisplayProps {
  user: string;
}

const SuccessDisplay = ({ user }: SuccessDisplayProps) => {
  return (
    <motion.div
      key="dark-mode-success"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center gap-6 text-center"
    >
      {/* Animated circle with checkmark */}
      <motion.div
        variants={circleVariants}
        className="w-28 h-28 flex items-center justify-center rounded-full bg-green-500/20"
      >
        <svg
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

      {/* Animated success text */}
      <div className="flex flex-col items-center">
        <motion.h2
          variants={textVariants}
          className="text-4xl font-bold dark:text-gray-100"
        >
          Success!
        </motion.h2>
        <motion.p
          variants={textVariants}
          className="mt-3 text-lg mb-4 font-medium text-green-600 dark:text-green-400 flex items-center gap-2"
        >
          Welcome aboard, <span className="font-semibold">{user}</span>!
        </motion.p>
        <motion.p
          variants={textVariants}
          className="mt-2 text-xl dark:text-gray-400"
        >
          Your onboarding is completed successfully.
        </motion.p>
        <motion.p
          variants={textVariants}
          className="mt-8 text-sm dark:text-gray-300"
        >
          Redirecting to the dashboard...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default SuccessDisplay;
