// src/app/(auth)/login/page.tsx
import LoginForm from "@/components/auth/login-form";
import styles from "./login.module.css";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.formCard}>
          <Image
            src="/logo.png"
            alt="Smart Pump Logo"
            width={200}
            height={80}
            className={styles.logo}
            priority
          />
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
