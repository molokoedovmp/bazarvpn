import MagicBento from "@/components/MagicBento";
import Spline from "@splinetool/react-spline/next";
import styles from "./page.module.css";

const telegramLink = "https://t.me/aibazarvpn_bot";

const tech = [
  { emoji: "🛰️", title: "Протоколы", text: "WireGuard / IKEv2 — выбираем автоматически под устройство и задачу." },
  { emoji: "🔒", title: "Шифрование", text: "AES-256 и ChaCha20-Poly1305. Сильные ключи, без ослабленных настроек." },
  { emoji: "📵", title: "Анти-лог", text: "Мы не ведём журналы. Бот выдаёт ключи, а трафик остается только у тебя." },
  { emoji: "🌐", title: "Узлы ai-bazar", text: "Собственные сервера с балансировкой нагрузки и мониторингом в реальном времени." },
];

const steps = [
  { label: "1", emoji: "🚀", title: "Нажимаешь кнопку", text: "Переходишь в Telegram-бота без форм и кабинетов." },
  { label: "2", emoji: "📍", title: "Выбираешь локацию", text: "Бот советует лучший узел под скорость или нужный контент." },
  { label: "3", emoji: "🗝️", title: "Получаешь ключ", text: "Конфиг и инструкции прилетают в чат. Поддержка сразу рядом." },
  { label: "4", emoji: "🔗", title: "Подключаешься", text: "Открываешь клиент, вставляешь конфиг — туннель готов." },
];

