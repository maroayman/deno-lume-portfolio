---
title: "How to Install and Update Software on Linux: A Guide to Package Management"
description: "One of the most important tasks in Linux is managing software — installing, updating, and removing applications. Unlike Windows, where you download .exe files, or macOS with .dmg apps, Linux distribution"
date: 2025-09-06
tags:
  - Linux
---

One of the most important tasks in Linux is **managing software** — installing, updating, and removing applications. Unlike Windows, where you download `.exe` files, or macOS with `.dmg` apps, Linux distributions rely on **package managers** to keep software consistent, secure, and easy to maintain.

This article will guide you through **beginner and intermediate concepts of package management**: from installing your first package, to working with repositories, cleaning your system, and keeping everything secure.

## What is a Package?

A **package** is a compressed bundle that contains:

* The application/program itself
    
* Metadata (version, description, dependencies)
    
* Installation/removal scripts
    

Packages are stored in **repositories** — online servers maintained by your Linux distribution.

## What is a Package Manager?

A **package manager** is your toolkit for handling software. It:

* Installs and removes programs
    
* Automatically resolves dependencies
    
* Updates software to newer versions
    
* Cleans up unused packages
    
* Verifies security with cryptographic signatures
    

> 💡 Think of it as the **Linux App Store** — but fully under your control.

## Popular Package Managers by Distribution

* **Debian / Ubuntu / Linux Mint** → `apt`
    
* **CentOS 7 / RHEL 7** → `yum`
    
* **CentOS 8+, RHEL 8+, Fedora, Rocky, AlmaLinux** → `dnf`
    
* **Arch Linux** → `pacman`
    
* **OpenSUSE** → `zypper`
    

## Installing Software

* ### Debian/Ubuntu
    

* ***I tested this on Ubuntu 24 LTS.***
    

```bash
sudo apt update            # refresh package list
sudo apt install nginx     # install Nginx web server
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757195289854/e0678282-2db5-45a9-8420-8be84b76a794.png)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757195310098/798203a5-bfca-4510-96e9-ba5bd9ce5f98.png)

* ### Fedora / CentOS 8+ / RHEL 8+
    

* ***Tested on (CentOS Stream 10)***
    

```bash
sudo dnf install nginx
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757195395366/4f6b90c3-868d-4b7c-ae61-0168528b526a.png)

* ### CentOS 7 / RHEL 7
    

```bash
sudo yum update 
```

* ### Arch Linux
    

```bash
sudo pacman -Syu
```

## Removing Software

* ### Debian/Ubuntu
    

```bash
sudo apt remove nginx
sudo apt autoremove     # clean up unused dependencies
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757195639864/b8e0082e-f02f-4834-8a4e-58fc5eef3629.png)

* ### Fedora / CentOS / RHEL
    

```bash
sudo dnf remove nginx
```

* ### Arch Linux
    

```bash
sudo pacman -R nginx
```

## Searching for Packages

Not sure about the exact package name?

* Debian/Ubuntu → `apt search nginx`
    
* Fedora/CentOS → `dnf search nginx`
    
* Arch Linux → `pacman -Ss nginx`
    

## Intermediate Package Management

### 1 - Adding & Removing Repositories

Sometimes software isn’t in the default repo.

**Ubuntu/Debian:**

```bash
sudo add-apt-repository ppa:ondrej/php
sudo apt update
```

**CentOS/RHEL:**

```bash
sudo dnf install epel-release
```

Repo config files live in:

* `/etc/apt/sources.list.d/` (Debian/Ubuntu)
    
* `/etc/yum.repos.d/` (RHEL/CentOS)
    

### Installing from .deb / .rpm Files

If you download packages manually:

```bash
# On Ubuntu/Debian
sudo dpkg -i package.deb
sudo apt -f install   # fix broken dependencies

# On CentOS/RHEL
sudo rpm -ivh package.rpm
```

> 💡 **In the next section, I have included some examples to practice with the manual installation guide.**

### Debian/Ubuntu → `.deb` files

Download a `.deb` package (example: Google Chrome):

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt -f install     # fix missing dependencies
```

### CentOS / RHEL / Fedora → `.rpm` files

Download a `.rpm` package (example: Visual Studio Code):

```bash
wget https://code.visualstudio.com/sha/download?build=stable&os=linux-rpm-x64 -O vscode.rpm
sudo rpm -ivh vscode.rpm
```

If you prefer `dnf` (handles dependencies automatically):

```bash
sudo dnf install ./vscode.rpm
```

* Use `dpkg -i` for `.deb` and `rpm -ivh` for `.rpm`, but they **won’t resolve dependencies**.
    
* Using `apt install ./package.deb` or `dnf install ./package.rpm` is **better** because it pulls in dependencies automatically.
    

### Checking Installed Packages

```bash
# Debian/Ubuntu
dpkg -l | grep nginx

# Fedora/CentOS/RHEL
rpm -qa | grep nginx
```

### Locking Package Versions

Sometimes you don’t want an update to break critical software.

```bash
# Debian/Ubuntu
sudo apt-mark hold nginx
sudo apt-mark unhold nginx

# Fedora/CentOS/RHEL
sudo dnf versionlock add nginx
```

### Cleaning Up System

Over time, old cached packages can fill disk space.

```bash
# Debian/Ubuntu
sudo apt autoremove
sudo apt clean

# Fedora/CentOS/RHEL
sudo dnf autoremove
sudo dnf clean all
```

## Graphical Package Managers

Not a fan of the terminal? Linux also has GUI tools for package management:

* **Ubuntu Software Center**
    
* **GNOME Software**
    
* **KDE Discover**
    

These are just front-ends — under the hood, they still use the same package manager.

## Security & Best Practices

* Always keep your system updated to patch vulnerabilities.
    
* Prefer official repositories over third-party ones.
    
* Verify the source before adding external repos.
    
* Be careful with manually downloaded `.deb` or `.rpm` files.
    

### Linux Package Manager Commands

| Action | Debian/Ubuntu (apt) | RHEL/CentOS/Fedora (dnf/yum) |
| --- | --- | --- |
|  |  |  |
| **Installs** | `sudo apt install pkg` | `sudo dnf install pkg` / `yum install pkg` |
| **Update repos** | `sudo apt update` | (auto in dnf) |
| **Upgrade system** | `sudo apt upgrade` | `sudo dnf upgrade` / `yum update` |
| **Remove** | `sudo apt remove pkg` | `sudo dnf remove pkg` / `yum remove pkg` |
| **Search** | `apt search pkg` | `dnf search pkg` / `yum search pkg` |
| **Cleanup** | `sudo apt autoremove` | `sudo dnf autoremove` |