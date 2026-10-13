# INNERA – Vollständiger Produkt-, UX- und UI-Redesign-Auftrag

## 1. Deine Rolle und dein Auftrag

Du bist ein Senior Product Designer, UX/UI Designer, Frontend Engineer und Design-System-Architekt mit Erfahrung in hochwertigen Mental-Wellbeing-Apps, Conversational AI, Mobile-First-Produkten und emotionalem UX-Design.

Ich entwickle eine AI-gestützte Mental-Wellbeing- und Gesprächs-App namens **INNERA – Dein Weg zu dir**.

Ich habe bereits einen Prototypen erstellt. Deine Aufgabe ist es, das bestehende Projekt zu analysieren und daraus eine visuell hochwertige, konsistente, moderne und vollständig durchklickbare Anwendung zu entwickeln.

Das angehängte Referenzbild dient als visuelle Leitlinie. Orientiere dich an dessen warmer, freundlicher, heller und hochwertiger Ästhetik. Kopiere es nicht blind, sondern entwickle daraus ein eigenes, professionelles Designsystem.

**Wichtig:**
- Arbeite direkt im bestehenden Projekt.
- Analysiere zuerst die Projektstruktur, das Framework, die installierten Packages, vorhandene Seiten und bestehende Funktionen.
- Bewahre funktionierende Features und integriere sie in das neue Design.
- Erstelle keine separate Demo neben der eigentlichen Anwendung.
- Ersetze keine funktionierenden Features durch statische Screenshots.
- Baue keine reine Landingpage. Es soll sich um eine interaktive App mit mehreren miteinander verbundenen Bereichen handeln.
- Alle Navigationselemente, Buttons, Karten, Formulare, Diagramme und Chat-Interaktionen müssen sinnvoll funktionieren.
- Nutze die vorhandene technische Architektur, sofern sie sinnvoll ist. Installiere keine zusätzlichen Libraries ohne Notwendigkeit.
- Wenn Backend-Funktionen fehlen, entwickle eine klar gekennzeichnete, funktionsfähige lokale Demo-Implementierung mit realistischer Beispiel-Datenstruktur.
- Arbeite eigenständig mit sinnvollen Designentscheidungen, statt bei jedem Detail nachzufragen.

## 2. Produktvision

INNERA soll ein digitaler Wohlfühlort sein.

Die App unterstützt Menschen dabei, ihre Gefühle besser zu verstehen, Gedanken zu sortieren, persönliche Muster zu erkennen, Ziele zu verfolgen und durch regelmäßige Gespräche mehr Selbstverständnis zu entwickeln.

Die Nutzer sollen sich nicht fühlen, als würden sie eine medizinische Software oder ein klassisches Produktivitäts-Dashboard verwenden.

Sie sollen das Gefühl haben:

- Ich kann hier kurz durchatmen.
- Ich darf ehrlich sein, ohne bewertet zu werden.
- Ich muss nichts leisten und nichts beweisen.
- Ich werde freundlich durch meine Reflexion begleitet.
- Ich kann meine persönliche Entwicklung nachvollziehen.
- Ich kann in meinem eigenen Tempo wachsen.

Die Marke soll warm, empathisch, ruhig, vertrauenswürdig und modern wirken.

Die Anwendung darf hochwertig und emotional gestaltet sein, aber nicht kindlich, kitschig, esoterisch oder übertrieben verspielt.

Das visuelle Erlebnis soll die Qualität einer modernen Premium-Wellbeing-App besitzen.

## 3. Visuelle Designrichtung

### Grundästhetik

Verwende eine Kombination aus:

- Soft Minimalism
- Warm Editorial Design
- Organic Shapes
- Premium Wellness UI
- Subtilen 3D-Illustrationen
- Sanften Farbverläufen
- Botanischen Elementen
- Großzügigem Whitespace
- Weichen Schatten und abgerundeten Karten

Die Benutzeroberfläche soll hell, ruhig und luftig wirken.

Vermeide:
- Reines Weiß als dominante Fläche
- Reines Schwarz für sämtliche Texte
- Kalte, sterile Grautöne
- Stark gesättigte Neonfarben
- Harte Kontraste und aggressive Akzentfarben
- Überall gleichförmig graue Karten
- Übertriebene Glassmorphism-Effekte
- Dicke Rahmen um sämtliche Elemente
- Zu viele Icons und Dekorationen
- Generische SaaS-Dashboard-Layouts
- Emoji als Ersatz für hochwertige Icons oder Illustrationen

Das Design soll durch Farbe, Typografie, Komposition und Illustrationen hochwertig wirken, nicht durch unnötige Dekoration.

## 4. Verbindliche Farbpalette

Definiere die Farben als zentrale Design-Tokens, beispielsweise über CSS Custom Properties oder das bereits verwendete Theme-System.

Verwende folgende Ausgangspalette:

### Basisfarben

- Background Primary: `#FAF8F3`
- Background Secondary: `#F4F1E9`
- Surface Primary: `#FFFDF9`
- Surface Elevated: `#FFFFFF`
- Border Subtle: `#E9E5DC`

