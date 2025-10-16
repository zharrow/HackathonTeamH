import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("booking");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <h3 className="text-xl font-semibold mb-3 text-primary">
              {t("selectDate")}
            </h3>
            <p className="text-muted-foreground">{t("selectDateDesc")}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <h3 className="text-xl font-semibold mb-3 text-primary">
              {t("selectTime")}
            </h3>
            <p className="text-muted-foreground">{t("selectTimeDesc")}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <h3 className="text-xl font-semibold mb-3 text-primary">
              {t("confirm")}
            </h3>
            <p className="text-muted-foreground">{t("confirmDesc")}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
