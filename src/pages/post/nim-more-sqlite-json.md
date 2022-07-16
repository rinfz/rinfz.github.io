---
title: More Sqlite and Json
date: 2021-07-12
layout: ../../layouts/Post.astro
tags: programming, nim, db
---

Ok just writing this so that I remember how to do it - a couple of examples of working with json and sqlite.

Given an example schema:

```sql
create table players ( name text, batting json );
```

And batting data looks something like this (keyed game format with data objects per format):

```json
{
  "T20I": {
    "runs": 1000,
    "average": 50
  }
}
```

We can:

### Extract a specific stat per format

```sql
select json_extract(batting, '$.T20I.average') from players;
```

### Alias and filter

```sql
select name, cast(json_extract(batting, '$.T20I.average') as decimal) as average
from players
where average > 50
order by average desc
```

| name      | average |
| --------- | ------- |
| V. Kohli  | 52.65   |
| M. Hayden | 51.33   |
| etc       | ...     |

### Join based on json data

Note: an extra table is required to demonstrate the join:

```sql
create table teams ( id integer, name text );
```

And players requires an extra column `teams json` which is just a json array of integers representing ids in the teams table. Obviously this has the negative of no enforced constraint so data integrity takes a hit, but it might be good enough - not sure. I was just feeling lazy and couldn't be bothered to introduce a many-to-many table.

```sql
select distinct teams.name, players.name
from players, json_each(players.teams) as player_teams
join teams on teams.id = player_teams.value
where player_teams.value = 2
```

Note: json_each can be aliased just like any other table.

| teams.name | players.name    |
| ---------- | --------------- |
| Australia  | Kane Richardson |
| Australia  | Glenn Maxwell   |
| etc        | ...             |