### Markenfarben

- Primary Forest: `#315C50`
- Primary Sage: `#769782`
- Light Sage: `#E7EFE5`
- Pale Sage: `#F0F5ED`
- Deep Teal: `#244A48`

### Ergänzende Pastellfarben

- Warm Sand: `#F5EBDD`
- Soft Apricot: `#F5E2D0`
- Pale Rose: `#F7E9E7`
- Muted Rose: `#D9878C`
- Soft Lavender: `#EEE8F5`
- Muted Lavender: `#9583B6`
- Pale Sky: `#E6F1F1`
- Soft Teal: `#75B7B9`
- Warm Sun: `#E8B74F`

### Textfarben

- Text Primary: `#243A35`
- Text Secondary: `#687B72`
- Text Muted: `#89948B`
- Text On Primary: `#FFFFFF`

### Semantische Farben

- Success: `#4E8065`
- Warning: `#C79B49`
- Error: `#C66F75`
- Info: `#5E9DA2`

### Regeln für die Farbverwendung

Der Großteil der App besteht aus warmen, hellen Hintergründen.

Grün ist die verbindende Markenfarbe und steht für Ruhe, Wachstum und Orientierung.

Sand und Apricot schaffen Wärme. Rosé und Lavendel bringen subtile Abwechslung. Türkis kann für körperliches Wohlbefinden und bestimmte Datenvisualisierungen eingesetzt werden.

Jeder Bereich darf eine eigene sanfte Akzentfarbe besitzen. Die Farben müssen jedoch aus demselben visuellen System stammen.

Verwende Pastellfarben vorwiegend als Hintergrundtönungen, nicht für kleine Texte mit unzureichendem Kontrast.

Texte, Icons und interaktive Elemente müssen gut lesbar bleiben. Beachte WCAG-AA-Kontrastanforderungen, soweit gestalterisch und technisch möglich.

Keine zufällig ausgewählten Farben pro Komponente. Verwende konsequent die definierten Tokens.

## 5. Typografie und Layout

Nutze eine hochwertige, freundliche und moderne Sans-Serif-Schrift.

Bevorzugte Schriftfamilie: Inter, falls bereits verfügbar, oder eine ähnlich gut lesbare Schrift wie Manrope. Verwende vorhandene Schriftressourcen bevorzugt und lade keine unnötigen externen Ressourcen.

Die Typografie soll ruhig, klar und persönlich sein.

Empfohlene Größen:

- Große Begrüßung: 28–34 px
- Seitentitel: 26–30 px
- Abschnittsüberschrift: 20–24 px
- Kartentitel: 16–18 px
- Fließtext: 15–17 px
- Zusatzinformationen: 12–14 px
- Buttons: 14–16 px

Nutze ein konsistentes Spacing-System in 4-Pixel-Schritten.

Empfehlungen:
- Kleine Abstände: 4–8 px
- Elementabstände: 12–16 px
- Kartenabstände: 16–20 px
- Abschnittsabstände: 24–32 px
- Große visuelle Abstände: 36–48 px

Karten erhalten meist 20–28 px Radius. Buttons und Chips erhalten abhängig von ihrer Funktion einen kleineren Radius oder eine Pill-Form.

Schatten sind sehr weich, diffus und dezent. Nutze Schatten nur, wenn sie Hierarchie oder Tiefe vermitteln.

Die Oberfläche muss auf kleinen Smartphones, großen Smartphones, Tablets und Desktop-Bildschirmen sauber funktionieren.

Auf dem Smartphone soll die App wie eine hochwertige native Anwendung wirken. Auf Desktop soll der Inhalt sinnvoll begrenzt und nicht über die gesamte Bildschirmbreite gestreckt werden.

## 6. Avatar und visuelle Identität

Der Avatar ist ein zentrales Markenelement von INNERA.

Er soll emotional ansprechend, hochwertig und wiedererkennbar sein.

### Gewünschter Stil

- Hochwertiger stilisierter 3D-Animationsfilm-Look
- Freundliche, natürliche Gesichtszüge
- Ausdrucksstarke, warme Augen
- Dezente Sommersprossen
- Natürliches rotbraunes bis kastanienbraunes Haar
- Lockerer, leicht unordentlicher Dutt mit einzelnen Haarsträhnen
- Warmer rostorangefarbener oder terrakottafarbener Strickpullover
- Weiches, natürliches Licht
- Sanfte Schatten
- Warme, natürliche Hauttöne
- Ruhiger, sympathischer Gesichtsausdruck
- Leichtes, authentisches Lächeln
- Hochwertige Material- und Haartexturen

Die Figur soll erwachsen und empathisch wirken, nicht wie ein Kind und nicht wie eine überzeichnete Comicfigur.

Die visuelle Inspiration ist eine hochwertige, warme 3D-Figur aus einem modernen Animationsfilm. Die Figur soll eigenständig gestaltet werden und keine bekannte Filmfigur imitieren.

### Einsatz des Avatars

