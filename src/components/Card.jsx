import { motion } from "framer-motion";

export default function Card({ name, image, onMouseUp, index }) {
  return (
    <motion.div
      className="card"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onMouseUp={() => onMouseUp(name)}
    >
      <img src={image} />
      <h2>{name}</h2>
    </motion.div>
  );
}
