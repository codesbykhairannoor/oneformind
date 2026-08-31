import os
import glob
import re

backend_dir = 'd:\\oneformind\\backend'
handlers = glob.glob(os.path.join(backend_dir, '*\\handler.go'))

for handler in handlers:
    with open(handler, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We need to change `func init() {` to `func initDB() {`
    # and add a `var dbMutex sync.Mutex` if needed, but since Vercel handles requests linearly or concurrently, 
    # a simple `sync.Once` is best.
    
    # Actually, simpler:
    # Just change `func init()` to `func initDB()`
    # And at the start of `Handler(w, r)`, do:
    # `if db == nil { initDB() }`
    # Wait, the `db` variable has different names!
    # dbTasks, dbFinTx, etc.
    # Let's extract the db variable name from the first `var db* *sql.DB`
    
    db_var_match = re.search(r'var\s+([a-zA-Z0-9_]+)\s+\*sql\.DB', content)
    if not db_var_match:
        continue
    db_var = db_var_match.group(1)
    
    # Replace func init() with func initDB()
    new_content = content.replace('func init() {', 'func initDB() {')
    
    # Find the handler function
    # It usually starts with `func ` and ends with `Handler(w http.ResponseWriter, r *http.Request) {`
    handler_match = re.search(r'func\s+([a-zA-Z0-9_]+Handler)\(w\s+http\.ResponseWriter,\s+r\s+\*http\.Request\)\s+\{', new_content)
    if not handler_match:
        continue
    handler_func = handler_match.group(0)
    
    # Check if we already have `if db == nil { ... return }`
    # We want to replace it with:
    # if db == nil {
    #     initDB()
    #     if db == nil {
    #         http.Error(w, "DB not initialized", 500)
    #         return
    #     }
    # }
    
    # Let's inject `if db == nil { initDB() }` right after the handler declaration
    injection = f'{handler_func}\n\tif {db_var} == nil {{\n\t\tinitDB()\n\t}}'
    
    new_content = new_content.replace(handler_func, injection)
    
    with open(handler, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Refactored {handler}")
