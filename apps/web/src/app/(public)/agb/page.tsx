export const metadata = { title: "Allgemeine Geschäftsbedingungen – TradePilot" };

export default function AgbPage() {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>

      <p className="text-muted-foreground text-sm">Stand: Mai 2026</p>

      <h2>§ 1 Geltungsbereich</h2>
      <p>
        Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der TradePilot-Plattform
        (nachfolgend „Plattform"), betrieben von [Name des Betreibers] (nachfolgend „Betreiber").
        Mit der Registrierung akzeptieren Sie diese AGB.
      </p>

      <h2>§ 2 Leistungsbeschreibung</h2>
      <p>
        TradePilot ist eine <strong>Bildungs- und Simulationsplattform</strong> für Finanzmärkte.
        Sie bietet:
      </p>
      <ul>
        <li>Interaktive Charts mit technischen Indikatoren (Mock-Daten)</li>
        <li>Paper Trading mit virtuellem Kapital (keine echten Trades)</li>
        <li>Strukturierte Lernmodule zu Börse und Finanzen</li>
        <li>Einen KI-basierten Bildungs-Assistenten</li>
      </ul>
      <p>
        Die Plattform stellt <strong>keine Finanzdienstleistung</strong> im Sinne des KWG oder WpHG
        dar und ist <strong>keine Anlageberatung</strong>.
      </p>

      <h2>§ 3 Registrierung & Nutzerkonto</h2>
      <p>
        Die Nutzung der Plattform setzt eine Registrierung voraus. Sie verpflichten sich, wahre
        Angaben zu machen und Ihre Zugangsdaten sicher zu verwahren. Die Weitergabe von
        Zugangsdaten an Dritte ist untersagt.
      </p>
      <p>
        Der Betreiber behält sich das Recht vor, Konten bei Verstößen gegen diese AGB zu sperren
        oder zu löschen.
      </p>

      <h2>§ 4 Haftungsausschluss für Finanzentscheidungen</h2>
      <p>
        Alle auf der Plattform dargestellten Kurse, Daten und Simulationen sind <strong>keine
        echten Marktdaten</strong> und dienen ausschließlich zu Bildungszwecken. Der Betreiber
        übernimmt keinerlei Haftung für:
      </p>
      <ul>
        <li>Finanzielle Verluste, die aufgrund von auf der Plattform gewonnenen Informationen entstehen</li>
        <li>Die Richtigkeit, Vollständigkeit oder Aktualität dargestellter Daten</li>
        <li>Anlageentscheidungen, die auf Inhalten der Plattform basieren</li>
      </ul>

      <h2>§ 5 KI-Assistent</h2>
      <p>
        Der KI-Assistent dient ausschließlich der Wissensvermittlung. Er gibt keine
        personalisierten Anlageempfehlungen und ist kein Ersatz für professionelle Finanzberatung.
        Antworten des KI-Assistenten können Fehler enthalten. Für Anlageentscheidungen wenden Sie
        sich an einen zugelassenen Finanzberater.
      </p>

      <h2>§ 6 Verfügbarkeit</h2>
      <p>
        Der Betreiber strebt eine hohe Verfügbarkeit der Plattform an, übernimmt jedoch keine
        Garantie für eine unterbrechungsfreie Verfügbarkeit. Wartungsarbeiten werden nach Möglichkeit
        angekündigt.
      </p>

      <h2>§ 7 Nutzungsverbote</h2>
      <p>Es ist untersagt:</p>
      <ul>
        <li>Die Plattform für illegale Zwecke zu nutzen</li>
        <li>Automatisierte Abfragen (Scraping) ohne schriftliche Genehmigung durchzuführen</li>
        <li>Die Sicherheitsmechanismen der Plattform zu umgehen oder zu testen ohne Genehmigung</li>
        <li>Andere Nutzer zu belästigen oder zu schädigen</li>
      </ul>

      <h2>§ 8 Kündigung</h2>
      <p>
        Nutzer können ihr Konto jederzeit löschen. Der Betreiber kann Konten bei Verstößen gegen
        diese AGB ohne Vorankündigung sperren oder löschen.
      </p>

      <h2>§ 9 Änderungen der AGB</h2>
      <p>
        Der Betreiber behält sich vor, diese AGB mit angemessener Vorankündigung zu ändern.
        Über wesentliche Änderungen werden Nutzer per E-Mail informiert.
      </p>

      <h2>§ 10 Anwendbares Recht & Gerichtsstand</h2>
      <p>
        Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand für Streitigkeiten
        mit Kaufleuten ist der Sitz des Betreibers.
      </p>

      <p className="text-xs text-muted-foreground mt-8">
        <em>
          Hinweis: Diese AGB sind ein Entwurf für Entwicklungszwecke und müssen vor dem
          Go-Live durch einen Rechtsanwalt geprüft werden.
        </em>
      </p>
    </article>
  );
}
