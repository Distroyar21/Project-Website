/* eslint-disable no-unused-vars */

import { motion } from "framer-motion";
import rocketImg from './rocket.png';

function Rocket() {
  return (
      <motion.img
        src={rocketImg}
        alt="Rocket"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: -120, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        style={{ width: "80px", position: "absolute", left: "50%", transform: "translateX(-50%)" }}
      />
    
  );
}

export default Rocket;
