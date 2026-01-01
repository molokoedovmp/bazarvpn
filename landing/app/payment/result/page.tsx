"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./styles.module.css";

function PaymentResultContent() {
  const params = useSearchParams();
  const rawStatus = params.get("status") || "";
  const paymentId = params.get("payment_id") || undefined;
  const normalizedStatus = rawStatus.trim().toLowerCase();

  const successStates = new Set(["success", "succeeded", "paid", "done", "completed"]);
  const isSuccess =
    successStates.has(normalizedStatus) ||
    normalizedStatus.includes("success") ||
    normalizedStatus.includes("succeed");

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={isSuccess ? styles.iconSuccess : styles.iconError}>
          {isSuccess ? "✓" : "!"}
        </div>
        <h1 className={styles.title}>{isSuccess ? "Оплата прошла успешно" : "Оплата не завершена"}</h1>
        <p className={styles.message}>
          {isSuccess
            ? "Спасибо! Мы обрабатываем ваш платеж. Подписка активируется автоматически."
            : "Платеж не был завершен. Попробуйте еще раз или свяжитесь с поддержкой."}
        </p>
        {paymentId && <p className={styles.meta}>ID платежа: {paymentId}</p>}
        <div className={styles.actions}>
          <Link href="/" className={styles.button}>
            Вернуться на главную
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentResult() {
  return (
    <Suspense fallback={<main className={styles.container}></main>}>
      <PaymentResultContent />
    </Suspense>
  );
}
