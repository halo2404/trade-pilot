# SECURITY.md – TradePilot Sicherheitsrichtlinien

**Version:** 0.1 (MVP)

---

## Grundsatz

Sicherheit wird nicht nachgelagert ergänzt, sondern von Anfang an eingebaut. Jede Implementierung muss die folgenden Richtlinien beachten.

---

## Authentifizierung

### Passwörter
- Hashing mit **bcrypt** (Kostenfaktor ≥ 12)
- Kein Plaintext-Speichern, keine schwachen Hashes (MD5, SHA-1)
- Passwort-Reset nur über zeitlich begrenzten Token (15 Min.) per E-Mail

### JWT
- Access Token Lebensdauer: **60 Minuten**
- Refresh Token Lebensdauer: **7 Tage** (in HttpOnly-Cookie)
- Signierungsalgorithmus: **HS256** (MVP), später RS256 empfohlen
- Token-Invalidierung bei Logout (Refresh Token in Blocklist / Redis)

### 2FA (optional)
- TOTP (Time-based One-Time Password, RFC 6238)
- QR-Code für Authenticator-Apps
- Backup-Codes bei Einrichtung

---

## Autorisierung

- Rollenbasiertes Zugriffssystem: `free`, `premium`, `admin`
- Rollenprüfung als FastAPI-Dependency (kein manuelles Prüfen in Handlern)
- Admin-Endpunkte immer mit expliziter `admin`-Rollenprüfung absichern

---

## Input-Validierung

- Alle Eingaben mit **Pydantic v2** validieren (Backend)
- Alle Formulardaten im Frontend mit **Zod** validieren (kein blindes Vertrauen)
- Keine direkte Übergabe von User-Input in SQL oder Shell-Befehle
- SQL ausschließlich über ORM (SQLAlchemy) – kein Raw SQL ohne Parameter-Binding

---

## Rate Limiting

| Endpunkt | Limit |
|---|---|
| POST `/auth/login` | 5 Anfragen / Minute / IP |
| POST `/auth/register` | 3 Anfragen / Minute / IP |
| POST `/ai/chat` | 20 Anfragen / Minute / Nutzer |
| Alle anderen | 100 Anfragen / Minute / Nutzer |

Implementierung: Redis-basierter Sliding-Window-Counter.

---

## CORS

- Nur explizit erlaubte Origins (keine `*` in Produktion)
- Credentials (`cookies`, `Authorization`) nur für vertrauenswürdige Origins

---

## CSRF-Schutz

- Stateless JWT-API ist von Natur aus CSRF-geschützt
- Falls Session-Cookies verwendet: CSRF-Token zwingend

---

## XSS-Schutz

- React escapet Ausgaben standardmäßig (kein `dangerouslySetInnerHTML` ohne Review)
- Content Security Policy (CSP) konfigurieren
- `httpOnly`-Cookies für sensible Tokens

---

## Secrets-Management

- Alle Secrets in `.env`-Dateien (niemals in Code oder Git)
- `.env` ist in `.gitignore` aufgeführt
- In CI/CD: GitHub Secrets oder Vault verwenden
- Regelmäßige Rotation von JWT-Secrets und API-Keys

---

## Logging

- **Kein Loggen** von: Passwörtern, Tokens, API-Keys, PII (persönlichen Daten)
- Strukturiertes Logging (JSON-Format)
- Audit-Log für sicherheitsrelevante Aktionen (Login, Passwort-Änderung, Admin-Aktionen)

---

## Abhängigkeiten

- Regelmäßige Updates mit `npm audit` und `pip-audit`
- Dependabot oder Renovate für automatische Security-Updates
- Keine unnötigen Abhängigkeiten

---

## DSGVO-Grundprinzipien

- **Datensparsamkeit:** Nur notwendige Daten speichern
- **Zweckbindung:** Daten nur für den deklarierten Zweck nutzen
- **Auskunftsrecht:** Nutzer kann eigene Daten abfragen (GET `/users/me`)
- **Löschrecht:** Nutzer kann Account und alle Daten löschen
- **Einwilligung:** Bei Datenverarbeitung, die Einwilligung erfordert, klare Abfrage
- **Datenschutzerklärung:** Muss vorhanden und klar verständlich sein

---

## Sicherheitstests

- OWASP Top 10 als Checkliste bei Reviews
- Dependency-Scanning in CI/CD
- Penetrationstests vor Go-Live empfohlen

---

## Incident Response

Bei Sicherheitsvorfällen:
1. Betroffene Tokens sofort invalidieren
2. Betroffene Nutzer benachrichtigen
3. Vorfall dokumentieren
4. Root Cause Analysis durchführen
5. Schutzmaßnahmen implementieren
