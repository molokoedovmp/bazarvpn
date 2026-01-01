import Link from "next/link";
import styles from "./styles.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  searchParams: {
    status?: string;
    payment_id?: string;
  };
};

export default function PaymentResult({ searchParams }: Props) {
  const rawStatus = Array.isArray(searchParams?.status)
    ? searchParams.status[0]
    : searchParams?.status || "";
  const normalizedStatus = rawStatus.trim().toLowerCase();
  const paymentId = searchParams?.payment_id;

  const successStates = new Set(["success", "succeeded", "paid", "done", "completed"]);
  const failureStates = new Set(["fail", "failed", "canceled", "cancelled", "refused"]);

  const isFailure = failureStates.has(normalizedStatus);
  const isSuccess =
    successStates.has(normalizedStatus) ||
    normalizedStatus.includes("success") ||
    normalizedStatus.includes("succeed") ||
    (!isFailure && Boolean(paymentId)) ||
    (!isFailure && normalizedStatus === "");
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
