import { IDictionaryItem } from "@/types";

export function sortSearchResults(results: IDictionaryItem[], input: string) {
  const resultsCopy = results.slice();

  return resultsCopy.sort((a, b) => {
    let aRes = sortResultsLogic(a, input);
    let bRes = sortResultsLogic(b, input);
    if (aRes === bRes) {
      return 0;
    } else if (aRes > bRes) {
      return -1;
    } else {
      return 1;
    }
  });
}

// Function to check which word has priority when sorting search results
// 1. exact match in english or chinese
// 2. exact match after ignoring cases
// 3. starts with the exact input
// 4. starts with the input ignoring cases
// 5. includes the exact input
// 6. includes the input ignoring cases
function sortResultsLogic(wordObj: IDictionaryItem, input: string) {
  let res = 0;
  const lowerCaseInput = input.toLowerCase();
  const defStartsWith = wordObj.d.filter((word: string) => {
    return word.startsWith(input);
  });
  const defStartsWithCaseInsensitive = wordObj.d.filter((word: string) => {
    return word.toLowerCase().startsWith(lowerCaseInput);
  });

  // Need to try catch because some definitions have characters in strings that interfere with the RegExp
  // Eg. for Lü Buwei, definition includes "(?291-235 BC)"
  // the "(?" causes an error because it is a RegExp syntax and it ends up creating an invalid group
  let regexCaseInsensitive: RegExp;
  try {
    regexCaseInsensitive = new RegExp(`^${wordObj.d.join("|")}`, "i");
  } catch (err) {
    console.log("regex error caught");
    console.error(err);
    const fixedString = wordObj.d.join("|").replace("(?", "(");
    regexCaseInsensitive = new RegExp(`^${fixedString}`, "i");
  }

  const exactMatch =
    wordObj.d.includes(input) ||
    wordObj.s === input ||
    wordObj.t === input ||
    wordObj.pd === input ||
    wordObj.pn === input ||
    wordObj.pn.toLowerCase().replace(/[0-9]/g, "") === lowerCaseInput;
  const exactMatchCaseInsensitive = regexCaseInsensitive.test(input);
  const startsWithMatch =
    defStartsWith.length > 0 ||
    wordObj.s.startsWith(input) ||
    wordObj.t.startsWith(input) ||
    wordObj.pd.startsWith(input) ||
    wordObj.pn.startsWith(input);

  const startsWithMatchCaseInsensitive =
    defStartsWithCaseInsensitive.length > 0 ||
    wordObj.pd.toLowerCase().startsWith(lowerCaseInput) ||
    wordObj.pn.toLowerCase().startsWith(lowerCaseInput);

  const includesMatch =
    wordObj.s.includes(input) ||
    wordObj.t.includes(input) ||
    wordObj.pd.includes(input) ||
    wordObj.pn.includes(input);

  const includesMatchCaseInsensitive =
    wordObj.pd.toLowerCase().includes(lowerCaseInput) ||
    wordObj.pn.toLowerCase().includes(lowerCaseInput);

  if (exactMatch) {
    res += 6;
  } else if (exactMatchCaseInsensitive) {
    res += 5;
  } else if (startsWithMatch) {
    res += 4;
  } else if (startsWithMatchCaseInsensitive) {
    res += 3;
  } else if (includesMatch) {
    res += 2;
  } else if (includesMatchCaseInsensitive) {
    res += 1;
  }
  return res;
}
