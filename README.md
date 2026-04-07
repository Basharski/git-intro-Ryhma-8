# Git introduction

1. [Material](git-basics.md)
2. [Exercises](exercises.md)

---

## Testaus

Tässä repossa on toteutettu Robot Frameworkilla automaatiotestit terveyssovellukselle.
Tarkemmat ohjeet ja dokumentaatio löytyvät tiedostosta [notes.md](notes.md).

### Projektin kansiorakenne

```
git-intro/
├── tests/
│   ├── front/          # Käyttöliittymätestit (Browser Library)
│   │   └── login.robot
│   └── back/           # Taustapalvelimen API-testit (RequestsLibrary)
│       └── api.robot
├── resources/
│   └── common.resource # Yhteiset avainsanat
├── outputs/            # Testiraportit (ei versioida, paitsi .gitkeep)
├── .gitignore
├── requirements.txt    # Python-riippuvuudet
└── README.md
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