Verwende den Avatar gezielt:
1. Auf der Startseite als großes Hero-Element.
2. Im Gesprächsraum als zentrale Begleitfigur.
3. In Begrüßungs- und Abschlussmomenten in kleineren Varianten.
4. Optional in leeren Zuständen, Onboarding und persönlichen Meilensteinen.

Auf der Startseite soll der Avatar prominent auf der rechten Seite oder im oberen visuellen Bereich erscheinen. Links beziehungsweise darunter stehen Begrüßung und die wichtigste Aktion.

Der Avatar darf nicht beliebig neben Text platziert werden. Er muss Teil der Komposition sein.

Verwende dieselbe Figur in unterschiedlichen Situationen und mit konsistentem Aussehen. Vermeide bei jedem Screen einen anderen Avatarstil.

Wenn geeignete lokale Bildassets existieren, prüfe, ob diese weiterverwendet werden können. Andernfalls lege eine klare Asset-Struktur für Avatarbilder an. Verwende für die lokale Demo hochwertige Platzhalterbilder nur vorübergehend und kennzeichne sie im Code.

Verlasse dich nicht auf zufällige externe Bild-URLs, die später verschwinden können.

## 7. Globale Navigation

Die App besitzt fünf Hauptbereiche:

1. Start
2. Gespräch
3. Ziele
4. Einblicke
5. Tagebuch

Auf mobilen Geräten soll eine elegante Bottom Navigation verwendet werden.

Eigenschaften:
- Fixiert oder sticky am unteren Rand
- Heller, warmer Hintergrund
- Sanfter oberer Schatten oder dezente Abgrenzung
- Icons mit konsistenter Strichstärke
- Aktiver Tab mit einer hellgrünen, abgerundeten Fläche
- Aktiver Text in Forest Green
- Inaktive Elemente in gedämpftem Grün-Grau
- Berücksichtigung der Safe Areas auf iOS
- Ausreichend große Touch-Flächen
- Kein Überdecken wichtiger Inhalte

Die Navigation muss tatsächlich zwischen den fünf Bereichen wechseln.

Der aktive Zustand muss immer korrekt dargestellt werden. Die Navigation darf nicht nur optisch funktionieren.

Verwende das Routing-System des bestehenden Projekts, sofern vorhanden. Bei einem Single-Page-Prototyp ohne Routing soll eine klare, wartbare Navigationslösung implementiert werden.

Direkte URLs, Browser-Zurück und Browser-Vorwärts sollen sinnvoll funktionieren, soweit die Architektur dies unterstützt.

## 8. Startseite

Die Startseite ist der persönliche Einstiegspunkt und soll das visuelle Herzstück der App sein.

### A. Header

Zeige:
- INNERA-Logo beziehungsweise eine hochwertige botanische Wortmarke
- Claim: „DEIN WEG ZU DIR“
- Profil-Button
- Optional Datum und persönliche Begrüßung

Der Header soll leicht und unaufdringlich sein.

### B. Begrüßungsbereich

Beispiel:

„Schön, dass du da bist. ♡“

„Heute ist ein guter Tag, um ein bisschen mehr auf dich zu hören.“

Die Begrüßung soll sich persönlich anfühlen. Verwende keine künstlich übertriebene Positivität.

Platziere den Avatar in diesem Bereich.

Hinter dem Avatar kann ein sehr sanfter, unscharfer Naturhintergrund mit hellem Tageslicht verwendet werden.

Der Hintergrund soll weich auslaufen und in die restliche Oberfläche übergehen. Vermeide einen harten Bildrahmen.

### C. Hauptaktion

Ein prominenter, eleganter Button:

„Ein Moment für dich“

Mit einem dezenten Sonnen- oder Atem-Icon.

Bei Klick öffnet sich eine kurze, interaktive Achtsamkeitsübung oder ein geführter Einstieg in den Gesprächsraum.

### D. Bereich „Deine Entwicklung“

Überschrift:

„Deine Entwicklung“

Untertitel:

„6 Bereiche. Ein ganzheitliches Bild.“

Zeige sechs Insight-Karten:

1. Stimmung
2. Mentale Klarheit
3. Energie
4. Zuversicht
5. Körperliches Wohlbefinden
6. Innere Ruhe

Jede Karte enthält:
- Eigenes, dezentes Icon
- Titel
- Kurze Statusbeschreibung
- Veränderung gegenüber einem definierten Vergleichszeitpunkt, sofern Daten existieren
- Kleine, elegante Verlaufskurve
- Dezente, farblich abgestimmte Hintergrundtönung
- Interaktiven Chevron oder klaren Klickbereich

Die sechs Karten verwenden unterschiedliche, harmonierende Pastellakzente.

Die Verlaufskurven sollen wie feine, organische Linien wirken. Verwende keine schweren Achsen, unnötigen Gitternetze oder überladenen Legenden.

Nutze für die Charts eine geeignete vorhandene Chart-Library oder SVG. Die Darstellung muss responsiv sein.

