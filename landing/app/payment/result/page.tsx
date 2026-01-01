import Link from "next/link";
import styles from "./styles.module.css";

type Props = {
  searchParams: {
    status?: string;
    payment_id?: string;
  };
};

export default function PaymentResult({ searchParams }: Props) {
  const isSuccess = searchParams.status === "success" || searchParams.status === "succeeded";
  const paymentId = searchParams.payment_id;

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
