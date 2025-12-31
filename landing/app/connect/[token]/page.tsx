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
  macos: "https://apps.apple.com/app/wireguard/id1451685025",
  windows: "https://download.wireguard.com/windows-client/wireguard-installer.exe",
  ios: "https://apps.apple.com/app/wireguard/id1441195209",
  android: "https://play.google.com/store/apps/details?id=com.wireguard.android",
};

function InstructionList({ device }: { device: Device }) {
  const steps: Record<Device, string[]> = {
    macos: [
      "Скачайте и установите WireGuard.",
      "Откройте приложение и нажмите “Import from file or archive” → “Import from URL”.",
      "Вставьте ссылку подключения и подтвердите импорт.",
      "Активируйте туннель переключателем.",
    ],
    windows: [
      "Скачайте и установите WireGuard.",
      "Запустите приложение и выберите “Import tunnel from URL”.",
      "Вставьте ссылку подключения, сохраните профиль.",
      "Включите туннель (Activate).",
    ],
    ios: [
      "Установите WireGuard из App Store.",
      "В приложении нажмите “Add a tunnel” → “Create from QR code or file” → выберите импорт по URL.",
      "Вставьте ссылку подключения и добавьте профиль.",
      "Включите туннель переключателем.",
    ],
    android: [
      "Установите WireGuard из Google Play.",
      "Откройте приложение и выберите “+” → “Import from URL”.",
      "Вставьте ссылку подключения и сохраните профиль.",
      "Активируйте туннель.",
    ],
  };

  return (
    <ol className={styles.steps}>
      {steps[device].map((step, idx) => (
        <li key={idx}>{step}</li>
      ))}
    </ol>
  );
}

export default function ConnectPage({ params }: { params: { token: string } }) {
  const [activeDevice, setActiveDevice] = useState<Device>("macos");
  const connectUrl = useMemo(() => `https://connect.bazarvpn.ru/${params.token}`, [params.token]);

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

        <div className={styles.content}>
          <div className={styles.download}>
            <p className={styles.subTitle}>Шаг 1. Установите приложение</p>
            <a
              className={styles.buttonPrimary}
              href={downloadLinks[activeDevice]}
              target="_blank"
              rel="noreferrer"
            >
              Скачать {deviceTitles[activeDevice]}
            </a>
          </div>

          <div className={styles.instructions}>
            <p className={styles.subTitle}>Шаг 2. Импортируйте ссылку</p>
            <InstructionList device={activeDevice} />
          </div>
        </div>
      </div>
    </main>
  );
}
