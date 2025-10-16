import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("booking");

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#6c47ff] to-[#00d4ff] bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-[#6c47ff]/50 transition-colors">
            <h3 className="text-xl font-semibold mb-3 text-[#6c47ff]">
              {t("selectDate")}
            </h3>
            <p className="text-gray-400">{t("selectDateDesc")}</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-[#6c47ff]/50 transition-colors">
            <h3 className="text-xl font-semibold mb-3 text-[#6c47ff]">
              {t("selectTime")}
            </h3>
            <p className="text-gray-400">{t("selectTimeDesc")}</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-[#6c47ff]/50 transition-colors">
            <h3 className="text-xl font-semibold mb-3 text-[#6c47ff]">
              {t("confirm")}
            </h3>
            <p className="text-gray-400">{t("confirmDesc")}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
