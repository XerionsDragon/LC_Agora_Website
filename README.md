# LC Agora - Website voor Agora-school

Een complete HTML-website voor een Agora-school met alle gevraagde functionaliteiten.

## 📁 Projectstructuur

```
LC_Agora_Website/
├── index.html                 # Homepage met module knoppen
├── login.html                 # Inlogpagina
├── change-password.html      # Wachtwoord wijzigen pagina
├── 404.html                   # 404 error pagina
├── css/
│   └── styles.css            # Alle CSS stijlen
├── js/
│   ├── auth.js               # Authenticatie functionaliteit
│   └── main.js               # Hoofd JavaScript functionaliteit
└── pages/
    ├── agenda.html           # Agenda met kalender en to-do lijst
    ├── challenges.html        # Challenges beheer
    ├── forum.html             # Forum met chat functionaliteit
    ├── inspiratie.html        # Inspiratie pagina met openbare challenges
    └── workshops.html         # Workshops beheer
```

## ✨ Functionaliteiten

### 1. **Authenticatie Systeem**
- Inloggen met gebruikersnaam en wachtwoord
- Random gegenereerde wachtwoorden voor eerste login
- Wachtwoord wijzigen bij eerste login
- Coaches kunnen wachtwoorden resetten voor leerlingen
- Gebruikersrollen: Coach en Leerling

### 2. **Challenges**
- Leerlingen kunnen challenges aanmaken
- Klasgenoten toevoegen aan challenges
- Velden: Titel, beschrijving, hoofd- en deelvragen, deadline
- Coaches kunnen challenges aanmaken en kopiëren naar leerlingen
- Status beheer (actief, afgerond, gepauzeerd)
- Openbaar/privaat instelling

### 3. **Workshops**
- Coaches kunnen workshops aanmaken
- Leerlingen kunnen zich inschrijven voor workshops
- Workshop details: Titel, datum, tijd, locatie, beschrijving, max deelnemers
- Voorbeelden: Engels, maaltijden verzorgen, fruit plukken

### 4. **Inspiratie**
- Openbare challenges van andere leerlingen bekijken
- Challenges kopiëren naar eigen account
- Zoek- en filterfunctionaliteit
- Uitgelichte challenges
- Tips voor het maken van goede challenges

### 5. **Agenda**
- Kalender met maandoverzicht
- Events toevoegen en bekijken
- To-do lijst met taken beheer
- Taken afvinken en verwijderen

### 6. **Forum**
- Algemene mededelingen
- Chat met coaches en leerlingen
- 1-1 chats en chatgroepen
- Coaches kunnen mededelingen plaatsen
- Berichten verzenden en ontvangen

## 👥 Gebruikersaccounts

### Coaches
- **Gebruikersnaam:** coach1
- **Wachtwoord:** Agora2024!

- **Gebruikersnaam:** coach2
- **Wachtwoord:** Agora2024!

### Leerlingen
- **Gebruikersnaam:** leerling1
- **Wachtwoord:** TempPass123

- **Gebruikersnaam:** leerling2
- **Wachtwoord:** TempPass456

- **Gebruikersnaam:** leerling3
- **Wachtwoord:** TempPass789

- **Gebruikersnaam:** leerling4
- **Wachtwoord:** TempPass101

- **Gebruikersnaam:** leerling5
- **Wachtwoord:** TempPass112

## 🎨 Design & Stijl

- **Kleurenschema:**
  - Primair: Groen (#2E8B57)
  - Secundair: Blauw (#3498DB)
  - Accent: Oranje (#F39C12)
  - Achtergrond: Lichtgrijs (#F8F9FA)

- **Responsive Design:**
  - Werkt op desktop, tablet en mobiel
  - Adaptief grid-systeem
  - Touch-vriendelijke knoppen

- **Iconen:**
  - Font Awesome 6.4.0

## 🚀 Hoe te gebruiken

1. **Lokaal openen:**
   - Open `index.html` in een webbrowser
   - Gebruik de meegeleverde accounts om in te loggen

2. **Op een webserver:**
   - Plaats de hele map op een webserver
   - Toegang via `http://jouw-domein.nl/LC_Agora_Website/`

3. **Aanpassen:**
   - Wijzig `js/auth.js` om gebruikers toe te voegen/verwijderen
   - Pas `css/styles.css` aan voor eigen stijl
   - Voeg nieuwe pagina's toe in de `pages/` map

## 📝 Opmerkingen

- Deze website gebruikt **localStorage** voor data-opslag (geen backend nodig)
- Alle data is client-side opgeslagen
- Voor een productie-omgeving wordt een backend database aanbevolen
- Afbeeldingen zijn gegenereerd met CSS gradients en iconen

## 🔧 Technische Details

- **HTML5** voor structuur
- **CSS3** voor styling (Flexbox, Grid, Animations)
- **Vanilla JavaScript** voor functionaliteit
- **Font Awesome** voor iconen
- **localStorage** voor data-persistentie

## 🌟 Toekomstige Uitbreidingen

- Database integratie (MySQL, MongoDB)
- Echte afbeeldingsuploads
- Notificatie systeem
- Bestandsdeling
- Video-chat functionaliteit
- Externe API integraties

---

**Gemaakt voor:** LC Agora School
**Versie:** 1.0
**Datum:** 2024
