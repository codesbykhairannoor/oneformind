import os
import glob
import re

api_dir = 'd:\\oneformind\\src\\app\\api'
routes = glob.glob(os.path.join(api_dir, '**\\route.ts'), recursive=True)

for route in routes:
    with open(route, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace lines like:
    # const goUrl = `${protocol}://${host}/api?route=XYZ${search ? '&' + search.slice(1) : ''}`;
    
    lines = content.split('\n')
    changed = False
    
    for i, line in enumerate(lines):
        if 'const goUrl =' in line and 'userId=' not in line and 'searchParams' not in line:
            # check if userId is in scope, or session.user.id
            if 'userId' in content and 'const userId =' in content:
                uid_var = '${userId}'
            elif 'session.user.id' in content:
                uid_var = '${session.user.id}'
            else:
                continue
                
            if line.endswith('`;'):
                lines[i] = line[:-2] + f'&userId={uid_var}`;'
                changed = True
    
    if changed:
        new_content = '\n'.join(lines)
        with open(route, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Patched Next route: {route}")
