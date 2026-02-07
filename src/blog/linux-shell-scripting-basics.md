---
title: "Beginner's Guide to Shell Scripting Basics in Linux"
description: "Shell scripting is one of the most powerful skills you can learn in Linux. It allows you to automate repetitive tasks, build simple tools, and combine commands into workflows. Whether you’re an aspiri"
date: 2025-09-22
tags:
  - Linux
  - Automation
---

Shell scripting is one of the most powerful skills you can learn in Linux. It
allows you to **automate repetitive tasks**, build simple tools, and combine
commands into workflows. Whether you’re an aspiring system administrator or
DevOps engineer, shell scripting is a must-have skill.

## What is a Shell Script?

A **shell script** is simply a text file that contains Linux commands executed
in sequence by a shell (like `bash`, `zsh`, or `sh`).

Think of it as saving a series of terminal commands into a file so you can run
them all at once.

## Creating Your First Script

1. Create a new file:

   ```bash
   nano hello.sh
   ```

2. Add the following content:

   ```bash
   #!/bin/bash
   echo "Hello, World!"
   ```

   ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1758521710888/8171c72b-f741-4701-a91a-94463d036566.png)

3. Save and exit.

4. Make it executable:

   ```bash
   chmod +x hello.sh
   ```

5. Run it:

   ```bash
   ./hello.sh
   ```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1758521771838/d6faf2d2-de2d-46e9-a367-51dbdb0a1a1a.png)

## Variables in Shell Scripts

Variables let you store and reuse values.

```bash
#!/bin/bash
name="Marwan"
echo "Hello, $name!"
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1758521880714/c474ab53-b834-4213-95b2-29d952f4a748.png)

Output:

```bash
Hello, Marwan!
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1758521866033/d65dea0a-ab8f-47ef-b9fb-3a90d27871de.png)

## Conditional Statements

Use `if` statements to add logic:

```bash
#!/bin/bash
if [ -f "/etc/passwd" ]; then
    echo "File exists."
else
    echo "File does not exist."
fi
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1758523640950/ffa32597-004a-4462-985e-5951169022ab.png)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1758523652283/ada038b7-c28d-4d0c-9c12-85c739ab10e3.png)

## Loops

Loops let you repeat tasks automatically.

### For Loop Example:

```bash
#!/bin/bash
for i in 1 2 3 4 5
do
   echo "Number: $i"
done
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1758523695962/a21c06e1-7f34-4257-b5d9-7a2568a9ca1c.png)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1758523724079/916dc554-1bdf-4c31-90ab-fc698cb7cda4.png)

### While Loop Example:

```bash
#!/bin/bash
count=1
while [ $count -le 5 ]
do
   echo "Count: $count"
   count=$((count + 1))
done
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1758523770304/1e0a8066-3d00-42f4-986a-f071a9aa13d3.png)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1758523803434/1f7c1ce2-1f04-4424-83a5-6159e81c076b.png)

## Functions

Functions make scripts reusable and modular.

```bash
#!/bin/bash
greet() {
    echo "Hello, $1!"
}
greet "Linux User"
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1758523831613/c741a068-5906-4f7b-9528-97db074b727c.png)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1758523852554/e1bb985d-3741-487a-89b6-69dd42438d06.png)

## Useful Commands in Scripts

- `date` → Print current date and time

- `uptime` → Show system uptime

- `df -h` → Disk usage

- `free -m` → Memory usage

- `ps aux` → Running processes

These can all be combined into scripts for automation.

## Hands-on Labs

Here are **9 labs** to practice, sorted by difficulty.

### 🟢 Beginner Labs (Basic Scripting Skills)

**Lab 1: Greeting Script**

- Ask for the user’s name (`read name`) and print:

  ```bash
  Hello, <name>! Welcome to Linux.
  ```

✅ Goal: Learn input, variables, and echo.

**Lab 2: Simple Calculator**

- Write a script that takes two numbers as input and prints their sum.\
  Hint: Use `read` and arithmetic `$(( ))`.\
  ✅ Goal: Practice input and basic math.

**Lab 3: Even or Odd Checker**

- Ask for a number.

- Print whether it’s even or odd.\
  Hint: Use modulus operator `%`.\
  ✅ Goal: Practice conditionals.

### 🟡 Intermediate Labs (Automation & File Handling)

**Lab 4: Backup a Directory**

- Takes a directory as input.

- Creates a `.tar.gz` backup with today’s date.

- Saves it in `/tmp/backups/`.\
  ✅ Goal: Automate backups.

**Lab 5: Log File Cleaner**

- Find and delete all `.log` files older than 7 days in `/var/log/`.\
  Hint: Use `find /var/log -name "*.log" -mtime +7 -delete`.\
  ✅ Goal: Automate system housekeeping.

**Lab 6: User Creation Script**

