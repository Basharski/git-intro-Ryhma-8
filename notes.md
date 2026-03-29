# Git Commands - Notes / Git-komennot - Muistiinpanot

## Exercise 1: Git command line basics / Harjoitus 1: Git-komentorivin perusteet

Commands used during this exercise / Harjoituksessa käytetyt komennot:

```
git clone https://github.com/mattpe/git-intro.git
git remote -v
git remote set-url origin https://github.com/Basharski/git-intro-Ryhma-8.git
git remote -v
git log --oneline
git status
git add notes.md
git commit -m "Add notes.md with git commands"
git push origin main
```

## Basic Git Commands Reference / Git-komentojen pikaopas

```
git init                    # Initialize a new local repository / Luo uusi paikallinen repo
git clone <url>             # Clone a remote repository / Kloonaa etärepository
git status                  # Show working tree status / Näytä työskentelyhakemiston tila
git add <file>              # Stage a file / Lisää tiedosto staging-alueelle
git add .                   # Stage all changes / Lisää kaikki muutokset
git commit -m "message"     # Commit staged changes / Commitoi muutokset viestin kera
git push origin main        # Push to remote main branch / Pushaa etärepon main-haaraan
git pull                    # Fetch and merge remote changes / Hae ja yhdistä etämuutokset
git log --oneline           # Show commit history (compact) / Näytä commit-historia (tiivis)
git remote -v               # Show remote connections / Näytä etäyhteydet
git remote set-url origin <url>  # Change remote URL / Vaihda etärepon osoite
git branch                  # List branches / Listaa haarat
git checkout -b <branch>    # Create and switch to new branch / Luo ja vaihda uuteen haaraan
git merge <branch>          # Merge branch into current branch / Yhdistä haara nykyiseen
```
