const fs = require('fs');
const path = require('path');

const toFix = [
  ['backend/habits/handler.go', ['"os"']],
  ['backend/goals/handler.go', ['"fmt"', '"os"', '"strings"']],
  ['backend/goalsmilestones/handler.go', ['"fmt"', '"os"', '"strings"']],
  ['backend/plannertasks/handler.go', ['"os"', '"strings"']],
  ['backend/journals/handler.go', ['"os"']],
  ['backend/user/handler.go', ['"os"']],
  ['backend/calendar/handler.go', ['"os"']],
  ['backend/financeassets/handler.go', ['"os"']],
  ['backend/financebudgets/handler.go', ['"os"']],
  ['backend/financecategories/handler.go', ['"os"']],
  ['backend/financesavings/handler.go', ['"os"']],
  ['backend/financetransactions/handler.go', ['"os"', '"strings"']],
  ['backend/financeyearly/handler.go', ['"os"', '"strings"']],
  ['backend/jobs/handler.go', ['"os"', '"strings"']],
  ['backend/studyarchives/handler.go', ['"os"', '"strings"']],
  ['backend/studycourses/handler.go', ['"os"']],
  ['backend/paymentupgrade/handler.go', ['"fmt"', '"os"', '"strings"']],
];

for (const [rel, imports] of toFix) {
  const fp = path.join('d:/oneformind', rel);
  if (!fs.existsSync(fp)) { console.log('MISSING:', fp); continue; }
  let c = fs.readFileSync(fp, 'utf8');
  for (const imp of imports) {
    // Remove tab + import + newline (handles both \n and \r\n)
    c = c.split('\t' + imp + '\n').join('');
    c = c.split('\t' + imp + '\r\n').join('');
  }
  fs.writeFileSync(fp, c, 'utf8');
  console.log('Fixed:', rel);
}
console.log('All done!');