- Ask for a username.

- Create the user and set a default password.

- Add them to the `developers` group.\
  ✅ Goal: Automate sysadmin tasks.

### 🔴 Advanced Labs (Reusable Tools & System Monitoring)

**Lab 7: System Health Report**

- Print:

  - Current date & time (`date`)

  - Uptime (`uptime`)

  - Disk usage (`df -h`)

  - Memory usage (`free -m`)

  - Top 5 processes (`ps aux --sort=-%mem | head -n 6`)\
    ✅ Goal: Build a reusable admin tool.

**Lab 8: Network Connectivity Checker**

- Read a list of hostnames from a file.

- Loop through and `ping` each one.

- Print which hosts are up and which are down.\
  ✅ Goal: Practice loops + conditionals with real networking.

**Lab 9: Automated Service Monitor**

- Check if `nginx` or `apache2` is running.

- If not, restart it and log the event to `/var/log/service_monitor.log`.\
  ✅ Goal: Automate monitoring & recovery.

## Conclusion

With these labs, you’ll progress from simple **echo scripts** to building
**real-world automation tools**. Shell scripting is a skill that grows with you:
the more you practice, the more powerful your Linux workflows become.

---

# Practice Pack Script

Here’s the [`linux-shell-labs.sh`](http://linux-shell-labs.sh) file (all 9 labs
with comments):

```bash
#!/bin/bash
# Linux Shell Scripting Labs
# Run: chmod +x linux-shell-labs.sh && ./linux-shell-labs.sh

######################
# Beginner Labs
######################

# Lab 1: Greeting Script
greeting_lab() {
    read -p "Enter your name: " name
    echo "Hello, $name! Welcome to Linux."
}

# Lab 2: Simple Calculator
calculator_lab() {
    read -p "Enter first number: " a
    read -p "Enter second number: " b
    echo "Sum: $((a + b))"
}

# Lab 3: Even or Odd Checker
evenodd_lab() {
    read -p "Enter a number: " num
    if [ $((num % 2)) -eq 0 ]; then
        echo "$num is even."
    else
        echo "$num is odd."
    fi
}

######################
# Intermediate Labs
######################

# Lab 4: Backup a Directory
backup_lab() {
    read -p "Enter directory to backup: " dir
    mkdir -p /tmp/backups
    tar -czvf "/tmp/backups/backup-$(date +%Y%m%d).tar.gz" "$dir"
    echo "Backup created in /tmp/backups/"
}

# Lab 5: Log File Cleaner
logclean_lab() {
    echo "Cleaning log files older than 7 days..."
    find /var/log -name "*.log" -mtime +7 -exec rm {} \;
    echo "Old log files cleaned."
}

# Lab 6: User Creation Script
usercreate_lab() {
    read -p "Enter username: " user
    sudo useradd -m "$user"
    echo "$user:password123" | sudo chpasswd
    sudo usermod -aG developers "$user"
    echo "User $user created and added to developers group."
}

######################
# Advanced Labs
######################

# Lab 7: System Health Report
sysreport_lab() {
    echo "=== System Health Report ==="
    echo "Date: $(date)"
    echo "Uptime: $(uptime)"
    echo ""
    echo "=== Disk Usage ==="
    df -h
    echo ""
    echo "=== Memory Usage ==="
    free -m
    echo ""
    echo "=== Top 5 Processes ==="
    ps aux --sort=-%mem | head -n 6
}

# Lab 8: Network Connectivity Checker
netcheck_lab() {
    hosts=("google.com" "github.com" "localhost")
    for host in "${hosts[@]}"; do
        if ping -c 1 "$host" &> /dev/null; then
            echo "$host is UP"
        else
            echo "$host is DOWN"
        fi
    done
}

# Lab 9: Automated Service Monitor
servicemon_lab() {
    service="nginx"
    if ! systemctl is-active --quiet "$service"; then
        echo "$service is not running. Restarting..."
        sudo systemctl restart "$service"
        echo "$(date): Restarted $service" >> /var/log/service_monitor.log
    else
        echo "$service is running."
    fi
}

######################
# Menu
######################
while true; do
    echo -e "\nChoose a Lab to Run:
    1) Greeting
    2) Calculator
    3) Even/Odd
    4) Backup Directory
    5) Log Cleaner
    6) User Creation
    7) System Report
    8) Network Check
    9) Service Monitor
    0) Exit"
    read -p "Enter choice: " choice
    case $choice in
        1) greeting_lab ;;
        2) calculator_lab ;;
        3) evenodd_lab ;;
        4) backup_lab ;;
        5) logclean_lab ;;
        6) usercreate_lab ;;
        7) sysreport_lab ;;
        8) netcheck_lab ;;
        9) servicemon_lab ;;
        0) exit ;;
        *) echo "Invalid choice" ;;
    esac
done
```
