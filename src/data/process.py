import re
import json

with open('links.json') as f:
    data = json.load(f)

for link in data:
    title = link['title'].lower()
    title = re.sub(r'\s+', '-', title)
    title = title.replace('/', '_').replace(':', '_')
    slug = f"{title}.md"
    fm_title = link['title'].replace(':', '&#58;')
    frontmatter = f"""---
title: {fm_title}
url: {link['link']}
date: {link['date']}
---
"""
    with open(f'../content/link/{slug}', 'w') as f:
        f.write(frontmatter)

print("Done")
