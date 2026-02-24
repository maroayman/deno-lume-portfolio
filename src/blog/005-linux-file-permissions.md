---
title: "Understanding Linux File Permissions and Ownership: A Complete Guide for Beginners to Experts"
description: "Understanding Linux File Ownership and Permissions: A Beginner’s Guide In the previous article we explored the Linux filesystem hierarchy and got familiar with its structure.Now, let’s unlock a powerful concept: who can access what in Linux."
date: 2025-09-02
tags:
  - Linux
  - Security
---

# Understanding Linux File Ownership and Permissions: A Beginner’s Guide

In the [previous article](/blog/005-linux-file-permissions) we explored the
**Linux filesystem hierarchy** and got familiar with its structure.\
Now, let’s unlock a powerful concept: **who can access what** in Linux.

Mastering ownership and permissions is key to becoming confident in Linux — it’s
the foundation of security and system administration.

## Why Permissions Matter?

In Linux, **everything is a file** — programs, devices, directories, even your
keyboard input.\
Permissions are how Linux controls **who can read, write, or execute** these
files.\
This ensures:

- Users don’t accidentally break system files.

- Sensitive data is protected.

- Multiple users can safely share one machine.

## Understanding Ownership

Every file and directory in Linux has **two owners**:

1. **User (Owner):** The user account that owns the file.

2. **Group:** A collection of users who share permissions.

Let’s see ownership in action:

```bash
ls -l
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1756780254658/29d56cde-972e-4680-a006-81e5fc7f36f7.png)

## Understanding Permissions

Permissions are shown in **three sets of three** characters:

```bash
-rw-r--r--
```

Let’s break this down:

| Position | Who It Applies To | Meaning Here    |
| -------- | ----------------- | --------------- |
| `rw-`    | User/Owner        | Can read, write |
| `r--`    | Group             | Can read only   |
| `r--`    | Others            | Can read only   |

Each permission has a letter:

- `r` = read

- `w` = write

- `x` = execute (run as a program)

The first `-` means it’s a **file** (it would be `d` for directory).

## Changing Permissions

### Using `chmod`

`chmod` lets you modify permissions.

Grant execute permission to the user:

```bash
chmod u+x script.sh
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1756780715788/43fafdd6-efe7-404f-88c6-b39e7c7ccfd3.png)

In the previous example, we used the command on the `notes.txt` file. You can
see that the file name changed color to green, indicating it is now executable.
It's recommended to use this command when running your bash script that ends
with .sh.

Add write permission for group:

```bash
chmod g-w notes.txt
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1756781269787/2e81bab6-7bfd-491b-9750-559a4e08eef0.png)

You can see how the write permission is removed from the group in the second
photo.

### Numeric (Octal) Mode

Permissions can also be set with numbers:

- `r = 4`, `w = 2`, `x = 1`

- Add them up for each set.

Example:

```bash
chmod 755 script.sh
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1756781420561/861130e4-491d-4f5b-b6ed-09e91d530ee0.png)

Breakdown:

| User | Group | Others |
| ---- | ----- | ------ |
| 7    | 5     | 5      |
| rwx  | r-x   | r-x    |

## Changing Ownership

Use `chown` to change the **owner**:

```bash
sudo chown alice notes.txt
```

Change both user and group:

```bash
sudo chown alice:devs notes.txt
```

## Quick Reference Table

| Symbolic | Numeric | Meaning                |
| -------- | ------- | ---------------------- |
| `r--`    | 4       | Read                   |
| `-w-`    | 2       | Write                  |
| `--x`    | 1       | Execute                |
| `rw-`    | 6       | Read + Write           |
| `r-x`    | 5       | Read + Execute         |
| `rwx`    | 7       | Read + Write + Execute |

## Visualizing Permissions

```bash
[ File Type ] [ User ] [ Group ] [ Others ]
     -         rw-       r--       r--
```

## Understanding `umask` (Default Permissions)

So far, you’ve learned how to view and modify permissions, but did you know
**new files and directories don’t start with random permissions**?\
Linux uses a setting called `umask` (user file-creation mode mask) to determine
**default permissions**.

#### 🔹 How `umask` works:

- New files start with `666` (read and write for everyone) **minus** the
  `umask`.

- New directories start with `777` (read, write, execute for everyone) **minus**
  the `umask`.

Example:

| `umask` Value | File Permissions | Directory Permissions | Meaning                             |
| ------------- | ---------------- | --------------------- | ----------------------------------- |
| 0000          | 666              | 777                   | Full access for everyone (not safe) |
| 0022          | 644              | 755                   | Owner can write, others read only   |
| 0077          | 600              | 700                   | Owner only, very secure             |

You can view an example of umask in the shell screenshot, which illustrates how
default permissions are applied to new files and directories based on the umask
value.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1756782933815/f215fbef-bc9e-4e23-a119-bb154361a069.png)

> **Trivia: Why Files Start at** `666` and Directories at `777`
>
> Linux starts with **full permissions**:
>
> - Files: `666` → everyone can read/write
> - Directories: `777` → everyone can read/write/enter
>
> Then `umask` **subtracts** permissions:
>
> ```bash
> # With umask 022
> Files: 666 - 022 = 644  (owner can write, others read-only)
> Dirs:  777 - 022 = 755  (owner can write, others can read & enter)
> ```
>
> **You may wonder why:**
>
> - Files don’t get `x` (execute) by default because not all files are programs.
> - Directories need `x` to let you **cd into them**.

## Practice Challenge

1. Create a new directory to experiment in.

2. Inside it, create a sample text file.

3. Check its permissions using `ls -l`.

4. Change the file permissions to allow only the owner to read and write.

5. Change the permissions again to make it readable and executable by everyone.

6. Use `ls -l` after each change to see the effect.

7. Change the file’s ownership to your user and group.

8. Reflect on how permissions and ownership control access to files.

## Tips to Remember

- Always use `ls -l` to check permissions before editing files.

- Use `sudo` carefully; it bypasses normal permission checks.

- Scripts must be **executable** (`chmod +x`) to run directly.

## What’s Next in Your Linux Journey

The goal here is to **get comfortable navigating your system** and start
recognizing patterns.\
Don’t worry about understanding every permission combination just yet — we’ll
revisit and build on this knowledge as you use Linux more.

You’ve now unlocked a **key concept of Linux security** by learning file
permissions and ownership.

## Up Next: Linux File Management

Now that you understand **permissions and ownership**, you're ready to learn
how to work with files and directories.

In the next article, we'll cover:

- [How to copy, move, delete, and organize files](/blog/linux-file-management)

- Using `yum` (CentOS) and `apt` (Ubuntu)

- Tips to manage packages like a pro

By the end of the next article, you'll be able to **customize and manage your
Linux environment with confidence**.

📢 **Want to follow the full series?**\
Subscribe to my Hashnode and never miss a step in your Linux learning journey!
