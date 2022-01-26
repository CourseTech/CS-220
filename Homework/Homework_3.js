// Returns a random int i where min <= i < max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Fisher–Yates shuffle Algorithm
// Source: https://en.wikipedia.org/wiki/Stable_marriage_problem
function shuffle(arr, n) {
  let temp = -1;
  for (let i = n - 1; i > 0; --i) {
    let randNum = randomInt(0, i + 1);
    temp = arr[i];
    arr[i] = arr[randNum];
    arr[randNum] = temp;
  }
  return arr;
}


// generateInput(n: number): number[][]
function generateInput(n) {
  let result = [];
  for (let i = 0; i < n; ++i) {
    let innerResult = [];
    for (let j = 0; j < n; ++j) {
      innerResult.push(j);
    }
    innerResult = shuffle(innerResult, n);
    result.push(innerResult);
  }
  return result;
}



// oracle(f: (companies: number[][], candidates: number[][]) => Hire[]): void
function oracle(f) {
  let numTests = 20; // Change this to some reasonably large value
  for (let i = 0; i < numTests; ++i) {
    let n = 10; // Change this to some reasonable size
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let hires = f(companies, candidates);
    test('Hires length is correct', function() {
      assert(companies.length === hires.length);
    }); // Write more tests like this one
    test('Companies and candidates length are correct', function() {
      assert(companies.length === n);
      assert(candidates.length === n);
    });
    test('Valid input range', function() {
      companies.forEach(x => x.forEach(y => y < n && y >= 0));
      candidates.forEach(x => x.forEach(y => y < n && y >= 0));
    });
    test('Hires candidate content has no duplicate', function() {
      for (let x = 0; x < hires.length; ++x) {
        for (let y = x + 1; y < hires.length; ++y) {
          assert(hires[x].candidate !== hires[y].candidate);
        }
      }
    });
    test('Hires company content has no duplicate', function() {
      for (let x = 0; x < hires.length; ++x) {
        for (let y = x + 1; y < hires.length; ++y) {
          assert(hires[x].company !== hires[y].company);
        }
      }
    });
    test('Hires candiates are within range', function() {
      hires.forEach(x => assert(x.candidate >= 0 && x.candidate < n));
    });
    test('Hires companies are within range', function() {
      hires.forEach(x => assert(x.company >= 0 && x.company < n));
    });
    test("Hires' stability", function() {
      function stable(hires) {
        let stableMatch = true;
        for (let x = 0; x < hires.length; ++x) {
          if (stableMatch === false) {
            break;
          }
          let company1 = hires[x].company;
          let candidate1 = hires[x].candidate;
          let company1List = companies[company1];
          for (let y = x + 1; y < hires.length; ++y) {
            let company2 = hires[y].company;
            let candidate2 = hires[y].candidate;
            let candidate2List = candidates[candidate2];
            let candidate2PreferOtherCompany = false;
            let candidate2CurrentCompany = candidate2List.indexOf(company2);
            let candidate2PotentialCompany = candidate2List.indexOf(company1);
            candidate2PreferOtherCompany = candidate2CurrentCompany > candidate2PotentialCompany ? true : false;
            let company1PreferOtherCandidate = false;
            let company1CurrentCandidate = company1List.indexOf(candidate1);
            let company1PotentialCandidate = company1List.indexOf(candidate2);
            company1PreferOtherCandidate = company1CurrentCandidate > company1PotentialCandidate ? true : false;
            stableMatch = candidate2PreferOtherCompany && company1PreferOtherCandidate ? false : true;
          }
        }
        return stableMatch;
      }
      assert(stable(hires));
    });
  }
}

//wheat1(companies: number[][], candidates: number[][]): Hire[]
//chaff1(companies: number[][], candidates: number[][]): Hire[]

//oracle(wheat1);
//oracle(chaff1);


