---
cover: https://iili.io/nJo6Fyv.png
date: 2026-09-04
description: My experience switching to CachyOS, exploring Arch package management, Pacman, AUR, and Fish shell while learning Linux beyond WSL2.
tags:
  - Linux
  - CachyOS
  - Arch Linux
  - DevOps
  - Open Source
title: "Switching to CachyOS: Learning Linux Beyond WSL2"
---

For a long time, most of my Linux experience came from using
**WSL2 on Windows**.

It was enough for development, DevOps tools, and working with Linux
commands, but I eventually realized that using Linux through WSL2 is
quite different from actually using Linux as your daily operating
system.

So I decided to switch to **CachyOS** and use it as my main Linux
environment.

The goal wasn't simply to find a new distribution. I wanted to get
more comfortable with Linux itself and understand things that I had
previously taken for granted.

In this post, I'll go through:

* Why I chose CachyOS
* Package management compared to Ubuntu and CentOS
* Pacman and the AUR
* My experience with Fish shell
* The advantages and weaknesses I've noticed
* What I've learned from the switch

---

## Why CachyOS?

CachyOS is an Arch-based Linux distribution that focuses on providing
a fast and polished desktop experience while keeping the flexibility
of the Arch ecosystem.

That combination was interesting to me.

I wanted the flexibility of Arch without having to manually configure
every part of my system from scratch.

More importantly, I wanted to move away from the environment I was
already comfortable with.

When you spend a lot of time using Ubuntu, you naturally start
memorizing commands and workflows.

Switching to an Arch-based system forces you to question some of those
habits.

And that's exactly what I wanted.

---

## Package Management: Ubuntu, CentOS vs Arch

One of the biggest differences I noticed was package management.

I've previously worked with package managers such as:

```bash
apt
```

on Ubuntu and:

```bash
dnf
```

on CentOS/RHEL-based systems.

With CachyOS, I'm now working primarily with:

```bash
pacman
```

The basic concept is the same: install, update, remove, and manage
packages.

But the workflow and ecosystem feel quite different.

For example, instead of:

```bash
sudo apt install package
```

I would use:

```bash
sudo pacman -S package
```

This sounds like a small difference, but once you start managing an
entire system, you begin noticing how different the ecosystems are.

It also made me realize how much of my previous Linux knowledge was
specifically **Ubuntu knowledge**, rather than general Linux knowledge.

---

## Pacman

Pacman is the standard package manager for Arch Linux and Arch-based
distributions.

Some basic commands I've been getting used to are:

```bash
# Install a package
sudo pacman -S package

# Remove a package
sudo pacman -R package

# Update the system
sudo pacman -Syu

# Search for a package
pacman -Ss package
```

The commands themselves aren't difficult.

The interesting part is understanding how the Arch ecosystem is
structured around them.

Instead of simply memorizing commands, I'm trying to understand what
repositories are being used, how dependencies are handled, and what
actually happens when packages are installed or updated.

---

## The AUR

Another major part of the Arch ecosystem is the **Arch User
Repository (AUR)**.

The AUR provides community-maintained build scripts for software that
isn't necessarily available in the official repositories.

This is one of the things I really like about the Arch ecosystem.

You can find a huge amount of software without having to manually
search for installation instructions on different websites.

But this flexibility comes with a downside.

### More flexibility means more responsibility

The AUR isn't the same thing as an official repository.

You need to pay attention to what you're installing and understand
where packages come from.

That's something I didn't have to think about as much when I was
primarily using Ubuntu.

For me, that's actually part of the learning experience.

Instead of treating the package manager as a black box, I'm becoming
more interested in understanding what's happening underneath it.

---

## Fish Shell

Another thing I decided to experiment with after switching was
**Fish shell**.

So far, Fish has been one of my favorite parts of the experience.

The interactive shell feels very polished.

Features such as:

* Autosuggestions
* Syntax highlighting
* Smart completions
* Better interactive defaults

make everyday terminal usage much more convenient.

For example, when typing a command I've used before, Fish can suggest
the rest of it automatically.

