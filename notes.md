# Git Commands - Notes

## Exercise 1: Git command line basics

Commands used during this exercise:

```
git clone https://github.com/mattpe/git-intro.git
git remote -v
git remote set-url origin https://github.com/Basharski/git-intro.git
git remote -v
git log --oneline
git status
git add notes.md
git commit -m "Add notes.md with git commands"
git push origin main
```

## Basic Git Commands Reference

```
git init                    # Initialize a new local repository
git clone <url>             # Clone a remote repository
git status                  # Show working tree status
git add <file>              # Stage a file
git add .                   # Stage all changes
git commit -m "message"     # Commit staged changes
git push origin main        # Push to remote main branch
git pull                    # Fetch and merge remote changes
git log --oneline           # Show commit history (compact)
git remote -v               # Show remote connections
git remote set-url origin <url>  # Change remote URL
git branch                  # List branches
git checkout -b <branch>    # Create and switch to new branch
git merge <branch>          # Merge branch into current branch
```
