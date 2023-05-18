---
title: Notes on (Learning) Emacs
date: 2023-05-18
layout: ../../layouts/Post.astro
tags: editors
---

Emacs has a certain je ne sais quoi about it. It has this unspeakable quality that just makes it a joy to use. I have found it a breath of fresh air in the soulless era of VSCode.

I was resistant to Emacs as a vim user because I thought there was no easy way to replicate the FZF plugin for fuzzy file finding. Not only can you use FZF, IDO mode also has fuzzy search functionality that I find nicer. Additionally, working with buffers just feels so much better in Emacs than vim (better out of the box at least, anyway - which is important to me since I always run both with a relatively minimal config).

### Useful links/resources

- [Mastering Emacs](https://www.masteringemacs.org/) (Book) This book gave me the motivation to get stuck in to learning Emacs. It teaches some of the philosophy behind the design which actually provides useful insight to using Emacs on a daily basis. You can treat it as a reference but I also just spent two evenings reading it cover to cover.
- [A useful article](https://www.masteringemacs.org/article/introduction-to-ido-mode) from the Mastering Emacs website on IDO mode. An essential feature in using Emacs as a daily driver.
- [Emacs Elements](https://www.youtube.com/@emacselements) (Youtube) Covers a broad range of general and niche features and packages. The tutorials are clear and thorough.
- [A particularly good video](https://www.youtube.com/watch?v=avrrioT-mDg) on the rectangle feature, as an example.

---

### General

Things I can't be bothered to categorise properly.

| Keybind    | Description                                  | Notes                             |
|------------|----------------------------------------------|-----------------------------------|
| C-/        | Undo                                         |                                   |
| M-k        | Kill sentence                                |                                   |
| C-M-k      | Kill sexp (or balanced expr)                 |                                   |
| C-S-<bs>   | Kill current line                            | Equivalent to C-a C-k C-k         |
| M-y        | Cycle kill ring                              |                                   |
| C-o        | Insert line after point                      | Doesn't move the point            |
| M-j        | Insert line before                           | Avoids context sensitive RET      |
| C-x C-o    | Delete blank links after point               |                                   |
| C-M-o      | Split line after point                       | Unclear how this differs from C-o |
| M-^        | Join with line above                         |                                   |
| M-SPC      | Trim extra whitespace before and after point |                                   |
| M-\        | Delete whitespace around point               |                                   |
| M-i        | Insert  spaces to next tabstop               |                                   |
| M-z        | zap to char                                  | Equivalent to df in vim           |
| M-S-z      | zap up to char                               | Equivalent to dt in vim           |
| M-;        | Comment or uncomment DWIM                    |                                   |
| C-x C-;    | Comment or uncomment line                    |                                   |
| M-q        | Fill paragraph                               | Word wrapping                     |
| C-h i      | Info manual                                  |                                   |
| C-x s      | Save all files                               |                                   |
| C-M-{fb}   | Move around sexps                            |                                   |
| C-M-{ud}   | Move in and out of balanced expr             | Up/down levels/scopes             |
| C-M-{np}   | Move to next/prev balanced expr              |                                   |
| M-}        | Move to end of paragraph                     |                                   |
| M-{        | Move to start of paragraph                   |                                   |
| M-{ae}     | Move to start/end of sentence                |                                   |
| C-x C-{ul} | Upper/lower case region                      |                                   |
| M-c        | Capitalise next word                         |                                   |
| M-u        | Uppercase next word                          |                                   |
| M-l        | Lowercase next word                          |                                   |
| C-x r m    | Set a bookmark                               |                                   |
| C-x r l    | List bookmarks                               |                                   |
| C-x r b    | Jump to bookmark                             |                                   |
| C-x r s    | Store region in register                     |                                   |
| C-x r i    | Insert content of register                   |                                   |
| C-x r SPC  | Store point in register                      |                                   |
| C-x r j    | Jump to register                             | Works across files                |
| C-x 1      | Close all but current buffer                 |                                   |
| C-x 0      | Close current buffer                         |                                   |
| C-x 2      | Split horizontally                           |                                   |
| C-x 3      | Split vertically                             |                                   |
| C-x o      | Switch to other pane                         | Rebind to M-o                     |

---

### Commands
- `M-x delete-trailing-whitespace` Works on the whole buffer
- `M-x comment-box` Comment region (I think?)
- `M-x subword-mode` Treat PascalCase and camelCase as distinct words
- `M-x superword-mode` Treat snake_case as one word
- `M-x compile` Useful for running a command over and over. Use `g` in compile mode to rerun the command.
- `M-x dictionary` Self explanatory. Good for Rich Hickey aficionados.
- `M-x count-...` Various count commands.
- `M-x sort-...` Various sort commands.
- `M-x align-...` Various align commands.
- `M-: (load user-init-file)` Reload config file.
- `M-x term` Terminal. Note C-c becomes the prefix rather than C-x, e.g. C-c b to switch buffer.

---

### Searching

| Keybind    | Description                           | Notes                                                   |
|------------|---------------------------------------|---------------------------------------------------------|
| C-M-{rs}   | Regex search                          |                                                         |
| M-s r      | Toggle regex mode while searching     |                                                         |
| M-s SPC    | Lax whitespace matching in search     |                                                         |
| M-s w      | Toggle word mode while in search      | Finds words possibly separated by non-ws chars          |
| M-%        | Query search and replace              | Hard to press on Mac - rebind to C-% (or use from menu) |
| C-M-%      | Query regex search and replace        | Regex special chars must be escaped                     |
| M-{np}     | Move through search history           |                                                         |
| M-e        | Edit search string while searching    |                                                         |
| C-w        | Add word at point to search string    | While in search mode                                    |
| C-M-y      | Add char at point to search string    | While in search mode                                    |
| M-s C-e    | Add rest of line to search string     | While in search mode                                    |
| M-s (M-).  | Search symbol or thing at point       | M-. enables "thing" search                              |
| C-s C-s    | Open search and recall last query     |                                                         |
| SPC, y     | Replace match and continue            | While in query mode                                     |
| .          | Replace match and exit                | While in query mode                                     |
| ,          | Replace and stay at match             | While in query mode                                     |
| RET, q     | Exit                                  | While in query mode                                     |
| !          | Replace matches in buffer             | While in query mode                                     |
| ^          | Move to prev match                    | While in query mode                                     |
| u, U       | Undo last/all replacements            | While in query mode                                     |
| M-s o      | Find lines in buffer that match query | Like grep for your current file (M-x occur)             |
| M-g M-{np} | Jump through occur results            | While in occur mode                                     |
| e          | Occur edit mode                       | While in occur mode                                     |
| g          | Refresh results                       | While in occur mode                                     |
| C-c C-c    | Exit occur and apply changes          | While in occur mode                                     |

Note: Replace can also use elisp.

---

### Marking, Jumping

| Keybind     | Description                            | Notes                              |
|-------------|----------------------------------------|------------------------------------|
| C-v         | Move down a page                       |                                    |
| M-v         | Move up a page                         |                                    |
| C-u C-SPC   | Jump to last mark                      |                                    |
| C-SPC C-SPC | Set and deactivate mark                | Useful for jumps, like m in vim    |
| M-h         | Mark next paragraph                    | Cumulative                         |
| C-x h       | Mark whole buffer                      |                                    |
| C-M-h       | Mark next defun                        | Cumulative                         |
| M-@         | Mark next word                         | Cumulative                         |
| C-M-SPC     | Mark next sexp                         | Cumulative                         |
| M-r         | Rotate point through Top/Middle/Bottom | Equivalent to H/M/L in vim         |
| C-l         | Recentre point to Top/Middle/Bottom    | Equivalent to zz, zt(, zb?) in vim |
| M-g (M-)g   | Go to line                             |                                    |
| M-g TAB     | Go to column                           |                                    |
| M-g c       | Go to char position                    | Absolute  position in whole buffer |

---

### Rectangle Mode

Simple usage will get you pretty far here, but you can refer to the video at the top of this article for a more in-depth look.

| Keybind | Description                                   | Notes                                    |
|---------|-----------------------------------------------|------------------------------------------|
| C-x SPC | Start a rectangle region                      |                                          |
| C-x r t | Insert a string on each line of the rectangle | Mimics multiple cursors without a plugin |

---

### Macros

It's important that you don't rebind F3 and F4. Emacs elements has a good video about macros.

| Keybind | Description            | Notes |
|---------|------------------------|-------|
| F3      | Start macro            |       |
| F4      | Stop or Run macro      |       |
| C-u F3  | Append to last macro   |       |
| C-u F4  | Play 2nd macro in ring |       |
| C-x e   | Play last macro        |       |

---

### Dired

I feel like the more you get used to buffers, the better this gets. Alleviates some use of the CLI which sounds super nitpicky but honestly the more time you can spend in Emacs, the better it feels to use. All the following apply while in Dired mode. To enter dired mode, you use the keybind `C-x d` and choose a directory.

| Keybind | Description          | Notes                                 |
|---------|----------------------|---------------------------------------|
| ^       | Go up dir            |                                       |
| q       | Quit                 |                                       |
| n, p    | Next, prev           |                                       |
| m       | Mark                 |                                       |
| u       | Unmark               |                                       |
| U       | Unmark all           |                                       |
| d       | Flag for delete      |                                       |
| * m     | Mark region          |                                       |
| * u     | Unmark region        |                                       |
| * %     | Mark by regex        |                                       |
| * .     | Mark by ext          |                                       |
| t, * t  | Toggle mark          |                                       |
| * c     | Change mark          |                                       |
| C       | Copy files           |                                       |
| R       | Rename or move       |                                       |
| O       | Change owner         |                                       |
| M       | Change permissions   |                                       |
| D       | Deletes marked       |                                       |
| x       | Deletes flagged      |                                       |
| c       | Compress             | [1]                                   |
| g       | Refresh              |                                       |
| +       | Create subdir        |                                       |
| s       | Toggle sort          |                                       |
| <, >    | Jump through dirs    |                                       |
| j       | Jump to file         |                                       |
| F, RET  | Open file            |                                       |
| C-u F   | Open in bg           |                                       |
| Q       | Call C-M-% on marked | Query regex replace (save with C-x s) |

[1] I rebind this to `dired-create-empty-file` which I think requires Emacs 28+. It works like `touch`.
