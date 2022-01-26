// memo0<T>(f: () => T): Memo<T>
function memo0(f) {
  let r = { evaluated: false };
  return {
    get() {
      if (! r.evaluated) { r = { evaluated: true, v: f() } }
      return r.v;
    }
  };
}

// sempty: Stream<T>
const sempty = {
  isEmpty: () => true,
  map: f => sempty,
  filter: pred => sempty,
};
// snode<T>(head: T, tail: Memo<Stream<T>>): Stream<T>
function snode(head, tail) {
  return {
    isEmpty: () => false,
    head: () => head,
    tail: tail.get,
    map: f => snode(f(head), memo0(() => tail.get().map(f))),
    filter: pred => pred(head) ? 
                    snode(head, memo0(() => tail.get().filter(pred)))
                    : tail.get().filter(pred),
  }
}

let s = snode(1, memo0(() => snode(0, memo0(() => snode(3, memo0(() => snode(4, memo0(() => sempty))))))));
let t = snode(2, memo0(() => snode(6, memo0(() => snode(9, memo0(() => snode(11, memo0(() => sempty))))))));
let a = snode(1, memo0(() => snode(2, memo0(() => sempty))));
let one = snode(1, memo0(() => sempty));

// ADD SERIES
function addSeries(s, t) {
  if (s.isEmpty() && t.isEmpty()) {
    return sempty;
  }
  if (s.isEmpty()) { // when there is nothing left to add from s(x)
    return snode(t.head(), memo0(() => addSeries(s, t.tail())));
  }
  if (t.isEmpty()) { // when there is nothing left to add from t(x)
    return snode(s.head(), memo0(() => addSeries(s.tail(), t)));
  }
  return snode(s.head() + t.head(), memo0(() => addSeries(s.tail(), t.tail())));
}

//let add = addSeries(one, sempty);

function prodSeries(s, t) {
  function prodSeriesHelper(s, t, n) {
    let resultProduct;
    if (t.isEmpty()) { // the end of t(x)
      return sempty;
    }
    if (s.isEmpty()) { // when there is nothing else to multiple from s(x)
      return snode(t.head(), memo0(() => prodSeriesHelper(s, t.tail(), n))); // getting the rest of the term in t(x)
    }
    if (n === 0) { // to keep track of the first term
      t = t.map(x => x * s.head()); // multiplying t(x) with a0
      return snode(t.head(), memo0(() => prodSeriesHelper(s.tail(), t.tail(), n + 1)));
    }
    resultProduct = original_T.map(x => x * s.head()); // multiplying t(x) with the ith coefficient of s(x)
    t = addSeries(resultProduct, t); // adding the product series to t(x) and making it the new t(x)
    return snode(t.head(), memo0(() => prodSeriesHelper(s.tail(), t.tail(), n)));
  }
  let original_T = t;
  return prodSeriesHelper(s, t, 0);
}

let pro = prodSeries(s, t);

// DERIVATIVE SERIES
function derivSeries(s) {
  function derivSeriesHelper(s, i) {
    if (s.isEmpty()) {
      return sempty;
    }
    return snode(s.head() * i, memo0(() => derivSeriesHelper(s.tail(), i + 1)))
  }
  return derivSeriesHelper(s, 0);
}

let deriv = derivSeries(s);

// COEFFICIENT
function coeff(s, n) {
  function coeffHelper(result, s, n, i) {
    if (s.isEmpty() || i > n) {
      return result;
    }
    else {
    result.push(s.head());
    return coeffHelper(result, s.tail(), n, i + 1);
    }
  }
  let result = [];
  return coeffHelper(result, s, n, 0);
}

//let co = coeff(s, 3);

// EVALUATION SERIES
function evalSeries(s, n) {
  return x => {
    function evalSeriesHelper(sum, s, n, i) {
      if (s.isEmpty() || i > n) {
        return sum;
      }
      else {
        sum += s.head() * Math.pow(x, i);
        return evalSeriesHelper(sum, s.tail(), n, i + 1);
      }
    }
    return evalSeriesHelper(0, s, n, 0);
  }
}

//let eval = evalSeries(s, 4);

// REC 1 SERIES
function rec1Series(f, v) {
  function rec1SeriesHelper(f, v, k, prevSnode) {
    if (k === 0) {
      return snode(v, memo0(() => rec1SeriesHelper(f, v, k + 1, v)));
    }
    else {
      return snode(f(prevSnode), memo0(() => rec1SeriesHelper(f, v, k, f(prevSnode))));
    }
  }
  return rec1SeriesHelper(f, v, 0, -1);
}

//let rec1 = rec1Series(x => 2 * x, 1);

// EXPONENT SERIES
function factorial(n) {
  if (n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

function expSeries() {
  function expSeriesHelper(n) {
    if (n === 0) {
      return snode(1, memo0(() => expSeriesHelper(n + 1)));
    }
    return snode((1/factorial(n)), memo0(() => expSeriesHelper(n + 1)));
  }
  return expSeriesHelper(0);
}

//let exp = expSeries();

// RECUR SERIES
function recurSeries(coef, init) {
  function afterK(k, n) {
    let sum = 0;
    for (let i = 0; i < coef.length; ++i) {
      sum += coef[i] * init[i + k];
    }
    init.push(sum);
    return sum;
  }
  function recurSeriesHelper(k) {
    if (k < initLength) {
      return snode(init[k], memo0(() => recurSeriesHelper(k + 1)));
    }
    return snode(afterK(k - initLength, 0), memo0(() => recurSeriesHelper(k + 1)));
  }
  let initLength = init.length;
  return recurSeriesHelper(0);
}

//let coef = [1,2,3];
//let init = [4,5,6];
//let recur = recurSeries(coef, init);