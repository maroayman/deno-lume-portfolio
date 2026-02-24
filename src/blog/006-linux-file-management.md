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

## 3\. Creating Files and Folders

- I created a folder called "practice" in the home directory using
  `mkdir practice` and then entered it to run all the commands for this section.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757039181087/b0a47765-31b7-4b43-901c-0905025e3f39.png)

- Create empty file:

  ```bash
  touch notes.txt
  ```

  ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757039236375/8c68a430-43e0-408a-8e84-cd7e697156e1.png)

- Create a directory: (You'll notice that directories are colored in blue)

  ```bash
  mkdir projects
  ```

  ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757039262879/2f3e752c-0fbb-41bd-af79-4a14476b37a6.png)

- Create nested directories:

  ```bash
  mkdir -p projects/app/src
  ```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757039262879/2f3e752c-0fbb-41bd-af79-4a14476b37a6.png)

- You can see how in both lines we check the first nested directory, and then in
  the next line, we check another nested one inside `projects/app`.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757039423240/ed16efdc-5aa8-4044-8088-38bdcc2dbe1b.png)

## 4\. Copying and Moving Files

- Copy file:

  ```bash
  cp notes.txt notes2.txt
  ```

  ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757039576750/d4cfb503-edfb-4568-a607-991c9aea4176.png)

  - Copy directory

    ```bash
    cp -r projects projects2/
    ```

  ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757039667279/7889226c-7bf9-45ba-8271-307c46a741d5.png)

  - Move file:

    ```bash
    mv notes.txt projects/
    ```

    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757040362059/9310e688-f5f8-4eaf-ada9-bbbe0083bbf0.png)

  - Rename file:

    ```bash
    mv notes2.txt notes3.txt
    ```

    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757040499265/de37ae32-788a-44c4-b446-5c9c533643c0.png)

    ## 5\. Deleting Files and Directories

    - Delete file:

      ```bash
      rm notes.txt
      ```

      ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757040690664/c9c4d3b1-64d2-44e6-b4d5-80167ce93167.png)

    - Delete multiple files:

      ```bash
      rm notes2.txt notes3.txt
      ```

      ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757040734073/8f2caa4a-1828-4ba7-8cde-ac6fd3a1b639.png)

    - Delete directory (recursively):

      ```bash
      rm -r projects2/
      ```

      ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757040766844/3a1fe507-1772-44e1-95a2-d80819d2a386.png)

    - Safer delete with confirmation:\
      You can confirm your choice by typing either (Yes/No) or (Y/N).

      ```bash
      rm -i notes1.txt
      ```

      ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757040908300/89548b16-ded5-42cc-9096-a3ce71e3c5c6.png)

> ⚠️ Warning: Be careful with rm -rf /. It can wipe your system.

## 6\. Viewing File Contents

- Show whole file: `cat notes.txt`

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757041147347/29760cba-1ae7-41cb-9cd8-0e35af80e4bd.png)

- Scroll through: `less notes.txt`

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757041217722/7e751882-a391-4448-a515-4ed4318b8f3c.png)

- Show the top lines: `head -n 10 notes.txt` (you can replace 10 with the number
  of lines you want from the top)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757041249294/d180f911-e07b-4022-8217-f2a53704d154.png)

- Show bottom lines: `tail -n 10 notes.txt`

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757041299846/46b98a5e-a6b4-4c7f-b25b-2a9ca6115cce.png)

- Follow logs in real time:

  ```bash
  tail -f /var/log/syslog
  ```

  ## 7.1 File Globbing & Wildcards

I have prepared a directory to apply our new practices on file globbing and
wildcards. Follow the steps in the next screenshots and instructions.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757041740143/ed79af16-1a94-4cd2-965b-e35efbdbbdf9.png)

### 1\. Copy all .txt files into a folder

```bash
mkdir texts
cp *.txt texts/
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757041870168/a960d78a-3892-4c1a-9c46-9d5dbee5ce05.png)

### 2\. Move only report1.pdf and report2.pdf

```bash
mkdir reports
mv report[1-2].pdf reports/
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757042029659/3ff7053f-3bdc-4fd9-82c0-0247c6053dbf.png)

### 3\. Delete only January–June backups

```bash
rm backup_2023-0[1-6]*.tar.gz
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757042433267/c3c70251-d9d6-4f92-8541-1c5cdb13eded.png)

> 💡 **In this specific command, the** `*` **acts as a wildcard to match any
> characters that might appear after** `2023-0[1-6]` **and before** `.tar.gz`
> **.**

### 4\. View only image files starting with "image"

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757043180942/a7c20aa4-69ce-44ed-9e51-02c803290ab6.png)

### 5\. Concatenate text files into one

```bash
cat file?.txt > combined.txt
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757043405195/5b6d4405-e692-4623-bd6b-e87406a3e70b.png)

### 6\. Tar archive all PDF reports

```bash
tar -czf reports.tar.gz report*.pdf
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757043492581/2e39992a-9370-4a9e-99bd-826f1ec681a8.png)

- ## 7.2 File Globbing & Wildcards

Once you’re comfortable with the basics, here are some **real-world use cases**
where globbing saves tons of time:

```bash
# 1. Filter files by extension
ls *.pdf
ls *.jpg

# 2. Select files with a specific ending
ls *final.jpg      # only matches image_final.jpg

# 3. Exclude hidden files
ls *               # shows all files, but not dotfiles (like .bashrc)

# 4. Batch rename files (prefix all .txt files)
for f in *.txt; do mv "$f" "old_$f"; done
# file1.txt → old_file1.txt

# 5. Copy multiple types at once
cp *. media/

# 6. Match files with character ranges
ls file[0-9].txt   # matches file1.txt, file2.txt (but not file10.txt)

# 7. View rotated log files
ls /var/log/syslog*   # syslog, syslog.1, syslog.2.gz ...

# 8. Backup important configs with brace expansion
cp /etc/ ~/configs/
```

# **Real-World DevOps Examples**

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

## 8\. Hidden Files & Dotfiles

- Files starting with `.` are hidden by default.

- Example: `.bashrc`, `.gitignore`, `.ssh/config`.

- Show them with:

  ```bash
  ls -a
  ```

> 💡 Hidden files usually store configurations.

## 9\. Absolute vs Relative Paths

- **Absolute path** → starts from `/` (root) — replace the placeholder with your
  username

  ```bash
  cd /home/<your-username>/projects
  ```

  ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757044032897/ba69b41b-8e59-49d5-bf2d-98bd31eb75a5.png)

- **Relative path** → relative to your current directory

  ```bash
  cd ../projects
  ```

  ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757044169091/f7ecd48b-52ca-40b4-b2f9-1f835a5f0c7d.png)

💡 **Pro Tip:** Use `~` for your home directory:

```bash
cd ~/Downloads # Replace Downloads with any folder your have in username home folder.
```

## 10\. Links

- **Hard link**: another name for the same file

  ```bash
  ln file.txt file_hard.txt 
  # Replace file.txt with the original filename / Replace file_hard.txt with the new link name.
  ```

  ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757045034250/50c3e70e-77d4-45a4-baad-598eee68250a.png)

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

  ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757045349927/0914e61e-6931-4534-8442-5184147a34cc.png)

  ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1757045393157/3ec6a293-2d0f-4750-8e17-88b9ace07c01.png)

  - 1 - We use soft links with files.

  - 2 - We use soft links with directories.

- Check links with:

  ```bash
  ls -l
  ```

## 11\. Practice Challenge

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

# Linux Globbing Cheat Sheet

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
