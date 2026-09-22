---
title: "Linux File Management Made Simple: How to Copy, Move, Delete, and Organize"
description: "Introduction So far in this series, you’ve:  Explored the Linux filesystem layout  Learned about permissions and ownership   Now it’s time to roll up your sleeves and actually work with files and dire"
date: 2025-09-05
tags:
  - Linux
---

## Introduction

So far in this series, you’ve:

- [Explored the Linux filesystem layout](/blog/004-linux-filesystem-overview)

- [Learned about permissions and ownership](/blog/005-linux-file-permissions)

Now it’s time to roll up your sleeves and actually **work with files and
directories**. This is where Linux becomes fun — and powerful.

## Navigating Files and Directories (short recap)

- `pwd` → print working directory

- `ls` → list files

- `ls -l` → list with details

- `ls -a` → show hidden files

- `cd folder_name` → change directory

**Pro Tip:** Use `cd -` to jump back to your previous directory.

## Creating Files and Folders

- I created a folder called "practice" in the home directory using
  `mkdir practice` and then entered it to run all the commands for this section.

![](/images/006-linux-file-management/image01.png)

- Create empty file:

  ```bash
  touch notes.txt
  ```

  ![](/images/006-linux-file-management/image02.png)

- Create a directory: (You'll notice that directories are colored in blue)

  ```bash
  mkdir projects
  ```

  ![](/images/006-linux-file-management/image03.png)

- Create nested directories:

  ```bash
  mkdir -p projects/app/src
  ```

![](/images/006-linux-file-management/image03.png)

- You can see how in both lines we check the first nested directory, and then in
  the next line, we check another nested one inside `projects/app`.

![](/images/006-linux-file-management/image04.png)

## Copying and Moving Files

- Copy file:

  ```bash
  cp notes.txt notes2.txt
  ```

  ![](/images/006-linux-file-management/image05.png)

  - Copy directory

    ```bash
    cp -r projects projects2/
    ```

  ![](/images/006-linux-file-management/image06.png)

  - Move file:

    ```bash
    mv notes.txt projects/
    ```

    ![](/images/006-linux-file-management/image07.png)

  - Rename file:

    ```bash
    mv notes2.txt notes3.txt
    ```

    ![](/images/006-linux-file-management/image08.png)

## Deleting Files and Directories

    - Delete file:

      ```bash
      rm notes.txt
      ```

      ![](/images/006-linux-file-management/image09.png)

    - Delete multiple files:

      ```bash
      rm notes2.txt notes3.txt
      ```

      ![](/images/006-linux-file-management/image10.png)

    - Delete directory (recursively):

      ```bash
      rm -r projects2/
      ```

      ![](/images/006-linux-file-management/image11.png)

    - Safer delete with confirmation:\
      You can confirm your choice by typing either (Yes/No) or (Y/N).

      ```bash
      rm -i notes1.txt
      ```

      ![](/images/006-linux-file-management/image12.png)

> ⚠️ Warning: Be careful with rm -rf /. It can wipe your system.

## Viewing File Contents

- Show whole file: `cat notes.txt`

![](/images/006-linux-file-management/image13.png)

- Scroll through: `less notes.txt`

![](/images/006-linux-file-management/image14.png)

- Show the top lines: `head -n 10 notes.txt` (you can replace 10 with the number
  of lines you want from the top)

![](/images/006-linux-file-management/image15.png)

- Show bottom lines: `tail -n 10 notes.txt`

![](/images/006-linux-file-management/image16.png)

- Follow logs in real time:

  ```bash
  tail -f /var/log/syslog
  ```

## File Globbing & Wildcards

I have prepared a directory to apply our new practices on file globbing and
wildcards. Follow the steps in the next screenshots and instructions.

![](/images/006-linux-file-management/image17.png)

### Copy all .txt files into a folder

```bash
mkdir texts
cp *.txt texts/
```

![](/images/006-linux-file-management/image18.png)

### Move only report1.pdf and report2.pdf

```bash
mkdir reports
mv report[1-2].pdf reports/
```

![](/images/006-linux-file-management/image19.png)

### Delete only January–June backups

```bash
rm backup_2023-0[1-6]*.tar.gz
```

![](/images/006-linux-file-management/image20.png)

> 💡 **In this specific command, the** `*` **acts as a wildcard to match any
> characters that might appear after** `2023-0[1-6]` **and before** `.tar.gz`
> **.**

### View only image files starting with "image"

![](/images/006-linux-file-management/image21.png)

### Concatenate text files into one

```bash
cat file?.txt > combined.txt
```

![](/images/006-linux-file-management/image22.png)

### Tar archive all PDF reports

```bash
tar -czf reports.tar.gz report*.pdf
```

![](/images/006-linux-file-management/image23.png)

Once you're comfortable with the basics, here are some **real-world use cases**
where globbing saves tons of time:

```bash
# Filter files by extension
ls *.pdf
ls *.jpg

# Select files with a specific ending
ls *final.jpg      # only matches image_final.jpg

# Exclude hidden files
ls *               # shows all files, but not dotfiles (like .bashrc)

# Batch rename files (prefix all .txt files)
for f in *.txt; do mv "$f" "old_$f"; done
# file1.txt → old_file1.txt

# Copy multiple types at once
cp *. media/

# Match files with character ranges
ls file[0-9].txt   # matches file1.txt, file2.txt (but not file10.txt)

# View rotated log files
ls /var/log/syslog*   # syslog, syslog.1, syslog.2.gz ...

# Backup important configs with brace expansion
cp /etc/ ~/configs/
```

### Real-World DevOps Examples

- Archive all logs:

  ```bash
  tar -czf logs.tar.gz *.log
  ```

- Remove old backup files:

  ```bash
  rm backup_2023-0[1-6]*.tar.gz
  ```

- Copy multiple configs at once:

  ```bash
  cp /etc/ ~/configs/
  ```

### 🏆 Mini Challenge

Try these on your own:

- Rename all `.jpg` files by prefixing them with `img_`.

- Copy all `.pdf` and `.doc` files into a new folder called `documents/`.

- Delete all backup files except the ones from July onward.

## Hidden Files & Dotfiles

- Files starting with `.` are hidden by default.

- Example: `.bashrc`, `.gitignore`, `.ssh/config`.

- Show them with:

  ```bash
  ls -a
  ```

> 💡 Hidden files usually store configurations.

## Absolute vs Relative Paths

- **Absolute path** → starts from `/` (root) — replace the placeholder with your
  username

  ```bash
  cd /home/<your-username>/projects
  ```

  ![](/images/006-linux-file-management/image24.png)

- **Relative path** → relative to your current directory

  ```bash
  cd ../projects
  ```

  ![](/images/006-linux-file-management/image25.png)

💡 **Pro Tip:** Use `~` for your home directory:

```bash
cd ~/Downloads # Replace Downloads with any folder your have in username home folder.
```

## Links

- **Hard link**: another name for the same file

  ```bash
  ln file.txt file_hard.txt 
  # Replace file.txt with the original filename / Replace file_hard.txt with the new link name.
  ```

  ![](/images/006-linux-file-management/image26.png)

- **Identical:** The hard link is indistinguishable from the original file. Both
  have the same size, permissions, and owner, and both point to the same data.

- **Durability:** If you delete the original file, the hard link remains valid
  because it's pointing to the data itself, not the file's name. The data is
  only truly deleted when the last hard link to its inode is removed.

- **Limitations:** Hard links cannot link to directories to prevent recursive
  loops, and they cannot cross different file systems or partitions.

- **Soft link (symlink)**: shortcut to another file

  ```bash
  ln -s /var/log/syslog syslog_link # It can work with files and directories!
  ```

  ![](/images/006-linux-file-management/image27.png)

  ![](/images/006-linux-file-management/image28.png)

  - 1 - We use soft links with files.

  - 2 - We use soft links with directories.

- Check links with:

  ```bash
  ls -l
  ```

## Practice Challenge

- Create a `playground/` directory

- Inside it, create 3 text files and 2 folders

- Copy the files into one folder

- Move one file to another folder

- Delete one folder with its contents

- Use wildcards to list only `.txt` files

- Bonus: Create a symlink to one of the file

## Wrap-Up & Next Steps

File management is the **backbone of everyday Linux work**. You now know how to
create, move, copy, and delete files, explore contents, and even use wildcards
to handle many files at once.

In the next article, we’ll go one step further:
[**Installing and Managing
Software (apt, yum, dnf)**](/blog/007-linux-package-management) — the gateway to
customizing your Linux system.

> _"Mastering files is mastering Linux. Every pro started here — and so have
> you."_

## Linux Globbing Cheat Sheet

| Pattern           | Matches Example                                                  |
| ----------------- | ---------------------------------------------------------------- |
| `*`               | Any number of characters → `*.txt` → `file.txt`, `notes.txt`     |
| `?`               | Single character → `file?.txt` → `file1.txt`, `fileA.txt`        |
| `[abc]`           | Any one character in set → `file[123].txt` → `file1.txt`         |
| `[a-z]`           | Range of characters → `file[a-c].txt` → `filea.txt`, `fileb.txt` |
| ``                | Alternatives → `*.` → `photo.jpg`, `image.png`                   |
| `!` (inside `[]`) | Negation → `file[!0-9].txt` → matches letters, not numbers       |

> 👉 You can follow this series through this customized link:
> [Linux Series](https://maroayman.hashnode.dev/series/linux-for-beginners)
