import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './WelcomeScreen.module.css'

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/register");
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Our Jewllery Shop</h1>
      <p className={styles.subtitle}>Pleasure to see you here</p>
    </div>
  );
}
