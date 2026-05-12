export const metadata = { title: "Impressum – TradePilot" };

export default function ImpressumPage() {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <h1>Impressum</h1>

      <p className="text-muted-foreground text-sm">
        Angaben gemäß § 5 Telemediengesetz (TMG)
      </p>

      <h2>Betreiber</h2>
      <p>
        <strong>[Name des Betreibers]</strong><br />
        [Straße und Hausnummer]<br />
        [PLZ Ort]<br />
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: <a href="mailto:kontakt@tradepilot.de">kontakt@tradepilot.de</a>
      </p>

      <h2>Haftungsausschluss</h2>

      <h3>Haftung für Inhalte</h3>
      <p>
        Die Inhalte dieser Plattform wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit,
        Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Die
        Inhalte dienen ausschließlich zu Bildungs- und Informationszwecken und stellen keine
        Anlageberatung dar.
      </p>

      <h3>Keine Anlageberatung</h3>
      <p>
        TradePilot ist eine <strong>Bildungsplattform</strong>. Alle dargestellten Informationen,
        Kurse und Simulationen dienen ausschließlich der finanziellen Allgemeinbildung. Sie stellen
        keine Anlage-, Steuer- oder Rechtsberatung dar und sind nicht als Grundlage für
        Anlageentscheidungen geeignet. Für individuelle Anlageberatung wenden Sie sich bitte an einen
        zugelassenen Finanzberater.
      </p>

      <h3>Haftung für Links</h3>
      <p>
        Unsere Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
        Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
        verantwortlich.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem
        deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
        Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des
        jeweiligen Autors.
      </p>

      <p className="text-xs text-muted-foreground mt-8">
        <em>
          Hinweis: Dies ist ein Platzhalter-Impressum für Entwicklungszwecke. Vor dem
          Go-Live muss dieses Impressum durch einen Rechtsanwalt geprüft und mit den
          vollständigen Betreiberdaten vervollständigt werden.
        </em>
      </p>
    </article>
  );
}
