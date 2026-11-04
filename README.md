# LC Agora Website

Een complete website voor het LC Agora onderwijsplatform, ontworpen voor Agora-scholen. Deze website biedt leerlingen en coaches een platform om challenges te beheren, workshops bij te wonen, inspiratie op te doen, agenda's te plannen en met elkaar te communiceren.

## Functionaliteiten

### Voor Leerlingen
- **Challenges**: Maak en beheer eigen challenges met hoofd- en deelvragen, deadlines en medeleerlingen
- **Workshops**: Schrijf je in voor workshops georganiseerd door coaches
- **Inspiratie**: Bekijk openbare challenges van andere leerlingen en kopieer deze naar je eigen projecten
- **Agenda**: Plan je challenges en beheer je to-do lijst
- **Forum**: Chat met coaches en medeleerlingen via 1-1 chats of groepschats

### Voor Coaches
- Alle functionaliteiten van leerlingen
- **Challenges beheren**: Maak challenges voor specifieke leerlingen
- **Workshops beheren**: Creëer en beheer workshops
- **Wachtwoorden resetten**: Reset wachtwoorden voor leerlingen
- **Mededelingen plaatsen**: Plaats mededelingen in het forum

### Authenticatie
- Inloggen met gebruikersnaam en wachtwoord
- Eerstelogin vereist wachtwoordwijziging
- Coaches kunnen wachtwoorden resetten voor leerlingen

## Gebruikersaccounts

### Coaches
- **coach1** / `Agora2024!`
- **coach2** / `Agora2024!`

### Leerlingen
- **leerling1** / `TempPass123`
- **leerling2** / `TempPass456`
- **leerling3** / `TempPass789`
- **leerling4** / `TempPass101`
- **leerling5** / `TempPass112`

## GitHub Pages Instellen

Volg deze stappen om de website beschikbaar te maken via GitHub Pages:

### Stap 1: Repository Openbaar Maken
1. Ga naar je GitHub repository: [LC_Agora_Website](https://github.com/[JOUW_GITHUB_GEBRUIKERSNAAM]/LC_Agora_Website)
2. Klik op **Settings** (Instellingen) in de bovenste navigatiebalk
3. Scroll naar beneden naar de **Danger Zone** (Gevarenzone)
4. Klik op **Change visibility** (Zichtbaarheid wijzigen)
5. Selecteer **Public** (Openbaar)
6. Klik op **I understand, change visibility** (Ik begrijp het, wijzig zichtbaarheid)

### Stap 2: GitHub Pages Activeren
1. Ga naar **Settings** > **Pages** in de linkernavigatie
2. Onder **Source** (Bron), selecteer **Deploy from a branch** (Implementeren vanaf een branch)
3. Selecteer **main** of **master** als branch
4. Selecteer **/ (root)** als map
5. Klik op **Save** (Opslaan)

### Stap 3: Wachten op Implementatie
- GitHub Pages heeft ongeveer 1-2 minuten nodig om de website te implementeren
- Je kunt de status zien in de **Actions** tab (Acties)

### Stap 4: Website Bekijken
- Na succesvolle implementatie verschijnt er een melding met de URL van je website
- De URL zal er uitzien als: `https://[JOUW_GITHUB_GEBRUIKERSNAAM].github.io/LC_Agora_Website/`
- Je kunt de website nu openen in je browser

## Projectstructuur

```
LC_Agora_Website/
├── index.html              # Hoofdpagina met module overzicht
├── login.html              # Inlogpagina
├── change-password.html    # Wachtwoord wijzigen pagina
├── 404.html                # 404 foutpagina
├── css/
│   └── styles.css          # Alle CSS stijlen
├── js/
│   ├── auth.js             # Authenticatie functionaliteit
│   └── main.js             # Hoofd JavaScript functionaliteit
└── pages/
    ├── agenda.html         # Agenda pagina
    ├── challenges.html     # Challenges pagina
    ├── forum.html          # Forum pagina
    ├── inspiratie.html     # Inspiratie pagina
    └── workshops.html      # Workshops pagina
```

## Technische Details

- **Frontend**: Pure HTML, CSS en JavaScript (geen frameworks)
- **Dataopslag**: localStorage (voor demo doeleinden)
- **Responsive Design**: Werkt op desktop, tablet en mobiel
- **Browser Ondersteuning**: Moderne browsers (Chrome, Firefox, Edge, Safari)

## Ontwikkeling

### Lokale Ontwikkeling
1. Clone de repository: `git clone https://github.com/[JOUW_GITHUB_GEBRUIKERSNAAM]/LC_Agora_Website.git`
2. Open de `index.html` file in je browser
3. Maak wijzigingen en test ze lokaal

### Wijzigingen Pushen naar GitHub
1. Maak je wijzigingen in de code
2. Voeg de wijzigingen toe: `git add .`
3. Commit de wijzigingen: `git commit -m "Beschrijving van je wijzigingen"`
4. Push naar GitHub: `git push origin main` (of `master`)
5. Wacht tot GitHub Pages de wijzigingen heeft geïmplementeerd (1-2 minuten)

## Problemen Oplossen

### Login werkt niet
- Controleer of je de juiste gebruikersnaam en wachtwoord gebruikt
- De wachtwoorden zijn hoofdlettergevoelig
- Als je voor het eerst inlogt met een leerlingaccount, moet je je wachtwoord wijzigen

### Website laadt niet
- Zorg ervoor dat de repository openbaar is
- Controleer of GitHub Pages is ingeschakeld
- Wacht 1-2 minuten na het pushen van wijzigingen

### Stijlen werken niet
- Zorg ervoor dat alle CSS en JS bestanden correct zijn gelinkt
- Controleer de browser console (F12) op fouten

## Licentie

Dit project is ontwikkeld voor LC Agora en mag vrij worden gebruikt en aangepast voor educatieve doeleinden.

---

**Gemaakt voor LC Agora**