const serviceCategories = [
  {
    title: "AI и продактивность",
    text: "Доступ к топовым AI-моделям и API без лагов: стабильный пинг для IDE, чат-ботов и пайплайнов.",
    services: [
      { name: "Claude", icon: "/icons/anthropic.svg", color: "#f5f5f5", bg: "#4f46e5" },
      { name: "Gemini", icon: "/icons/googlegemini.svg", color: "#ffffff", bg: "#1a73e8" },
      { name: "OpenAI", icon: "/icons/openai.svg", color: "#ffffff", bg: "#10a37f" },
      { name: "Hugging Face", icon: "/icons/huggingface.svg", color: "#2d2d2d", bg: "#ffcc00" },
      { name: "Notion", icon: "/icons/notion.svg", color: "#ffffff", bg: "#111111" },
      { name: "Lovable", icon: "/icons/lovable.svg", color: "linear-gradient(135deg, #ff7b2f 10%, #ff5da2 50%, #7c7bff 90%)", bg: "#2f2f3c" },
    ],
  },
  {
    title: "Видео и стримы",
    text: "YouTube 4K, VoD и стримы без дерганий. Маршруты под быструю отдачу и низкий пинг.",
    services: [
      { name: "YouTube", icon: "/icons/youtube.svg", color: "#ffffff", bg: "#ff0000" },
      { name: "Twitch", icon: "/icons/twitch.svg", color: "#ffffff", bg: "#9146ff" },
      { name: "Netflix", icon: "/icons/netflix.svg", color: "#ffffff", bg: "#e50914" },
      { name: "Vimeo", icon: "/icons/vimeo.svg", color: "#ffffff", bg: "#1ab7ea" },
      { name: "Prime Video", icon: "/icons/primevideo.svg", color: "#ffffff", bg: "#00a8e1" },
      { name: "Dailymotion", icon: "/icons/dailymotion.svg", color: "#ffffff", bg: "#0066dc" },
    ],
  },
  {
    title: "Соцсети и контент",
    text: "Сообщения, звонки, контент — работают стабильно даже в поездках и при блокировках.",
    services: [
      { name: "Instagram", icon: "/icons/instagram.svg", color: "#ffffff", bg: "linear-gradient(135deg, #fdc468 10%, #e94976 45%, #8a3ab9 90%)" },
      { name: "Discord", icon: "/icons/discord.svg", color: "#ffffff", bg: "#5865f2" },
      { name: "Telegram", icon: "/icons/telegram.svg", color: "#ffffff", bg: "#26a5e4" },
      { name: "WhatsApp", icon: "/icons/whatsapp.svg", color: "#ffffff", bg: "#25d366" },
      { name: "TikTok", icon: "/icons/tiktok.svg", color: "#ffffff", bg: "#000000" },
      { name: "X", icon: "/icons/x.svg", color: "#ffffff", bg: "#0f1419" },
    ],
  },
];

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg
    className={`${styles.telegramIcon} ${className ?? ""}`}
    viewBox="0 0 240 240"
    role="img"
    aria-label="Telegram"
  >
    <circle cx="120" cy="120" r="120" fill="url(#tgGradient)" />
    <path
      fill="#e8f0ff"
      d="M182.9 65.3 53.6 111.9c-4.5 1.7-4.4 8 0.2 9.6l31.5 11.2 12.2 38.7c1.3 4.2 6.6 5.8 9.9 2.9l17.6-15.7c2.8-2.5 7-2.7 10-0.4l31.7 24.4c3.6 2.8 8.8 0.8 9.6-3.7l17.5-108c0.8-5-3.9-9.2-8.9-7.5Z"
    />
    <defs>
      <linearGradient id="tgGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2ac9ff" />
        <stop offset="100%" stopColor="#7b7cf9" />
      </linearGradient>
    </defs>
  </svg>
);

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.heroGlow} />
      <main className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            
            <h1 className={styles.title}>BazarVpn</h1>
            <p className={styles.lede}>
              Простой VPN с премиальной скоростью. Всё в Telegram: получи ключ, выбери локацию, подключись — бот ведёт за
              руку, без кабинетов и лишнего шума.
            </p>
            <p className={styles.heroNote}>до 1 Гбит/с • 0 логов • WireGuard / IKEv2 • 12+ стран</p>
            <div className={styles.ctas}>
              <a className={`${styles.btn} ${styles.primary}`} href={telegramLink} target="_blank" rel="noreferrer">
                <TelegramIcon />
                Перейти в Telegram-бот
              </a>
              <a className={`${styles.btn} ${styles.secondary}`} href="#details">
                Узнать детали
              </a>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <Spline scene="https://prod.spline.design/X7qJTYvJdq84eZWL/scene.splinecode" />
          </div>
        </section>

        <section className={styles.section} id="services">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Сценарии и сервисы</span>
            <h2 className={styles.sectionTitle}>Что покрывает BazarVpn</h2>
            <p className={styles.sectionText}>Категории с реальными сервисами — выбирай свой кейс.</p>
          </div>
          <div className={styles.categoryGrid}>
            {serviceCategories.map((category) => (
              <div key={category.title} className={styles.categoryCard}>
                <div className={styles.categoryHead}>
                  <p className={styles.categoryTitle}>{category.title}</p>
                  <p className={styles.categoryText}>{category.text}</p>
                </div>
                <div className={styles.serviceIconsRow}>
                  {category.services.map((service) => (
                    <div
                      key={service.name}
                      className={styles.serviceSymbol}
                      aria-label={service.name}
                      style={{
                        ["--icon-url" as string]: `url(${service.icon})`,
                        ["--icon-bg" as string]: service.color,
                        ["--tile-bg" as string]: service.bg ?? "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} id="story">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Что такое aibazarvpn и почему он работает</h2>
            <p className={styles.sectionText}>
              Ключевые преимущества на одной сетке: скорость, шифрование, локации и Telegram-управление в премиальном формате.
            </p>
          </div>
          <MagicBento className={styles.bentoShell} />
        </section>

        <div className={styles.splitSections}>
          <section className={styles.section} id="how">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>Как подключиться</span>
              <h2 className={styles.sectionTitle}>Шаги подключения VPN</h2>
              <p className={styles.sectionText}>Бот ведёт тебя и подсвечивает, что делать дальше.</p>
            </div>
            <div className={styles.timeline}>
              {steps.map((step) => (
                <div key={step.label} className={styles.timelineItem}>
                  <div className={styles.timelineBadge}>{step.label}</div>
                  <div>
                    <p className={styles.timelineTitle}>
                      <span className={styles.stepEmoji}>{step.emoji}</span>
                      {step.title}
                    </p>
                    <p className={styles.timelineText}>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section} id="tech">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>Технологии</span>
              <h2 className={styles.sectionTitle}>Прозрачно о безопасности и скорости</h2>
              <p className={styles.sectionText}>Говорим честно, что под капотом, и зачем это тебе.</p>
            </div>
            <div className={styles.techGrid}>
              {tech.map((item) => (
                <div key={item.title} className={styles.techCard}>
                  <p className={styles.techTitle}>
                    <span className={styles.techEmoji}>{item.emoji}</span>
                    {item.title}
                  </p>
                  <p className={styles.techText}>{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className={styles.ctaSection}>
          <div>
            <p className={styles.sectionTag}>Готов к запуску</p>
            <h3 className={styles.ctaTitle}>🚀 Запусти BazarVpn</h3>
            <p className={styles.sectionText}>Открой Telegram-бот — он выдаст ключ, подберёт узел и доведёт до соединения.</p>
          </div>
          <a className={`${styles.btn} ${styles.primary} ${styles.largeBtn}`} href={telegramLink} target="_blank" rel="noreferrer">
            <TelegramIcon />
            Запустить BazarVpn
          </a>
        </section>

        <footer className={styles.footer}>
          <span>BazarVpn • Powered by ai-bazar</span>
          <a className={styles.footerLink} href={telegramLink} target="_blank" rel="noreferrer">
            <TelegramIcon />
            Telegram
          </a>
          <div className={styles.footerLinks}>
            <a href="/terms" className={styles.footerLinkText}>
              Пользовательское соглашение
            </a>
            <a href="/privacy" className={styles.footerLinkText}>
              Политика конфиденциальности
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
