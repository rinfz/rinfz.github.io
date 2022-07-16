---
title: Collatz conjecture in x86
date: 2019-11-06
layout: ../../layouts/Post.astro
tags: programming, asm
---

Been following an [introduction to assembly](https://gitlab.com/mcmfb/intro_x86-64) and one of the exercises was to implement a collatz conjecture function.

My first attempt is as follows (with the arg x chosen at random):

```asm
global _start

section .text
_start:
  mov rdi, 156 ; x
  call collatz

  mov rdi, rax
  mov rax, 60
  syscall

; uint collatz(uint x)
collatz:
  xor rcx, rcx ; result
.loop:
  cmp rdi, 1
  je .done

  inc rcx

  ; x % 2
  mov rax, rdi
  xor rdx, rdx
  mov rbx, 2
  div rbx

  cmp rdx, 0 ; even
  jne .odd
  mov rdi, rax ; x = x / 2
  jmp .loop
.odd:
  mov rax, rdi
  mov r8, 3
  mul r8 ; 3*x
  inc rax ; x + 1
  mov rdi, rax
  jmp .loop

.done:
  mov rax, rcx
  ret
```

Then I wrote it in C++ and checked the [godbolt output](https://godbolt.org/z/3gy0-M) to see if I could make any improvements.

Firstly I noticed that it uses a shift instead of a divide (since we always divide by 2) so the 4 instructions needed for that can be switched:

```asm
; Before
mov rax, rdi
xor rdx, rdx
mov rbx, 2
div rbx

; After
shr rax, 1
```

That then means the cmp we do after the div in the initial version can be changed to a bitwise and to determine if x is even before we do the shift, followed by a test to see if the and resulted in 0.

Finally gcc doesn't use mul so we switch a mov and mul for two adds (presumably lower cycle count? cleaner on the registers at least).

So the end result is the following:

```asm
global _start
section .text
_start:
    mov rdi, 156
    call collatz
    mov rdi, rax
    mov rax, 60
    syscall
collatz:
    xor rcx, rcx
.loop:
    cmp rdi, 1
    je .done
    inc rcx
    mov rax, rdi
    and rax, 1    ; ┐
    test rax, rax ; ┴ x % 2 == 0
    jne .odd
    mov rax, rdi
    shr rax, 1    ;   x /= 2
    mov rdi, rax
    jmp .loop
.odd:
    mov rax, rdi  ; ┐
    add rax, rax  ; │
    add rax, rdi  ; │
    add rax, 1    ; ┴ 3*x + 1
    mov rdi, rax
    jmp .loop
.done:
    mov rax, rcx
    ret
```