Wichtig: Wenn noch keine realen Nutzerdaten vorliegen, kennzeichne Beispielwerte als Demo-Daten. Erfinde keine tatsächlichen persönlichen Fortschritte.

Ein Klick auf eine Karte öffnet die Detailansicht des jeweiligen Bereichs.

### E. Täglicher Check-in

Überschrift:

„Wie fühlst du dich heute?“

Untertitel:

„Dein Check-in – ganz ohne Bewertung.“

Zeige fünf auswählbare Zustände:

- Sehr gut
- Gut
- Okay
- Schwierig
- Schwer

Nutze freundliche, minimalistische Gesichtssymbole und subtile Pastellflächen.

Beim Auswählen:
- Wird der gewählte Zustand klar markiert.
- Wird die Auswahl im lokalen Zustand gespeichert.
- Wird eine kurze, wertschätzende Rückmeldung angezeigt.
- Wird der Check-in mit Datum im lokalen Datenmodell gespeichert.
- Kann die Auswahl geändert werden, bevor sie bestätigt wird.

Keine beschämende Sprache, keine negativen Bewertungen und kein künstlich übertriebenes Lob.

### F. Nächster Schritt

Eine ruhige Karte mit botanischem Icon.

Überschrift:

„Dein nächster Schritt“

Text:

„Nimm dir 10 Minuten Zeit nur für dich.“

Zeige eine kleine Fortschrittsanzeige für eine passende Übung oder Wochenaufgabe.

Der Button „Diese Woche“ öffnet eine funktionierende Wochenübersicht mit konkreten, anklickbaren Übungen.

### G. Reflexionsfrage

Eine warme Sand- oder Apricot-Karte mit feiner botanischer Illustration.

Überschrift:

„Eine Frage zum Nachdenken“

Beispielfrage:

„Was würde ich heute tun, wenn ich mir selbst ein bisschen mehr vertrauen würde?“

Beim Klick öffnet sich eine Reflexionsansicht. Die Nutzer können ihre Gedanken aufschreiben und als Tagebucheintrag speichern.

Die Frage kann sich mit dem Tag ändern. Nutze für die Demo einen lokalen Fragenkatalog.

## 9. Gesprächsraum – wichtigster Bereich der App

Der Gesprächsraum ist das emotionale Herzstück von INNERA.

Er soll nicht wie ein gewöhnlicher Chat mit einem technischen Bot aussehen.

Er soll sich wie ein ruhiger, geschützter Raum anfühlen, in dem Nutzer ihre Gedanken frei formulieren können.

### Visuelle Gestaltung

Verwende:
- Warmes Cremeweiß als Grundfläche
- Sehr dezente Salbei- und Sandtöne
- Eine ruhige, großzügige Anordnung
- Den konsistenten INNERA-Avatar
- Weiche, abgerundete Chatflächen
- Dezente Animationen
- Viel Luft zwischen den Elementen
- Keine aggressiven Kontraste
- Keine unnötigen Bedienelemente

Der Gesprächsraum darf eine etwas reduzierte Oberfläche haben, damit der Fokus auf dem Gespräch liegt.

### Einstieg in ein Gespräch

Begrüßung:

„Ich bin da. Was beschäftigt dich gerade?“

Alternativ:

„Du musst noch keine Worte dafür haben. Wir können gemeinsam sortieren, was gerade in dir vorgeht.“

Zeige optionale Gesprächsimpulse:
- „Ich möchte etwas loswerden.“
- „Ich fühle mich gerade überfordert.“
- „Ich möchte mich selbst besser verstehen.“
- „Ich brauche einen Moment Ruhe.“
- „Ich weiß nicht genau, was ich fühle.“

Diese Vorschläge sind anklickbar und übernehmen den jeweiligen Text in den Chat beziehungsweise starten den passenden Gesprächsmodus.

### Chat-Funktionalität

Implementiere:
- Texteingabe
- Absenden mit Button und Enter-Taste
- Mehrzeilige Eingabe
- Automatisches Scrollen zum neuesten Beitrag
- Ladezustand beim Antworten
- Zeitstempel, falls sinnvoll
- Lesbare Nachrichtenabstände
- Unterschiedliche, aber harmonierende Nachrichtendarstellung für Nutzer und KI
- Gesprächsverlauf innerhalb der Demo-Sitzung
- Möglichkeit, ein neues Gespräch zu starten
- Möglichkeit, zur Startseite zurückzukehren
- Sinnvolle Leer-, Lade- und Fehlerzustände

Die Nutzer-Nachrichten dürfen einen leicht getönten Salbei-Hintergrund erhalten. Die Antworten der AI können auf einer hellen, warmweißen Fläche stehen.

Die Nachrichten sollen nicht wie harte, stark kontrastierende Messenger-Blasen aussehen.

### Gesprächsverhalten

Die AI soll empathisch, reflektierend und nicht wertend kommunizieren.

