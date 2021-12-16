export interface Periodical {
  issueNumber: Number;
}

export interface Magazine extends Periodical {
  issueNumber: Number;
}

export function GetMagazineByIssueNumber(issueNumber: Number): Magazine {
  return {
    issueNumber: issueNumber
  };
}

// import { Periodical, Magazine, GetMagazineByIssueNumber } from './export-module.pattern';
// import * as mag from './export-module.pattern';
