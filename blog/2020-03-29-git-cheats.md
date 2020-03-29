---
slug: git-cheats
title: Git Cheats
tags:
- git
- cheatsheet
image: rocket.png
---
This post is meant to sum up the most useful things I have learnt about the `git` command
line from many years of adventures in the source control world. I will probably update
this page as and when I learn any new tricks.

## Git 101
Simplest primer if you've never used git before.
```bash
# Create a new local repository - this creates a branch called master
git init

# Setup a local repository based on an existing remote one
git clone https://github.com/someone/some-project

# Create / edit your files
echo "Hello" > myfile.txt

# Stage your files to be committed
git add myfile.txt # or just git add * if you're lazy

# Gets the status of changes in the local repository
git status

# Commit whatever you've staged
git commit -m "My commit message"

# Add a remote repository
git remote add origin https://github.com/my-username/my-project

# Push your local commits to the remote repository
git push

# Get newer commits from remote repository into your local one
git pull
```

## Git Ignore
One of the most important things to setup on new repositories is the `.gitignore` file.
Its name is quite self-explanatory and it prevents accidental commits of temporary / IDE /
environment / OS files. There's a website called [gitignore.io](https://gitignore.io) that
helps you generate a good sample `.gitignore` based on your project's language, the IDE
you use and your OS.

## Aliases
Viewing the git log is often not trivial if you don't have a fancy IDE. I usually just
want to see a couple of attributes across a number of commits, so the default `git log`
representation is not helpful. I have a custom view for the last 20 commits, each on a
single line with their hashes, dates, authors and comments in colours. This allows me to
just `git work`.
```bash
git config --global alias.work 'log -n 20 --pretty=format:"%C(yellow)%h%Creset %ai %<(15) %Cblue%aN %Creset %s"'
```
Preview:
<pre class="language-x" style="padding:1rem">
<span style="color:goldenrod">b62eee6</span> 2020-03-22 16:10:02 +0800  <span style="color:skyblue">John Doe</span>     Added new feature
<span style="color:goldenrod">8dc0dcc</span> 2020-03-21 16:09:28 +0800  <span style="color:skyblue">Jane Smith</span>   Fixed bug: xyz
<span style="color:goldenrod">f683f5d</span> 2020-03-20 13:44:19 +0800  <span style="color:skyblue">Joe Schmoe</span>   Bumped version
<span style="color:goldenrod">db158f4</span> 2020-03-19 13:43:13 +0800  <span style="color:skyblue">Jake Gold</span>    Upgraded dependency
</pre>

If you're even lazier, use a shorter shell alias in your `.bash_profile` / `.zshrc`. There
are some git commands that I use too often like `git status` so they end up in here to
save me lots of key strokes as well.
```bash
alias gw="git log -n 20 --pretty=format:'%C(yellow)%h%Creset %ai %<(15) %Cblue%aN %Creset %s'"
alias gs="git status"
```

## Branching
List branches and find out which one you're in
```bash
git branch
git branch -r # includes remote branches that don't exist locally
```
Switch branches
```bash
git checkout an-existing-branch
```

Create a new branch based on the current branch you're in
```bash
git checkout -b my-new-branch-name
```

Delete a branch
```bash
git branch -D branch-i-do-not-like-anymore
```

## Reviewing Changes
You can `git status` to quickly list the files that have changed, but to review the
changes made side-by-side with the original, you can use the `git difftool`:
```bash
git difftool path/to/file  # Review changes for a specific file
git difftool               # Cycle through all changed files
```
Tip: if using a `vim`-based difftool, you can exit all windows using `:qa`.

## Simple Rebasing (the good kind)
If you're working on a collaborative project, every person should be working on a
different feature branch that merges back into `master`. Once you've added more commits to
your feature branch and `master` has also received newer commits, the branches would now
have diverged. If you would like to apply those newer commits from `master` onto your
branch, you can do a rebase. Note that your newer commits will always be stacked later
than those you are rebasing from `master`, so the commit log still makes sense when you
eventually merge your branch into `master`.
```bash
git rebase master
```
![alt text](../static/git-rebase.gif "Rebase in action")

## Interactive Rebasing (the dangerous kind)
Rebasing also has a very different ability that allows you to rewrite history using the
interactive mode. You can either choose how many previous commits to work with or if your
commit history doesn't go very far back, use the entire history.
```bash
git rebase -i HEAD~5  # last 5 commits
git rebase -i --root  # beginning of time
```
You will then be brought to your git text editor showing the list of commits and an option
prefixing each commit.

```bash
pick 06cfc71 Added EUR support
pick 33b09f4 Changed FX rates API
pick 3e6a5ef Allow CreditCardAccount to be paymentAccount
pick 4c174ce Revise CashServices
pick 6487b61 Fixed historical download
```
You can read the bunch of comments in the block below the commit list, but essentially
what you need to do is change the prefix for any commit from `pick` to one of the
operations and save the file. You can use the first letter of the operation instead of
typing the entire thing out. e.g. just `f` instead of `fixup`. The most common operations
I use are:
* `drop`: Remove the commit(s) from history
* `fixup`: Join multiple commits into a single one: all consecutive commits prefixed
  with `fixup` will be merged into the most previous commit prefixed with `pick` and
  retain that commit's message and timestamp
* `squash`: like `fixup`, but allows changing which commit message to use
* `reword`: To change the commit message

Best practice for rewriting history is to only do it if your branch has not been pushed to
remote or if you are sure that you will be the only person pulling that branch.

> Never rewrite history on a shared branch, especially master.

That being said, you can if you *really* want to. Your `git push` will be rejected by the
remote for good reason, but you can force it through using `git push -f`, which I repeat,
is ***not recommended***.

## Changing the most recent commit (also dangerous)
### Changing the commit message
```bash
git commit --amend
```

### Adding more changes
If you already know you're going to do a `fixup` rebase later, you can save time by just
adding new changes directly into a previous commit.
```bash
git add my-changed-file
git commit --amend --no-edit
```

### Changing commit author
Elegant way of crediting someone else for a fix or helping someone else fix a merge
conflict without adding commits under your own name.
```bash
git commit --amend --no-edit --author="John Doe <john@doe.org>"
```

### Changing commit time
If you've done a `squash` or `fixup` rebase, you'll notice that the commit time uses the
oldest commit. Assuming the squashed commit is the most recent commit, you can reset the
commit time to the current time using:
```bash
git commit --amend --no-edit --reset-author
```
You can also change the commit time to a specific time using:
```bash
git commit --amend --no-edit --date "Fri Mar 16 21:48:09 2020 +0800"
```

## Recover from "accidentally" rewriting shared history
In the event you find yourself in this position with your team mad at you and not knowing
what to do, go to their workstations individually and fix their local repositories using
these steps:
1. Store their changes in a safe place (separate branch pushed to remote)
2. Create a temporary branch (`git checkout -b temp`)
3. Delete the corrupted branch (`git branch -D master`)
4. Pull changes (`git pull`)
5. Restore the branch with your rewritten history (`git checkout master`)
6. Dump the temporary branch (`git branch -D temp`)
7. Buy them a coffee / meal

## Push a local branch to a remote under a different name
Useful for backing up your current branch to the remote without having to clone the branch
locally and switch back.
```bash
git push origin local-branch-1:remote-branch-2
```

## Reviewing pull requests
Create a branch from a pull request for reviewing. This example creates a branch called
`pr79` from pull request #79.
```bash
git fetch origin pull/79/head:pr79
```

## Contributions welcome
Any other git cheats you've found useful? Let me know on twitter.