Sie soll:
- Aktiv zuhören
- Gefühle vorsichtig spiegeln
- Offene Fragen stellen
- Bei Bedarf zusammenfassen
- Kleine, machbare nächste Schritte vorschlagen
- Den Nutzern Wahlfreiheit lassen
- Nicht jede Nachricht mit einer Frage beenden
- Keine Diagnose stellen
- Keine unbegründeten Behauptungen über die psychische Verfassung einer Person machen
- Nicht so tun, als sei sie ein menschlicher Therapeut

Beispiel:

Nutzer: „Ich fühle mich in letzter Zeit von allem überfordert.“

INNERA: „Das klingt, als wäre gerade vieles gleichzeitig da und als würdest du kaum Raum zum Durchatmen finden. Was davon fühlt sich im Moment am schwersten an?“

Die Antwort soll zum tatsächlichen Inhalt des Gesprächs passen und nicht wie eine austauschbare Standardantwort wirken.

### Technische Umsetzung des Chats

Prüfe zuerst, ob bereits eine AI-API oder ein Backend vorhanden ist.

Falls eine Integration vorhanden ist:
- Verwende sie weiter.
- Behandle Ladezeiten und Fehler sauber.
- Halte API-Schlüssel ausschließlich serverseitig.

Falls keine Integration vorhanden ist:
- Implementiere eine funktionierende Demo-Konversationslogik mit mehreren Antwortmustern und Gesprächskontext.
- Kennzeichne den Modus intern und für Entwickler nachvollziehbar als Demo.
- Verwende keine zufälligen, unpassenden Antworten.
- Baue eine saubere Schnittstelle, über die später ein echtes AI-Modell integriert werden kann.

Behaupte niemals, dass eine echte AI-Verbindung besteht, wenn nur lokale Demo-Antworten verwendet werden.

### Gesprächszusammenfassung

Am Ende einer Sitzung kann der Nutzer freiwillig eine Zusammenfassung öffnen.

Diese enthält:
- Was mich gerade beschäftigt
- Welche Gefühle ich wahrgenommen habe
- Welche Gedanken mir wichtig waren
- Was ich aus dem Gespräch mitnehme
- Ein möglicher kleiner nächster Schritt

Der Nutzer kann die Zusammenfassung bearbeiten, speichern oder verwerfen.

Speichere sensible Gesprächsinhalte nicht stillschweigend dauerhaft.

## 10. Ziele

Die Ziele-Seite soll persönliche Entwicklung unterstützen, ohne Leistungsdruck aufzubauen.

### Aufbau

Seitentitel:

„Dein Weg“

Untertitel:

„Kleine Schritte zählen.“

Zeige:
- Aktuelle persönliche Ziele
- Wochenziele
- Fortschritt
- Abgeschlossene Übungen
- Kleine Meilensteine
- Möglichkeit, ein neues Ziel anzulegen

### Ziel erstellen

Der Nutzer kann:
- Einen Titel eingeben
- Eine optionale Beschreibung ergänzen
- Einen Bereich auswählen
- Eine Frequenz wählen
- Ein Startdatum beziehungsweise einen Zeitraum festlegen
- Das Ziel speichern
- Das Ziel bearbeiten
- Das Ziel pausieren
- Das Ziel abschließen
- Das Ziel löschen

Beispiele:
- Jeden Abend drei Gedanken notieren
- Zweimal pro Woche bewusst durchatmen
- Eigene Bedürfnisse früher wahrnehmen
- Einmal pro Woche Zeit nur für mich nehmen

Zeige den Fortschritt mit dezenten Fortschrittsanzeigen.

Verwende keine aggressiven Streaks, Bestrafungen oder roten Warnanzeigen bei verpassten Zielen.

Fortschritt soll ermutigen, nicht unter Druck setzen.

## 11. Einblicke

Diese Seite zeigt die persönliche Entwicklung über einen längeren Zeitraum.

Seitentitel:

„Deine Einblicke“

Untertitel:

„Beobachte, was sich mit der Zeit verändert.“

### Inhalt

Zeige:
- Stimmung im Zeitverlauf
- Mentale Klarheit
- Energie
- Zuversicht
- Körperliches Wohlbefinden
- Innere Ruhe
- Check-in-Häufigkeit
- Wiederkehrende Reflexionsthemen, sofern nachvollziehbar erhoben

Biete sinnvolle Zeitfilter:
- 7 Tage
- 30 Tage
- 90 Tage

Die Filter müssen die Diagramme und angezeigten Daten tatsächlich verändern.

Verwende:
- Sanfte Liniencharts
- Dezente Flächenverläufe
- Kleine Kennzahlen
- Klare Beschriftungen
- Gut lesbare Tooltips
- Einen ruhigen Informationsfluss

Keine überladenen Analytics-Dashboards.

Jede Kennzahl soll verständlich erklärt werden. Eine Veränderung ist keine Diagnose und nicht automatisch eine Verbesserung.

Wenn genügend Daten vorhanden sind, können vorsichtige Beobachtungen angezeigt werden.

Beispiel:

„An den Tagen, an denen du einen Check-in gemacht hast, hast du dir bewusst Zeit für dich genommen.“

Solche Aussagen müssen auf tatsächlich vorhandenen Daten beruhen.

