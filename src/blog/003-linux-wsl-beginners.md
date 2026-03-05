---
title: "Understanding Linux: A Beginner's Guide to Practicing on Windows"
description: "Linux & WSL: A Beginner-Friendly Guide Table of Contents  Part 1: A Brief Overview of Linux  What Is Linux? Why Learn Linux? Popular Linux Distributions   Part 2: Practicing Linux on Windows with WSL "
date: 2025-08-30
tags:
  - Linux
  - WSL
---

---

## Part 1: A Brief Overview of Linux

### What Is Linux?

Linux is an **open-source operating system** and a free alternative to Windows
and macOS. Created in **1991 by Linus Torvalds**, Linux is based on Unix
principles.

Technically, _Linux_ refers to the **kernel**—the core component that manages
hardware and system resources. In everyday usage, however, it usually means a
complete operating system known as a **Linux distribution (distro)**, which
bundles the kernel with system utilities, libraries, and often a desktop
environment.

---

### Why Learn Linux?

#### Server and Cloud Dominance

Most web servers, databases, and cloud platforms—**AWS**, **Azure**, and
**GCP**—run on Linux. If you work in backend, DevOps, or cloud engineering,
Linux is not optional; it’s essential.

#### The Power of the Command Line

Linux provides a powerful **command-line interface (CLI)** that enables
scripting and automation. This allows developers and system administrators to
manage systems efficiently and at scale—often faster and more precisely than
with a GUI.

#### Open Source and Customization

Linux is open-source, meaning its code is freely available to inspect and
modify. This encourages community-driven innovation, strong security practices,
and deep **customization**, letting users tailor systems to their exact needs.

---

### Popular Linux Distributions

- **Red Hat Enterprise Linux (RHEL)** – Enterprise-grade stability, security,
  and long-term support (subscription-based).
- **CentOS (Legacy)** – Previously a free RHEL clone; now replaced by **CentOS
  Stream** and community forks like **Rocky Linux** and **AlmaLinux**.
- **Ubuntu** – User-friendly, widely adopted, and backed by a massive community.
- **Debian** – Extremely stable and community-focused; the foundation for many
  other distros.
- **Fedora** – Cutting-edge features and technologies, sponsored by Red Hat.
- **Linux Mint** – Desktop-focused, Windows-friendly UX based on Ubuntu.
- **Kali Linux** – Debian-based distro for penetration testing and digital
  forensics, maintained by Offensive Security.

---

## Part 2: Practicing Linux on Windows with WSL

### Introduction to WSL

The **Windows Subsystem for Linux (WSL)** allows you to run a real Linux
environment directly on Windows—without dual booting or heavy virtual machines.

WSL is lightweight and deeply integrated with Windows:

- Access Windows files from Linux
- Launch Windows apps from Linux
- Near-native performance

**WSL 2** is the recommended version, using a real Linux kernel inside a
lightweight VM for full system call compatibility.

---

### Step-by-Step Installation (Windows 11)

#### Step 1: Check Your Windows Version

Ensure you’re running **Windows 11**:

1. Press `Win + R`
2. Type `winver`
3. Press Enter

---

### Choosing a Distribution

#### Official Microsoft Store Options

- **Ubuntu (LTS)** – Best for beginners and the default WSL distro
- **Debian** – Stable and minimal
- **Kali Linux** – Security and pentesting
- **openSUSE** – Available as **Leap** (stable) or **Tumbleweed** (rolling)
- **Oracle Linux** – Enterprise-focused, RHEL-compatible
- **AlmaLinux** – Community-driven RHEL clone

---

### Installing Distributions

#### Method 1: Microsoft Store

1. Open the **Microsoft Store**
2. Search for the distro name (e.g., Ubuntu)
3. Click **Install**

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1756519230527/46af053c-43b2-43a7-9cdf-af58fe08d558.png)**

#### Method 2: Command Line

```bash
wsl --list --online
wsl --install -d <DistroName>
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1756519938852/28796004-e4cb-4528-aaf4-9ed2ede925ff.png)

```bash
wsl --list --online
wsl --install -d <DistroName>
```

---

### Manual Installation: CentOS Stream

CentOS Stream is not available directly from the Microsoft Store and must be
installed manually.

#### Prerequisites

- WSL 2 enabled
- A dedicated directory (e.g., `C:\WSL\CentOS-Stream`)

#### Import Method

1. Download a trusted CentOS Stream `.tar.xz` image
2. Open **PowerShell as Administrator**
3. Run:

```bash
wsl --import CentOS-Stream C:\WSL\CentOS-Stream C:\path\CentOS-Stream.tar.xz --version 2
```

#### Initial Setup

- Launch with: `wsl -d CentOS-Stream`
- Create a non-root user
- Add user to the `wheel` group
- Configure `/etc/wsl.conf` to set the default user

---

### Switching Between WSL Distributions

#### Method 1: Command Line

```bash
wsl -d Ubuntu
wsl -d kali-linux
```

#### Method 2: Set a Default Distro

```bash
wsl --list --verbose
wsl --set-default kali-linux
```

#### Method 3: Windows Terminal (GUI)

- Open **Windows Terminal**
- Click the dropdown arrow next to `+`
- Select your distro

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1756520591467/edce4a58-1679-47ca-9319-7df23504b6ec.png)

---

## Part 3: Integrating with VS Code and Windows

### Working with VS Code

1. Install **Remote – WSL** extension
2. From WSL terminal:

```bash
code .
```

VS Code will open connected directly to your Linux filesystem.

### Navigating Files

- **Windows → Linux:** `\wsl.localhost`
- **Linux → Windows:** `/mnt/c`, `/mnt/d`, etc.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1756520788375/67ce884d-72ff-48bc-90cf-d1ac7eecdc84.png)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1756520949762/f70651a8-2fff-471b-87f3-43c97c1c96ff.png)

---

## Part 4: What’s Next?

### Learn Shell Scripting

- Bash variables
- Conditionals (`if`)
- Loops (`for`, `while`)

### Explore More Distros

- Kali Linux for security
- Debian for stability
- Fedora for cutting-edge tech

### Join the Community

- Forums, Discord, Reddit (`r/linux`)

### Hands-on Projects

- Configure **Nginx** or **Apache**
- Build a **Flask/Django** app
- Manage code with **Git**

---

Your WSL environment is a powerful learning sandbox. Experiment, break things,
fix them—and enjoy the Linux journey 🚀
