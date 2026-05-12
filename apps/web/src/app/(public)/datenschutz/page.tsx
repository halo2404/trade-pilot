export const metadata = { title: "Datenschutzerklärung – TradePilot" };

export default function DatenschutzPage() {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <h1>Datenschutzerklärung</h1>

      <p className="text-muted-foreground text-sm">Stand: Mai 2026</p>

      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlicher im Sinne der DSGVO ist:<br />
        <strong>[Name des Betreibers]</strong>, [Anschrift], kontakt@tradepilot.de
      </p>

      <h2>2. Erhobene Daten</h2>
      <p>Wir erheben und verarbeiten folgende personenbezogene Daten:</p>
      <ul>
        <li><strong>Registrierungsdaten:</strong> E-Mail-Adresse, (optionaler) Name, verschlüsseltes Passwort</li>
        <li><strong>Nutzungsdaten:</strong> Watchlist-Einträge, Paper-Trading-Aktivitäten, Lernfortschritt</li>
        <li><strong>Chat-Daten:</strong> Nachrichten an den KI-Assistenten (gespeichert für die Chat-Verlauf-Funktion)</li>
        <li><strong>Technische Daten:</strong> IP-Adresse (nur für Rate-Limiting, nicht dauerhaft gespeichert), Zeitstempel</li>
      </ul>

      <h2>3. Zweck der Datenverarbeitung</h2>
      <ul>
        <li>Bereitstellung der Plattformfunktionen (Authentifizierung, Personalisierung)</li>
        <li>Lernfortschritts-Tracking und Quiz-Auswertung</li>
        <li>Schutz vor Missbrauch (Rate Limiting, Audit-Logs)</li>
      </ul>

      <h2>4. Rechtsgrundlage</h2>
      <p>
        Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
        für die Bereitstellung der Plattform sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
        Interesse) für die Sicherheitsfunktionen.
      </p>

      <h2>5. Speicherdauer</h2>
      <p>
        Accountdaten werden bis zur Löschung des Nutzerkontos gespeichert. Nach Kontolöschung
        werden personenbezogene Daten innerhalb von 30 Tagen gelöscht, sofern keine gesetzlichen
        Aufbewahrungspflichten bestehen.
      </p>

      <h2>6. Weitergabe an Dritte</h2>
      <p>
        Chat-Nachrichten werden zur Generierung von Antworten an die <strong>Anthropic API</strong>
        (Anthropic, PBC, San Francisco, USA) übermittelt. Anthropic verarbeitet diese Daten gemäß
        ihrer Datenschutzrichtlinie. Eine dauerhafte Speicherung durch Anthropic findet für
        API-Anfragen nicht statt.
      </p>
      <p>
        Ansonsten werden Daten nicht an Dritte weitergegeben, es sei denn, wir sind dazu gesetzlich
        verpflichtet.
      </p>

      <h2>7. Cookies & Lokaler Speicher</h2>
      <p>
        Wir setzen technisch notwendige Cookies für die Authentifizierung (JWT-Token) ein.
        Es werden keine Tracking- oder Werbe-Cookies verwendet.
      </p>

      <h2>8. Ihre Rechte</h2>
      <p>Sie haben folgende Rechte nach DSGVO:</p>
      <ul>
        <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
        <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
        <li>Recht auf Löschung (Art. 17 DSGVO) – über Account-Löschfunktion</li>
        <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
      </ul>
      <p>
        Zur Ausübung Ihrer Rechte wenden Sie sich an: kontakt@tradepilot.de
      </p>

      <h2>9. Beschwerderecht</h2>
      <p>
        Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
        Zuständig ist die Aufsichtsbehörde Ihres Bundeslandes.
      </p>

      <p className="text-xs text-muted-foreground mt-8">
        <em>
          Hinweis: Diese Datenschutzerklärung ist ein Entwurf für Entwicklungszwecke und muss
          vor dem Go-Live durch einen auf Datenschutzrecht spezialisierten Anwalt geprüft werden.
        </em>
      </p>
    </article>
  );
}
