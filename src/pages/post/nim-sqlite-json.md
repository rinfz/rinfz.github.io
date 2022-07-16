---
title: Sqlite, Json and Nim
date: 2021-07-06
layout: ../../layouts/Post.astro
tags: programming, nim, db
---

While doing a db revamp, I realised that coming up with a normalised database design might be too cumbersome for my problem-space. Turns out sqlite [supports json](https://www.sqlite.org/json1.html) so I can distribute a poor man's document db instead. I'm sure this will come back to bite me.

First check if json support is available with: `pragma compile_options;`. You are looking for `ENABLE_JSON1` in the output.

If it's there, here is an example script written in nim for inserting and retrieving data.

```nim
import json
import strutils # for parseInt
import db_sqlite

let
  db = open("example.db", "", "", "")
  data = %*{ "id": 123, "value": "foobar" }

db.exec(sql"create table example ( data json not null )")

# insert the json data from above as a string ($ stringifies the JSONObject)
db.exec(sql"insert into example (data) values (?)", $data)

# extract the id on it's own from the row
let id = db.getValue(sql"select json_extract(data, '$.id') from example limit 1")

# do something with the row to show it worked - should print 246
echo 2 * parseInt(id)

db.close()
```

Sqlite seems to ship with a decent set of functions for working with json data. If those don't cover your needs, it's just stored as text. You can extract it and work with it just like any other json data your application might use.