Zeige bei fehlenden Daten einen schönen Empty State mit der Möglichkeit, einen ersten Check-in durchzuführen.

Keine erfundenen Trends oder vermeintlich wissenschaftlichen Scores.

## 12. Tagebuch

Das Tagebuch ist ein privater Raum für Gedanken und Reflexionen.

Seitentitel:

„Dein Tagebuch“

Untertitel:

„Ein Ort nur für deine Gedanken.“

### Funktionen

- Neuen Eintrag erstellen
- Text bearbeiten
- Eintrag speichern
- Eintrag löschen
- Einträge nach Datum sortieren
- Einträge durchsuchen
- Optionale Tags vergeben
- Reflexionsfragen als Schreibimpulse nutzen
- Einträge aus dem Gesprächsraum freiwillig übernehmen
- Vorhandene Einträge öffnen und bearbeiten

Gestalte die Eintragskarten wie ruhige, hochwertige Papierflächen.

Verwende großzügige Zeilenabstände und gut lesbare Schrift.

### Datenschutz

Im Demo-Modus können Einträge lokal gespeichert werden.

Zeige transparent, wo die Daten gespeichert werden.

Bei einer späteren produktiven Implementierung müssen Authentifizierung, Zugriffsschutz, sichere Speicherung und Löschmöglichkeiten vorgesehen werden.

Versprich keine Ende-zu-Ende-Verschlüsselung oder vollständige Vertraulichkeit, solange diese technisch nicht umgesetzt und geprüft ist.

## 13. Profil und Einstellungen

Der Profilbereich muss erreichbar sein.

Enthalten sein sollen:
- Persönliche Begrüßung beziehungsweise Profilname
- Präferenzen
- Benachrichtigungseinstellungen
- Datenschutzinformationen
- Möglichkeit, Demo-Daten zurückzusetzen
- Informationen zur verwendeten AI
- Hilfe und Support
- Informationen zu Grenzen des Angebots

Implementiere nur Einstellungen, deren Verhalten tatsächlich funktioniert.

## 14. Achtsamkeitsübungen

Die Hauptaktion „Ein Moment für dich“ öffnet eine kleine Übungsbibliothek oder startet eine passende Übung.

Implementiere mindestens drei funktionsfähige Übungen:

1. Bewusstes Atmen
2. Kurzer Body-Check-in
3. Gedanken sortieren

### Bewusstes Atmen

Zeige eine ruhige Animation, die beim Einatmen größer und beim Ausatmen kleiner wird.

Biete:
- Start
- Pause
- Fortsetzen
- Beenden

Verwende keine starren oder medizinisch wirkenden Anweisungen. Die Nutzer sollen die Übung jederzeit abbrechen können.

### Body-Check-in

Führe mit kurzen, optionalen Fragen durch eine Wahrnehmung des Körpers.

### Gedanken sortieren

Biete drei optionale Felder:
- Was beschäftigt mich?
- Was kann ich beeinflussen?
- Was brauche ich gerade?

Die Ergebnisse können auf Wunsch im Tagebuch gespeichert werden.

## 15. Interaktionsprinzipien

Jedes Element, das interaktiv aussieht, muss eine nachvollziehbare Funktion besitzen.

Prüfe insbesondere:
- Hauptnavigation
- Profil-Button
- „Ein Moment für dich“
- Alle sechs Insight-Karten
- „Details“
- Stimmungsauswahl
- Wochenziele
- Reflexionsfrage
- Chat-Impulse
- Chat-Eingabe
- Gesprächszusammenfassung
- Zielerstellung
- Zeitfilter in Insights
- Tagebucheinträge
- Speichern, Bearbeiten und Löschen
- Einstellungen
- Dialoge und Modals

Verwende bei Interaktionen angemessene Zustände:
- Default
- Hover, sofern passend
- Focus
- Active
- Selected
- Loading
- Success
- Error
- Disabled

Alle interaktiven Elemente müssen mit Tastatur bedienbar sein und sichtbare Fokuszustände besitzen.

Verwende semantische Buttons, Links und Formulare.

Keine leeren Links, keine Buttons ohne Funktion und keine Klickflächen, die nur einen Hover-Effekt besitzen.

## 16. Animationen und Microinteractions

Animationen sollen subtil, hochwertig und funktional sein.

Beispiele:
- Sanftes Einblenden beim Seitenwechsel
- Kleine Bewegung beim Auswählen eines Check-ins
- Dezente Skalierung beim Drücken eines Buttons
- Sanftes Zeichnen von Chart-Linien
- Ruhige Atemanimation
- Kurze Übergänge beim Öffnen von Karten
- Dezente Bestätigung nach dem Speichern

Bevorzugte Animationsdauer: ungefähr 150–300 ms für normale Interaktionen.

Vermeide:
- Dauerhafte, unruhige Animationen
- Übermäßiges Springen
- Aufdringliche Partikel
- Lange Ladeanimationen
- Animationen, die die Bedienbarkeit beeinträchtigen

Berücksichtige `prefers-reduced-motion`.