It sounds like a small feature, but when you're working in the
terminal every day, these small improvements add up.

---

## Fish vs Bash

Fish does have an important weakness.

It isn't Bash-compatible.

That means Bash scripts aren't necessarily going to work correctly in
Fish.

For someone working with Linux and DevOps, this matters because Bash is
still extremely common in:

* Automation
* CI/CD pipelines
* Server administration
* Docker environments
* Existing scripts
* DevOps tooling

Because of this, I don't see Fish as a replacement for Bash.

Instead, I'm currently treating them differently.

**Fish for interactive terminal usage.**

**Bash for scripting and compatibility.**

That gives me the nicer interactive experience of Fish while still
keeping compatibility with the huge amount of Bash-based tooling that
already exists.

---

## What I Like About CachyOS

After using it as my daily environment, there are several things I
really like.

### 1. It encourages learning

This is probably the biggest advantage for me.

When something breaks, I can't always copy an Ubuntu command from the
first result I find.

I have to understand what I'm actually doing.

### 2. Pacman + AUR

The combination provides a lot of flexibility when installing
software.

There's a huge amount of software available without needing to hunt
down installation instructions manually.

### 3. Fish

Fish makes everyday terminal usage much more enjoyable.

The interactive experience is one of the things I noticed immediately.

### 4. Rolling Release

The rolling-release model means I can keep the system and many of its
packages relatively up to date without waiting for a completely new
distribution release.

### 5. A Good DevOps Learning Environment

Since I'm interested in DevOps and Cloud, having Linux as my primary
environment gives me a better opportunity to practice things like:

* Linux administration
* Networking
* Containers
* Kubernetes
* Automation
* System troubleshooting

Instead of practicing everything inside WSL2, I'm now dealing with the
actual operating system.

---

## What I Don't Like

Of course, CachyOS isn't perfect.

### Steeper Learning Curve

If you're coming from Ubuntu, some things simply require adjustment.

A tutorial might tell you to use `apt`, modify a particular
configuration file, or follow an Ubuntu-specific workflow.

That doesn't necessarily translate directly to Arch.

You often have to find the Arch equivalent.

### AUR Requires More Awareness

The AUR is extremely useful, but its flexibility means you should pay
attention to what you're installing.

It's not something I would recommend treating like an unlimited
official software store.

### Fish Compatibility

Fish is great for interactive use, but Bash compatibility is still
important.

If you're working with existing scripts, Bash remains difficult to
avoid.

### Breaking Things

This is both a weakness and an advantage.

When something goes wrong, fixing it can take more effort.

But that process also forces you to understand your system better.

---

## What I Learned

The biggest lesson from switching to CachyOS isn't really about
CachyOS.

It's about the difference between **knowing Linux commands** and
**understanding Linux**.

Knowing:

```bash
apt install
```

is useful.

But understanding how package managers work, where software comes
from, how dependencies are handled, how services run, where
configuration lives, and how to troubleshoot the system is much more
valuable.

Switching distributions exposed how much of my previous Linux
knowledge was tied specifically to Ubuntu.

Now I'm gradually building a more general understanding of Linux.



## CachyOS vs My Previous Workflow

My previous workflow was essentially:

**Windows → WSL2 → Linux environment**

Now it's closer to:

**Linux → Development → DevOps tooling**

That small change has made Linux feel less like a tool I'm accessing and
more like the environment I'm actually working in.

And that was the main reason I made the switch.

---

## Final Thoughts

I wouldn't say CachyOS is necessarily the "best" Linux distribution.

That's not really what I was looking for.

I wanted a system that would push me outside of my comfort zone and
make me learn.

I've already broken things, fixed things, searched for solutions that
turned out to be Ubuntu-specific, and had to figure out the Arch way of
doing things.

And honestly, that's been one of the most useful parts of the
experience.

Sometimes breaking your environment teaches you more than following
another tutorial ever could.

I'm still setting everything up and moving more of my development and
DevOps workflow to Linux.

**Still learning, still breaking things, and still figuring out Linux
one problem at a time.**
