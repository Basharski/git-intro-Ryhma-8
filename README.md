# TUES - Työuupumuksen Ennaltaehkäisevä Seuranta'
Sovellus on kehitetty palautumisen ja stressin seurantaan hyödyntäen sykevälivaihtelua (HRV). Se tarjoaa kaksi eri käyttöliittymää: **käyttäjäalustan** ja **ammattilaisnäkymän**.

## Sovelluksen linkki
[Klikkaa tästä](https://tues-project.swedencentral.cloudapp.azure.com/)

## API-dokumentaatio
[APIDOC](https://tues-project.swedencentral.cloudapp.azure.com/docs/) kommentit on luotu Google Gemini 3 Pro tekoälymallin avulla

## Toiminnallisuudet
### • Kubios Cloud -integraatio
Sovellus synkronoi syke- ja HRV-datan suoraan Kubios Cloud API:sta. Käyttäjän ei tarvitse syöttää tietoja käsin, vaan viimeisimmät mittaukset haetaan automaattisesti kirjautumisen yhteydessä.

### • Interaktiivinen analytiikka
Dashboard tarjoaa visuaalisen näkymän käyttäjän terveysdatasta. Etusivulla käyttäjä saa nopean katsauksen tämän RMSSD-, LF/HF-arvoon, stressitasoon ja palautumiseen. RMSSD ja Stressitaso graafit auttavat käyttäjää seuraamaan stressinsä tasoja.

### • Päiväkirja ja viikoittaiset raportit
Käyttäjä voi täyttää omaa päiväkirjaa ja merkitä päivän fiiliksen ja kirjoittaa vapaasti merkinnän. Käyttäjä saa myös viikoittaisen raportin, josta hän helposti näkee valmiutensa ja RMSSD- sekä Stressi-indeksinsä. Ammattilainen voi myös liittää kommenttejä käyttäjän raportteihin.

### • Ammattilaisen ohjaus ja näkymä
Terveydenhuollon ammattilainen, terapeutti tai valmentaja voi helposti luoda omasta näkymästään koodin, jonka tämä voi antaa asiakkaalle/potilaalle. Kun asiakas/potilas on koodin syöttänyt sovellukseen, näkevät ammattilaiset potilaan datan ja tämän automaattisesti luodut viikkoraportit. Käyttäjä voi helposti myös peruuttaa suostumuksensa datan jakoon nappia painamalla.

### • Personoidut harjoitukset
Sovellus katsoo käyttäjän mittausdataa ja antaa sen perusteella käyttäjälle ehdotuksia mahdollisista harjoitteista joita tämä voi tehdä alentaakseen stressitasoaan.

## Projektin arkkitehtuuri
**Backend**: Node.js & Express (REST API) \
**Frontend**: Vite & Vanilla Javascript \
**Tietokanta**: MySQL\
**Deployment**: Azure VM, jossa Apache toimii Reverse Proxyna ja SSL-suojaus (HTTPS) on toteutettu Let's Encrypt -sertifikaatilla

## Sovelluksen näyttökuvat
### Kirjautumissivu
<img width="1800" height="1039" alt="Näyttökuva 2026-05-08 kello 1 36 40" src="https://github.com/user-attachments/assets/b6f95b00-d40a-4993-8557-620de91dc38b" /> 

### Käyttäjän etusivu
<img width="1800" height="1039" alt="Näyttökuva 2026-05-08 kello 1 36 59" src="https://github.com/user-attachments/assets/8594a9c5-1597-47e4-a058-a41f99f52794" />

### Käyttäjän analyysisivu
<img width="1800" height="1039" alt="Näyttökuva 2026-05-08 kello 1 37 41" src="https://github.com/user-attachments/assets/967e3faa-1ee3-473f-a5f4-7dd7b17661f5" />

### Ammattilaisen näkymä
<img width="1800" height="1039" alt="Näyttökuva 2026-05-08 kello 1 38 16" src="https://github.com/user-attachments/assets/d5fc38ca-9f5d-4ec7-b6ef-edce9419f746" />

## Sovelluksen asennus ja käyttö
[Sovellus netissä](https://tues-project.swedencentral.cloudapp.azure.com/)

### Asennus
**Kloonaa** git repo: `git clone https://github.com/Basharski/git-intro-Ryhma-8` \
**Luo tietokanta**: Luo tietokanta `db/database_schema.sql` avulla \
**Luo .env tiedosto**: Katso `backend/.env.example` ja `frontend/.env.example` \
**Backend**: `cd backend` `npm install` `npm run dev` \
**Frontend**: `cd frontend` `npm install` `npm run dev`

## Sovelluksen tietokannan rakenne
<img width="536" height="903" alt="Näyttökuva 2026-05-08 kello 2 02 10" src="https://github.com/user-attachments/assets/3682c73a-c764-4c02-a0ee-f45e7a1716fa" />

## Testaus

Tässä repossa on toteutettu Robot Frameworkilla automaatiotestit terveyssovellukselle.
Tarkemmat ohjeet ja dokumentaatio löytyvät tiedostosta [notes.md](notes.md).

### Projektin kansiorakenne

```
git-intro-Ryhma-8/
├── backend/                # Node.js & Express taustajärjestelmä
│   ├── src/                # Backendin lähdekoodi
│   │   ├── controllers/    # Reittien logiikka ja tietokantakyselyt
│   │   ├── routes/         # API-reittien määrittelyt (ja apidoc-kommentit)
│   │   ├── middlewares/    # Autentikointi ja virheidenkäsittely
│   │   ├── models/         # Tietokantamallit
│   │   ├── utils/          # Apu scriptit
│   │   └── index.js        # Palvelimen käynnistystiedosto ja konfiguraatio
│   ├── package.json        # Backendin riippuvuudet ja skriptit
│   └── .env                # Ympäristömuuttujat (ei Gitissä)
│
├── frontend/               # Vite & Vanilla JS käyttöliittymä
│   ├── dist/               # Tuotantokäyttöön optimoitu kooste (build)
│   ├── src/                # Frontendin lähdekoodi
│   │   ├── css/            # Tyylitiedostot
│   │   ├── js/             # Käyttöliittymän logiikka ja API-kutsut
│   │   ├── professional/   # Ammattilaisnäkymän HTML-tiedostot
│   │   ├── home/           # Käyttäjän etusivu
│   │   ├── analysis/       # Käyttäjän analyysisivu
│   │   ├── auth/           # Kirjautumissivu
│   │   └── partials/       # Modulaariset HTML osat
│   ├── index.html          # Sovelluksen pääsivu (Käyttäjä)
│   ├── vite.config.js      # Viten asetukset (esim. multi-page build)
│   └── package.json        # Frontendin riippuvuudet
│
├── docs/                   # Generoitu API-dokumentaatio (HTML)
├── db/                     # Tietokannan skeema- ja dump-tiedostot
├── outputs/                # Testien tulokset
├── tests/                  # RobotFramework testit
├── resources/              # RobotFramework testien resurssit
└── README.md               # Projektin dokumentaatio
```

### Testien ajaminen

1. Luo ja aktivoi virtuaaliympäristö:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate        # Windows
   source .venv/bin/activate     # macOS/Linux
   ```
2. Asenna riippuvuudet:
   ```bash
   pip install -r requirements.txt
   rfbrowser init
   ```
3. Aja kaikki testit:
   ```bash
   robot --pythonpath . --outputdir outputs tests/
   ```
4. Aja vain frontend-testit:
   ```bash
   robot --pythonpath . --outputdir outputs tests/front/
   ```
5. Aja vain backend-testit:
   ```bash
   robot --pythonpath . --outputdir outputs tests/back/
   ```

### Testiraportit

Testien ajamisen jälkeen `outputs/`-kansioon syntyy:
- `report.html` – yhteenveto testien tuloksista
- `log.html` – yksityiskohtainen loki
- `output.xml` – koneluettava tulos

## AI:n käyttö
Jotkin tämän projektin kooditiedostoista ovat luotu tai niiden tekemisessä on käytetty Googlen Gemini 3 Pro tekoälymallia. Jos tiedostoon on käytetty tekoälyä on se merkitty tiedoston yläosaan.