## 17. Technische Architektur und Datenmodell

Analysiere das vorhandene Projekt, bevor du Architekturentscheidungen triffst.

Erhalte bestehende technische Konventionen und verwende die vorhandenen Libraries, wenn sie geeignet sind.

Strukturiere den Code sinnvoll nach Bereichen, Komponenten, Hooks, Services und Datenmodellen.

Vermeide eine einzige übergroße React-Komponente für die gesamte App.

Ein möglicher Aufbau, angepasst an das bestehende Projekt:

- `app/` oder bestehende Routing-Struktur
- `components/layout/`
- `components/ui/`
- `components/avatar/`
- `components/chat/`
- `components/insights/`
- `components/check-in/`
- `components/journal/`
- `components/goals/`
- `features/`
- `hooks/`
- `services/`
- `data/`
- `styles/`

Erzeuge keine redundanten Ordner, wenn das Framework bereits eine passende Struktur vorgibt.

Definiere wiederverwendbare Komponenten für:
- Buttons
- Karten
- Navigation
- Modals
- Formularfelder
- Auswahl-Chips
- Empty States
- Insight-Karten
- Diagramme
- Chat-Nachrichten
- Fortschrittsanzeigen

Verwende zentrale Design-Tokens.

### Persistenz

Für einen lokalen Prototyp:
- Verwende einen geeigneten lokalen Speicher für nicht sensible Demo-Daten.
- Halte Datenzugriffe in einem Service oder Repository gekapselt.
- Implementiere ein klares Datenmodell.
- Behandle fehlende, ungültige oder ältere Daten sicher.
- Stelle sicher, dass ein Reload nicht unerwartet alle Demo-Fortschritte löscht.

Sensible Gesprächs- und Tagebuchdaten sollen nicht unbedacht in Browser-Logs, URLs oder Analyseereignissen landen.

Verwende für sensible echte Nutzerdaten keine ungeschützte lokale Demo-Speicherung als vermeintliche Produktionslösung.

### Datenmodelle

Definiere mindestens geeignete Strukturen für:

- UserPreferences
- MoodCheckIn
- InsightMetric
- Goal
- JournalEntry
- Conversation
- ConversationMessage
- ExerciseSession

Verwende eindeutige IDs, nachvollziehbare Zeitstempel und klare Beziehungen zwischen den Daten.

## 18. Psychologische Sicherheit und verantwortungsvolle AI

INNERA ist eine AI-gestützte Wellbeing-Anwendung und kein Ersatz für eine professionelle Psychotherapie oder medizinische Versorgung.

Die Benutzeroberfläche soll Sicherheit und Vertrauen vermitteln, aber keine unbelegten Versprechen machen.

Vermeide Formulierungen wie:
- „Ich heile dich.“
- „Ich weiß genau, was du fühlst.“
- „Du brauchst keinen Therapeuten mehr.“
- „Diese Analyse zeigt dir, was psychisch mit dir nicht stimmt.“

Verwende stattdessen respektvolle, offene Formulierungen.

Nutzer sollen:
- Gespräche beenden können
- Fragen überspringen können
- Inhalte korrigieren können
- Zusammenfassungen ablehnen können
- Daten löschen können
- Grenzen des Systems verstehen können

Implementiere für eine echte AI-Integration geeignete Sicherheitsmechanismen für Krisensituationen. Bei akuten Selbstgefährdungshinweisen darf die Anwendung nicht einfach mit allgemeinen Wohlfühltexten weitermachen. Sie soll ruhig zu unmittelbarer menschlicher Hilfe und passenden Krisenangeboten führen.

Für die österreichische Zielgruppe können beispielsweise österreichische Hilfsangebote vorgesehen werden. Verifiziere deren aktuelle Kontaktdaten vor einer produktiven Veröffentlichung.

## 19. Responsive Design

### Mobile

- Mobile First
- Keine horizontalen Überläufe
- Gut erreichbare Buttons
- Optimierte Bottom Navigation
- Angemessene Safe Areas
- Auf kleinen Displays lesbare Diagramme
- Chat-Eingabe bleibt bei geöffneter Tastatur nutzbar
- Sinnvolle Kartenreihenfolge
- Touch-Flächen möglichst mindestens 44 × 44 CSS-Pixel

### Tablet

- Mehr Platz für Karten und Diagramme
- Ausgewogene Zweispaltenlayouts
- Keine unnötig großen Leerflächen

### Desktop

- Sinnvolle maximale Inhaltsbreite
- Optional eine dezente Seitenleiste
- Insight-Karten in einem harmonischen Grid
- Gesprächsraum mit begrenzter Lesebreite
- Kein unkontrolliertes Strecken der Chat-Nachrichten
- Gute visuelle Hierarchie

Die App muss sich auf allen Größen wie dasselbe Produkt anfühlen.

## 20. Qualitätssicherung

