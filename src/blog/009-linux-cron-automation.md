---
title: "Scheduling & Automation in Linux: Mastering Cron, At, and Systemd Timers"
description: "One of the most powerful features of Linux is the ability to automate tasks. Whether it’s running a backup every night, sending reports every week, or cleaning up logs at boot, scheduling saves time alot"
date: 2025-09-16
tags:
  - Linux
  - Automation
---

One of the most powerful features of Linux is the ability to **automate tasks**.
Whether it’s running a backup every night, sending reports every week, or
cleaning up logs at boot, scheduling saves time and prevents human error.

Linux offers multiple ways to schedule tasks:

- `at` → run a job once at a specific time

- `cron` → run jobs repeatedly on a schedule

- `anacron` → run cron-like jobs that may have been missed (good for laptops)

- **systemd timers** → the modern replacement/enhancement to cron

This guide covers all four, with **examples, cheatsheets, and practice
exercises**.

## 1\. One-Time Jobs with `at`

The `at` command schedules a job to run **once in the future**.

### Enable the service (CentOS/WSL2)

```bash
sudo systemctl start atd
sudo systemctl enable atd
```

### Usage

```bash
echo "echo 'Hello World' >> /tmp/at_test.log" | at now + 2 minutes
```

- `now + 2 minutes` → natural language time format

- Jobs go into a queue (`atq`, `atrm <jobid>`)

## Missed Jobs with `anacron`

`cron` assumes your system is **always on**. If the system is off, jobs are
skipped. `anacron` solves this by **running jobs once the system is back
online**.

- Config file: `/etc/anacrontab`

- Syntax:

  ```bash
  period   delay   job-identifier   command
  ```

- Example:

  ```bash
  1   10   daily_cleanup   /home/user/cleanup.sh
  ```

  → Run once daily, wait 10 minutes after boot.

## 4\. Modern Scheduling with systemd Timers

Most modern distros (CentOS 7+, Ubuntu 16+) use `systemd`. Instead of cron, you
can use **timers**.

### Example: Daily Job

1. **Service file** `/etc/systemd/system/myjob.service`

   ```bash
   [Unit]
   Description=My Custom Job

   [Service]
   ExecStart=/home/user/backup.sh
   ```

2. **Timer file** `/etc/systemd/system/myjob.timer`

   ```bash
   [Unit]
   Description=Run backup script daily

   [Timer]
   OnCalendar=daily
   Persistent=true

   [Install]
   WantedBy=timers.target
   ```

3. **Enable & Start**

   ```bash
   sudo systemctl enable --now myjob.timer
   systemctl list-timers
   ```

   ## Cheatsheet: Quick Scheduling Commands

   | Tool               | Purpose                      | Key Commands                                        |
   | ------------------ | ---------------------------- | --------------------------------------------------- |
   | **at**             | One-time jobs                | `at TIME`, `atq`, `atrm <jobid>`                    |
   | **cron**           | Recurring jobs               | `crontab -e`, `crontab -l`, `systemctl status cron` |
   | **anacron**        | Recurring jobs, catch missed | Edit `/etc/anacrontab`, `anacron -T`                |
   | **systemd timers** | Modern recurring jobs        | `systemctl list-timers`, `.timer` units             |

   ## Practice Exercises

   ### 🟢 Beginner

   1. Schedule a job with `at` that writes "Take a break!" into
      `/tmp/reminder.log` after 1 minute.

   2. Create a cron job that runs every 5 minutes and writes the current date
      into `/tmp/date.log`.

   ### 🟡 Intermediate

   3. Use `anacron` to run a cleanup script daily, but delay execution for 15
      minutes after boot.

   4. Write a cron job that runs only on Mondays at 9:30 AM.

   ### 🔵 Advanced

   5. Create a systemd timer that runs `echo "Systemd Rocks"` into
      `/tmp/systemd.log` every hour.

   6. Compare the execution of a cron job vs. a systemd timer — which one
      provides better logging?

### Close-up

update, and manage packages — the building blocks of your Linux environment.
Without package management, automation has nothing to run.

That’s why in the next article, we’ll dive into:
[**📦 Linux Package Management**](/blog/linux-package-management/) — exploring
apt, yum/dnf, rpm, repositories, and how to keep your system lean, secure, and
up to date.

Stay tuned — because mastering package management is your next step toward
becoming a confident Linux Admin. 🚀
