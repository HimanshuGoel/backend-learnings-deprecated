interface Periodical {
  issueNumber: Number;
}

interface Magazine extends Periodical {
  issueNumber: Number;
}

function GetMagazineByIssueNumber(issueNumber: Number): Magazine {
  return {
    issueNumber: issueNumber
  };
}

export { Periodical, Magazine, GetMagazineByIssueNumber as getMag };

import { getMag } from './export-module-statement.pattern';
import * as mag from './export-module-statement.pattern';
