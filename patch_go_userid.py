import os
import glob

backend_dir = 'd:\\oneformind\\backend'
handlers = glob.glob(os.path.join(backend_dir, '*\\handler.go'))

for handler in handlers:
    with open(handler, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Generic replacement: find where X-User-Id is read, and insert query check right after it
    # Search for: userIdStr := r.Header.Get("X-User-Id")
    
    lines = content.split('\n')
    changed = False
    
    for i, line in enumerate(lines):
        if 'userIdStr := r.Header.Get("X-User-Id")' in line:
            # check if the next line already has the query check
            if i + 1 < len(lines) and 'userIdStr = r.URL.Query().Get("userId")' not in lines[i+1] and 'userIdStr = r.URL.Query().Get("userId")' not in lines[i+2]:
                # Insert the check
                insertion = '\tif userIdStr == "" {\n\t\tuserIdStr = r.URL.Query().Get("userId")\n\t}'
                lines[i] = line + '\n' + insertion
                changed = True
    
    if changed:
        new_content = '\n'.join(lines)
        with open(handler, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Patched Go {handler}")