// type Offer = { from: number, to: number, fromCo: boolean }
// type Run = { trace: Offer[], out: Hire[] }
// runOracle(f: (companies: number[][], candidates: number[][]) => Run): void
function runOracle(f) {
  let numTests = 20;
  for (let i = 0; i < numTests; ++i) {
    let n = 10;
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let run = f(companies, candidates);
    let runTraceSize = run.trace.length;
    let runOutSize = run.out.length;

    test("Valid Trace", function() {
      function validTrace(proposer, receiver, preferenceList, index, fromCo) {
        if (receiver !== preferenceList[index]) {
          return false;
        }
        if (fromCo === true) {
          ++comArr[proposer];
        }
        else {
          ++canArr[proposer];
        }
        return true;
      }
      if (n <= 0) {
        assert(false);
      }
      let valid = true;
      let comArr = [];
      let canArr = [];
      for (let a = 0; a < n; ++a) {
        comArr.push(0);
        canArr.push(0);
      }
      let index;
      let preferenceList;
      if (runTraceSize === 0) {
        assert(false);
      }
      for (let i = 0; i < runTraceSize; ++i) {
        if (valid === false) {
          break;
        }
        if (run.trace[i].from < 0 || run.trace[i].from >= n) {
          assert(false);
        }
        if (run.trace[i].to < 0 || run.trace[i].to >= n) {
          assert(false);
        }
        if (run.trace[i].fromCo === true) {
          index = comArr[run.trace[i].from];
          preferenceList = companies[run.trace[i].from];
          valid = validTrace(run.trace[i].from, run.trace[i].to, preferenceList, index, true);
        }
        else {
          index = canArr[run.trace[i].from];
          preferenceList = candidates[run.trace[i].from];
          valid = validTrace(run.trace[i].from, run.trace[i].to, preferenceList, index, false);
        }
      }
      assert(valid);
    });

    test("Out Is The Result Of Offers In Trace", function () {
      let validResult = true;
      let result = []; // company as index and candidate is the value at each index
      for (let i = 0; i < n; ++i) { // result is of size n
        result.push(-1); // making all candidate at first -1 so it is "empty"
      }
      for (let x = 0; x < runTraceSize; ++x) {
        let proposer = run.trace[x].from; // the proposer in the offer
        let receiver = run.trace[x].to; // the receiver in the offer
        let receiverPreferenceList;
        let proposerIndex = -1; // proposer index in the preference list
        let matchedIndex = -1; // the current partner index in the preference list
        let unmatched = true;
        if (run.trace[x].fromCo === true) {
          if (result[proposer] !== -1) { // checks if company repeats offer
            assert(false);
          }
          receiverPreferenceList = candidates[receiver]; // candidate's preference list
          for (let y = 0; y < result.length; ++y) {
            if (result[y] === receiver) { // checking if the candidate is already matched with a company
              proposerIndex = receiverPreferenceList.indexOf(proposer); // checking the company's index in the preference list
              matchedIndex = receiverPreferenceList.indexOf(y); // checking the matched company in the preference list
              if (proposerIndex < matchedIndex) {
                result[proposer] = receiver; // setting the candidate to the porposed company
                result[y] = -1; // setting the candidate's matched partner to empty
              }
              unmatched = false;
              break;
            }
          }
          if (unmatched === true) { // if the candidate is not in the result array means that it is not matched with any company yet
            result[proposer] = receiver;
          }
        }
        else { // proposer is a candidate, receiver is a company
          if (result.includes(proposer) === true) { // check if candidate repeats offer
            assert(false);
          }
          receiverPreferenceList = companies[receiver]; //  company's preference list
          if (result[receiver] === -1) { // result[receiver] is the candidate the company is matched to
            result[receiver] = proposer; // setting the index of receiver (company) equal to the proposer (candidate)
          }
          else {
            proposerIndex = receiverPreferenceList.indexOf(proposer); // checking the proposer's index in the company's preference list
            matchedIndex = receiverPreferenceList.indexOf(result[receiver]); // checking the matched partner in the company's preference list
            if (proposerIndex < matchedIndex) {
              result[receiver] = proposer; // setting the company to the proposed candidate
            }
          }
        }
      }
      for (let j = 0; j < runOutSize; ++j) {
        if (result[run.out[j].company] !== run.out[j].candidate) { // checking the value of the company's matched candidate in result
          validResult = false; // check if the candidate in Hire[] does not make with the candidate in result at the company index
          break;
        }
      }
      assert(validResult);
    });
  }
}

const oracleLib = require('oracle');
runOracle(oracleLib.traceWheat1);
//runOracle(oracleLib.traceChaff1);