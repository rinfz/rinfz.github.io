---
title: Rust struct FFI and Python
date: 2019-10-17
layout: ../../layouts/Post.astro
tags: programming, rust, python
---

Given a basic struct:

```rust
pub struct Point {
  x: i32,
  y: i32,
}
```

If you want to use FFI and call this from, say, Python, you can't take Point parameters in functions by reference because it will segfault.

Therefore you have to make use of `*const` and `*mut` for read-only and in/out parameters respectively.

To make the struct eligible for FFI, we whack a `#[repr(C)]` on it. For the purposes of this example, I will just overload the + operator ([ripped straight from the docs](https://doc.rust-lang.org/std/ops/trait.Add.html)).

```rust
impl std::ops::Add for Point {
  type Output = Self;

  fn add(self, other: Self) -> Self {
      Self {
          x: self.x + other.x,
          y: self.y + other.y,
      }
  }
}
```

Note: this also means we stick `#[derive(Clone, Copy)]` on our Point struct.

I have been separating my FFI interface from the normal rust code as I am working on a dual-purpose codebase where we don't need to export everything so it's nice to keep the public API separate. So just put all the FFI functions in a `mod ffi` similar to how you would separate tests while keeping them in the same file.

```rust
mod ffi {
  use super::Point;

  #[no_mangle]
  pub extern "C" fn add_points(a: *const Point, b: *const Point) -> Point {
      unsafe { *a + *b }
  }

  #[no_mangle]
  pub extern "C" fn add_points_inplace(a: *mut Point, b: *const Point) {
      unsafe {
          (*a).x += (*b).x;
          (*a).y += (*b).y;
      }
  }
}
```

The first example takes two immutable Points and returns a new Point to the caller. We have to use `unsafe` as we are dereferencing the points within the function body. This is nice and succinct.

The second example modifies the first parameter in place by taking it as a mutable pointer. No overload here as we don't want to create a new Point.

Now on the python side of things, we setup using ctypes.

```python
from ctypes import *

class Point(Structure):
    _fields_ = [("x", c_int), ("y", c_int)]

    def __str__(self):
        return f"Point(x={self.x}, y={self.y})"


lib = cdll.LoadLibrary("libexample.so")
lib.add_points.argtypes = [POINTER(Point), POINTER(Point)]
lib.add_points.restype = Point
lib.add_points_inplace.argtypes = [POINTER(Point), POINTER(Point)]
lib.add_points_inplace.restype = None
```

The Point class inheriting from ctypes.Structure is the way to map external structs to Python objects. `_fields_` is special syntax ([docs link](https://docs.python.org/3/library/ctypes.html#ctypes.Structure._fields_)). Add an overload for converting it to a string so we can see things have worked too.

After that Point class, we can load the .so and tell it what each function expects and what we expect it will return. We use `ctypes.POINTER` around the Point class as the rust functions do not expect args by value. `restype = None` is used when a function does not return a value.

After all that setup we can basically just call these functions like we would with any other code.

```python
p1 = Point(10, 10)
p2 = Point(15, 21)

p3 = lib.add_points(p1, p2)
print(p3)  # prints: Point(x=25, y=31)

p4 = Point(25, 19)
lib.add_points_inplace(p3, p4)

print(p3)  # prints: Point(x=50, y=50)
```
