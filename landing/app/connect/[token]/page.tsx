"use client";

import { useMemo, useState } from "react";
import styles from "./styles.module.css";

type Device = "macos" | "windows" | "ios" | "android";

const deviceTitles: Record<Device, string> = {
  macos: "macOS",
  windows: "Windows",
  ios: "iOS",
  android: "Android",
};

const downloadLinks: Record<Device, string> = {
  macos: "https://apps.apple.com/en/app/v2raytun/id6476628951",
  windows: "https://storage.v2raytun.com/v2RayTun_Setup.exe",
  ios: "https://apps.apple.com/en/app/v2raytun/id6476628951",
  android: "https://play.google.com/store/apps/details?id=com.v2raytun.android",
};

function InstructionList({ connectUrl }: { connectUrl: string }) {
  const steps: string[] = [
    "Откройте приложение V2rayTun.",
    "Найдите опцию импорта или добавления конфигурации по ссылке (URL).",
    `Вставьте ссылку подключения:\n${connectUrl}`,
    "Сохраните профиль и включите туннель.",
  ];

  return (
    <ol className={styles.steps}>
      {steps.map((step, idx) => (
        <li key={idx}>{step}</li>
      ))}
    </ol>
  );
}

export default function ConnectPage({ params }: { params: { token: string } }) {
  const [activeDevice, setActiveDevice] = useState<Device>("macos");
  const connectUrl = useMemo(() => `https://bazarvpn.ru/connect/${params.token}`, [params.token]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(connectUrl);
      alert("Ссылка скопирована");
    } catch {
      alert("Не удалось скопировать ссылку. Скопируйте вручную.");
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <p className={styles.label}>Ваш доступ</p>
            <h1 className={styles.title}>Подключение к BazarVPN</h1>
          </div>
          <div className={styles.token}>
            <span className={styles.tokenLabel}>Ссылка</span>
            <code className={styles.tokenValue}>{connectUrl}</code>
            <div className={styles.actions}>
              <button onClick={handleCopy} className={styles.buttonPrimary}>
                Скопировать
              </button>
              <a href={connectUrl} className={styles.buttonGhost} target="_blank" rel="noreferrer">
                Открыть
              </a>
            </div>
          </div>
        </div>

        <div className={styles.tabs}>
          {Object.keys(deviceTitles).map((key) => {
            const device = key as Device;
            return (
              <button
                key={device}
                className={device === activeDevice ? styles.tabActive : styles.tab}
                onClick={() => setActiveDevice(device)}
              >
                {deviceTitles[device]}
              </button>
            );
          })}
        </div>

        <section className={styles.stepsColumn}>
          <div className={styles.stepCard}>
            <p className={styles.subTitle}>Шаг 1. Установите приложение V2rayTun</p>
            <a
              className={styles.buttonPrimary}
              href={downloadLinks[activeDevice]}
              target="_blank"
              rel="noreferrer"
            >
              Скачать для {deviceTitles[activeDevice]}
            </a>
          </div>

          <div className={styles.stepCard}>
            <p className={styles.subTitle}>Шаг 2. Импортируйте ссылку подключения</p>
            <InstructionList device={activeDevice} connectUrl={connectUrl} />
          </div>
        </section>
      </div>
    </main>
  );
}
