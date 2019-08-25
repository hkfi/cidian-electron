import { IDictionaryItem } from "@/types";

export function sortSearchResults(results: IDictionaryItem[], input: string) {
  const resultsCopy = results.slice();
  const regexCaseInsensitive: RegExp = new RegExp(results.join("|"), "i");

  return resultsCopy.sort((a, b) => {
    let aRes = sortResultsLogic(a, input, regexCaseInsensitive);
    let bRes = sortResultsLogic(b, input, regexCaseInsensitive);
    if (aRes === bRes) {
      return 0;
    } else if (aRes > bRes) {
      return -1;
    } else {
      return 1;
    }
  });
}

function sortResultsLogic(
  wordObj: IDictionaryItem,
  input: string,
  testCase: RegExp
) {
  let res = 0;
  if (wordObj.d.includes(input)) {
    res += 2;
  } else if (testCase.test(input)) {
    res += 1;
  }
  return res;
}