Nach der Implementierung:
- Starte die Anwendung.
- Prüfe die tatsächliche Darstellung im Browser, sofern die vorhandene Umgebung das ermöglicht.
- Kontrolliere die Startseite und alle fünf Hauptbereiche.
- Teste die wichtigsten Klickpfade.
- Prüfe Formulare und Validierungen.
- Prüfe Speicherung und Wiederherstellung lokaler Demo-Daten.
- Teste die Chat-Eingabe und den Demo-Antwortfluss.
- Prüfe Zeitfilter und Diagramme.
- Suche nach kaputten Links und Buttons ohne Funktion.
- Behebe Laufzeitfehler und offensichtliche Konsolenfehler.
- Prüfe responsives Verhalten.
- Achte auf fehlende Bilder und ungewollte Layoutverschiebungen.

Erstelle oder erweitere vorhandene Tests, wenn die Projektstruktur dies sinnvoll unterstützt.

Behaupte nicht, dass ein Test bestanden wurde, wenn er nicht ausgeführt werden konnte.

## 21. Umsetzungsreihenfolge

Arbeite in dieser Reihenfolge:

### Phase 1 – Bestandsaufnahme
Untersuche das bestehende Projekt, identifiziere die verwendete Technologie, vorhandene Komponenten, Routing, Assets und funktionierende Features.

### Phase 2 – Designsystem
Implementiere Farb-Tokens, Typografie, Abstände, Karten, Buttons, Icons, Schatten und wiederverwendbare Layout-Komponenten.

### Phase 3 – Startseite
Baue die Startseite mit Avatar, Begrüßung, sechs Insight-Karten, Check-in, Wochenziel und Reflexionsfrage.

### Phase 4 – Gesprächsraum
Implementiere die vollständige Chat-Oberfläche, Gesprächsimpulse, Eingabe, Demo-Antwortlogik und optionale Zusammenfassung.

### Phase 5 – Ziele, Einblicke und Tagebuch
Baue alle drei Bereiche mit funktionierenden Datenflüssen und passenden Detailansichten.

### Phase 6 – Übungen, Profil und Einstellungen
Implementiere die Achtsamkeitsübungen, Profileinstellungen und nachvollziehbare Demo-Datenverwaltung.

### Phase 7 – Feinschliff
Optimiere responsive Layouts, Animationen, Zustände, Barrierefreiheit und visuelle Konsistenz.

### Phase 8 – Test
Starte die App, prüfe die Navigation, teste sämtliche Kernfunktionen und behebe gefundene Fehler.

## 22. Definition of Done

Das Projekt ist erst fertig, wenn:

1. Die Anwendung visuell deutlich hochwertiger und konsistenter ist als der Ausgangsprototyp.
2. Die definierte INNERA-Farbpalette im gesamten Projekt verwendet wird.
3. Der Avatar konsistent und hochwertig integriert ist.
4. Die Startseite die sechs Insight-Bereiche enthält.
5. Der tägliche Check-in interaktiv funktioniert und gespeichert werden kann.
6. Der Gesprächsraum Nachrichten annimmt und nachvollziehbare Antworten liefert.
7. Die Hauptnavigation alle fünf Bereiche korrekt öffnet.
8. Ziele angelegt, bearbeitet und abgeschlossen werden können.
9. Insights zwischen verschiedenen Zeiträumen wechseln können.
10. Tagebucheinträge gespeichert, bearbeitet und gelöscht werden können.
11. Achtsamkeitsübungen gestartet und beendet werden können.
12. Die Demo-Daten konsistent verwendet werden und klar als Demo-Daten erkennbar sind.
13. Mobile und Desktop vernünftig funktionieren.
14. Keine wesentlichen UI-Elemente ohne Funktion bleiben.
15. Es keine offensichtlichen Laufzeitfehler gibt.
16. Der Code strukturiert, wartbar und für spätere Backend-Integration vorbereitet ist.

## 23. Abschließende Anweisung

Beginne jetzt mit der Analyse des bestehenden Projekts und setze anschließend die Umsetzung direkt im Code um.

Gib mir nicht nur einen Plan, ein Mockup oder eine Liste mit Empfehlungen. Implementiere die tatsächlichen Änderungen.

Priorisiere die visuelle Qualität der Startseite und des Gesprächsraums, ohne die anderen Bereiche zu vernachlässigen.

Treffe sinnvolle Entscheidungen selbstständig. Verwende das Referenzbild als gestalterische Leitlinie und achte darauf, dass jede Seite wie ein Teil derselben hochwertigen Marke wirkt.

Wenn echte AI- oder Backend-Funktionen noch nicht verfügbar sind, implementiere saubere, funktionierende Demo-Flows und bereite die spätere Integration vor.

Am Ende nenne kurz:
- Welche Bereiche umgesetzt wurden
- Welche Funktionen tatsächlich funktionieren
- Welche Teile noch Demo-Implementierungen sind
- Welche Schritte für einen produktiven Einsatz noch fehlen

**Ziel: Ein hochwertiger, warm gestalteter, vollständig durchklickbarer INNERA-Prototyp, der sich wie ein echtes Produkt anfühlt und nicht wie eine Ansammlung von UI-Mockups.**