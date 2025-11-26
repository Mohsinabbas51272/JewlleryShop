import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";


export default function Register() {

      const navigate = useNavigate();


    function handleRegisterPage(){
         navigate("/signUp");
    }
    
    function handleLoginPage(){
         navigate("/logIn");
    }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome to Register Here</h2>

        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={handleRegisterPage}>Register Now</button>
          <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handleLoginPage}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
