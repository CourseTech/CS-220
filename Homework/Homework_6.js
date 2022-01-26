// Linked List

function node(data, next) {
  return { 
    head: () => data, 
    tail: () => next,
    isEmpty: () => false,
  };
}
function empty() { 
  return { 
    isEmpty: () => true,
  }; 
}

function typeCheck(e1, e2, type) {
  if (typeof(e1) !== typeof(e2)) {
    console.log('Both must be ' + type + '.');
    assert(false);
  }
}

function varHelper(state, name) {
  if (lib220.getProperty(state, name).found) {
    return lib220.getProperty(state, name).value;
  }
  else {
    if (lib220.getProperty(state, 'next').found) {
      return varHelper(state.next, name);
    }
    else {
      return false;
    }
  }
  return false;
}

// type State = { [key: string]: number | boolean }
// interpExpression(state: State, e: Expr): number | boolean
function interpExpression(state, e) {
  switch(e.kind) {
    case 'operator': {
      switch(e.op) {
        case '+': { // addition
          typeCheck(e.e1, e.e2, 'number');
          return interpExpression(state, e.e1) + interpExpression(state,e.e2);
          break;
        }
        case '-': { // subtraction
          typeCheck(e.e1, e.e2, 'number');
          return interpExpression(state, e.e1) - interpExpression(state,e.e2);
          break;
        }
        case '*': { // multiplication
          typeCheck(e.e1, e.e2, 'number');
          return interpExpression(state, e.e1) * interpExpression(state,e.e2);
          break;
        }
        case '/': { // division
          typeCheck(e.e1, e.e2, 'number');
          return interpExpression(state, e.e1) / interpExpression(state,e.e2);
          break;
        }
        case '&&': { // and
          typeCheck(e.e1, e.e2, 'boolean');
          return interpExpression(state, e.e1) && interpExpression(state,e.e2);
          break;
        }
        case '||': { // or
          typeCheck(e.e1, e.e2, 'boolean');
          return interpExpression(state, e.e1) || interpExpression(state,e.e2);
          break;
        }
        case '>': { // greater than
          typeCheck(e.e1, e.e2, 'number');
          return interpExpression(state, e.e1) > interpExpression(state,e.e2);
          break;
        }
        case '<': { // less than
          typeCheck(e.e1, e.e2, 'number');
          return interpExpression(state, e.e1) < interpExpression(state,e.e2);
          break;
        }
        case '===': { // equal to
          typeCheck(e.e1, e.e2, 'same type');
          return interpExpression(state, e.e1) === interpExpression(state,e.e2);
          break;
        }
        default: { 
          console.log('Invalid Binop.'); 
        }
      }
      break;
    }
    case 'variable': { // if it is a variable
      let value = varHelper(state, e.name);
      if (value === false) {
        console.log('Variable not declared.');
        assert(false);
      }
      return value;
      break;
    }
    case 'number': { // if it is a number
      return e.value;
      break;
    }
    case 'boolean': { // if it is a boolean
      return e.value;
      break;
    }
    default: {
      console.log('Invalid expression.');
      assert(false);
    }
  }
}

function interpBlock(state, b) {
  let innerScope = {};
  lst = node(innerScope, lst);
  lib220.setProperty(innerScope, 'next', state);
  b.forEach(a => interpStatement(lst.head(), a));
  lst = lst.tail();
}

function assignmentHelper(state, name) {
  if (lib220.getProperty(state, name).found) {
    return state;
  }
  else {
    if (lib220.getProperty(state, 'next').found) {
      return assignmentHelper(state.next, name);
    }
    else {
      return false;
    }
  }
  return false;
}

// interpStatement(state: State, p: Stmt): void
function interpStatement(state, p) {
  switch (p.kind) {
    case 'let': { // let statement
      if (lib220.getProperty(state, p.name).found) {
        console.log('Variable already declared.');
        assert(false);
      }
      let value = interpExpression(state, p.expression);
      lib220.setProperty(state, p.name, value);
      break;
    }
    case 'assignment': { // assignment statement
      let value;
      let currentState = assignmentHelper(state, p.name); // get the state which there is the corresponding variable
      if (currentState === false) { // varibale not declared
        console.log('Variable not declared.');
        assert(false);
      }
      value = interpExpression(state, p.expression); // get the value using the currentState
      lib220.setProperty(currentState, p.name, value); // update the currentState fields
      break;
    }
    case 'if': { // if statement
      if (interpExpression(state, p.test)) {
        interpBlock(state, p.truePart);
      }
      else {
        interpBlock(state, p.falsePart);
      }
      break;
    }
    case 'while': { // while statement
      let modifiedAST = {
        kind: 'if',
        test: p.test,
        truePart: p.body.concat(p),
        falsePart: []
      };
      interpStatement(state, modifiedAST);
      break;
    }
    case 'print': { // print statement
      let value = interpExpression(state, p.expression);
      console.log(value);
      break;
    }
    default: {
      console.log('Invalid statement.');
      assert(false);
    }
  }
}

let lst = empty();
// interpProgram(p: Stmt[]): State
function interpProgram(p) {
  let state = {};
  lst = node(state, lst);
  p.forEach(s => interpStatement(lst.head(), s));
  lst = empty(); // reset list for next use since it is a global variable
  return state;
}

// TESTS

test("interpExpression with a variable", function() {
  let a = interpExpression({ x: 10 }, parser.parseExpression("x * 2").value);
  let b = interpExpression({ x: 10 }, parser.parseExpression("x + 20").value);
  let c = interpExpression({ x: 10 }, parser.parseExpression("x - 5").value);
  let d = interpExpression({ x: 20 }, parser.parseExpression("x / 2").value);
  let e = interpExpression({ x: true }, parser.parseExpression("x && false").value);
  let f = interpExpression({ y: true }, parser.parseExpression("y || false").value);
  let g = interpExpression({ x: 20 }, parser.parseExpression("x > 2").value);
  let h = interpExpression({ x: 20 }, parser.parseExpression("x < 200").value);
  let i = interpExpression({ x: 20 }, parser.parseExpression("x === 20").value);
  assert(a === 20);
  assert(b === 30);
  assert(c === 5);
  assert(d === 10);
  assert(e === false);
  assert(f === true);
  assert(g === true);
  assert(h === true);
  assert(i === true);
});

test("interpExpression without a variable", function() {
  let a = interpExpression({}, parser.parseExpression("10 * 2").value);
  let b = interpExpression({}, parser.parseExpression("10 + 20").value);
  let c = interpExpression({}, parser.parseExpression("10 - 5").value);
  let d = interpExpression({}, parser.parseExpression("20 / 2").value);
  let e = interpExpression({}, parser.parseExpression("true && false").value);
  let f = interpExpression({}, parser.parseExpression("true || false").value);
  let g = interpExpression({}, parser.parseExpression("20 > 2").value);
  let h = interpExpression({}, parser.parseExpression("20 < 200").value);
  let i = interpExpression({}, parser.parseExpression("20 === 20").value);
  assert(a === 20);
  assert(b === 30);
  assert(c === 5);
  assert(d === 10);
  assert(e === false);
  assert(f === true);
  assert(g === true);
  assert(h === true);
  assert(i === true);
});

test("assignment", function() {
  let st = interpProgram(parser.parseProgram("let x = 10; x = 20;").value);
  let ss = interpProgram(parser.parseProgram("let x = 0; let y = 1; while(x < 5) { y = y + 1; x = x + 1; }").value);
  let sa = interpProgram(parser.parseProgram("let x = 0; if (true) { let y = x + 5; x = 10; print(y); } else {}").value)
  assert(st.x === 20);
  assert(ss.x === 5);
  assert(ss.y === 6);
  assert(sa.x === 10);
});

let z = { // x = 10, y = 15
  value: [
    {
      kind: "let",
      name: "x",
      expression: {
        kind: "number",
        value: 10
      }
    },
    {
      kind: "let",
      name: "y",
      expression: {
        kind: "number",
        value: 8
      }
    },
    {
      kind: "if",
      test: {
        kind: "boolean",
        value: true
      },
      truePart: [
        {
          kind: "let",
          name: "x",
          expression: {
            kind: "number",
            value: 7
          }
        },
        {
          kind: "assignment",
          name: "y",
          expression: {
            kind: "operator",
            op: "+",
            e1: {
              kind: "variable",
              name: "y"
            },
            e2: {
              kind: "variable",
              name: "x"
            }
          }
        }
      ],
      falsePart: [
        {
          kind: "assignment",
          name: "x",
          expression: {
            kind: "operator",
            op: "-",
            e1: {
              kind: "variable",
              name: "x"
            },
            e2: {
              kind: "number",
              value: 1
            }
          }
        },
        {
          kind: "print",
          expression: {
            kind: "variable",
            name: "x"
          }
        }
      ]
    },
    {
      kind: "print",
      expression: {
        kind: "variable",
        name: "x"
      }
    }
  ],
  kind: "ok"
}

//console.log(interpProgram(z.value));

let m = { // x = 10, y = 29
  value: [
    {
      kind: "let",
      name: "x",
      expression: {
        kind: "number",
        value: 10
      }
    },
    {
      kind: "let",
      name: "y",
      expression: {
        kind: "number",
        value: 8
      }
    },
    {
      kind: "if",
      test: {
        kind: "boolean",
        value: true
      },
      truePart: [
        {
          kind: "let",
          name: "x",
          expression: {
            kind: "number",
            value: 12
          }
        },
        {
          kind: "assignment",
          name: "y",
          expression: {
            kind: "operator",
            op: "+",
            e1: {
              kind: "variable",
              name: "y"
            },
            e2: {
              kind: "variable",
              name: "x"
            }
          }
        },
        {
          kind: "if",
          test: {
            kind: "boolean",
            value: true
          },
          truePart: [
            {
              kind: "let",
              name: "x",
              expression: {
                kind: "number",
                value: 9
              }
            },
            {
              kind: "assignment",
              name: "y",
              expression: {
                kind: "operator",
                op: "+",
                e1: {
                  kind: "variable",
                  name: "y"
                },
                e2: {
                  kind: "variable",
                  name: "x"
                }
              }
            }
          ],
          falsePart: [
            {
              kind: "assignment",
              name: "x",
              expression: {
                kind: "operator",
                op: "-",
                e1: {
                  kind: "variable",
                  name: "x"
                },
                e2: {
                  kind: "number",
                  value: 1
                }
              }
            }
          ]
        }
      ],
      falsePart: [
        {
          kind: "assignment",
          name: "x",
          expression: {
            kind: "operator",
            op: "-",
            e1: {
              kind: "variable",
              name: "x"
            },
            e2: {
              kind: "number",
              value: 1
            }
          }
        }
      ]
    }
  ],
  kind: "ok"
}

//console.log(interpProgram(m.value));

let asd = { // x = 10, y = 8
  value: [
    {
      kind: "let",
      name: "x",
      expression: {
        kind: "number",
        value: 10
      }
    },
    {
      kind: "let",
      name: "y",
      expression: {
        kind: "number",
        value: 8
      }
    },
    {
      kind: "if",
      test: {
        kind: "boolean",
        value: true
      },
      truePart: [
        {
          kind: "let",
          name: "x",
          expression: {
            kind: "number",
            value: 12
          }
        },
        {
          kind: "let",
          name: "y",
          expression: {
            kind: "number",
            value: 21
          }
        },
        {
          kind: "assignment",
          name: "y",
          expression: {
            kind: "operator",
            op: "+",
            e1: {
              kind: "variable",
              name: "y"
            },
            e2: {
              kind: "variable",
              name: "x"
            }
          }
        },
        {
          kind: "assignment",
          name: "x",
          expression: {
            kind: "operator",
            op: "+",
            e1: {
              kind: "variable",
              name: "x"
            },
            e2: {
              kind: "variable",
              name: "y"
            }
          }
        }
      ],
      falsePart: [
        {
          kind: "assignment",
          name: "x",
          expression: {
            kind: "operator",
            op: "-",
            e1: {
              kind: "variable",
              name: "x"
            },
            e2: {
              kind: "number",
              value: 1
            }
          }
        }
      ]
    }
  ],
  kind: "ok"
}

let abc = { // x = 10, y = 8
  value: [
    {
      kind: "let",
      name: "x",
      expression: {
        kind: "number",
        value: 10
      }
    },
    {
      kind: "let",
      name: "y",
      expression: {
        kind: "number",
        value: 8
      }
    },
    {
      kind: "if",
      test: {
        kind: "boolean",
        value: true
      },
      truePart: [
        {
          kind: "let",
          name: "y",
          expression: {
            kind: "number",
            value: 21
          }
        },
        {
          kind: "let",
          name: "z",
          expression: {
            kind: "number",
            value: 15
          }
        },
        {
          kind: "assignment",
          name: "y",
          expression: {
            kind: "operator",
            op: "+",
            e1: {
              kind: "variable",
              name: "y"
            },
            e2: {
              kind: "variable",
              name: "z"
            }
          }
        }
      ],
      falsePart: [
        {
          kind: "assignment",
          name: "x",
          expression: {
            kind: "operator",
            op: "-",
            e1: {
              kind: "variable",
              name: "x"
            },
            e2: {
              kind: "number",
              value: 1
            }
          }
        }
      ]
    }
  ],
  kind: "ok"
}

let abz = {
  value: [
    {
      kind: "let",
      name: "x",
      expression: {
        kind: "number",
        value: 10
      }
    },
    {
      kind: "if",
      test: {
        kind: "boolean",
        value: true
      },
      truePart: [
        {
          kind: "let",
          name: "x",
          expression: {
            kind: "number",
            value: 1
          }
        },
        {
          kind: "let",
          name: "x",
          expression: {
            kind: "number",
            value: 2
          }
        }
      ],
      falsePart: []
    }
  ],
  kind: "ok"
}

let bca = {
  value: [
    {
      kind: "let",
      name: "x",
      expression: {
        kind: "number",
        value: 10
      }
    },
    {
      kind: "let",
      name: "x",
      expression: {
        kind: "number",
        value: 20
      }
    }
  ],
  kind: "ok"
}

let hba = {
  value: [
    {
      kind: "let",
      name: "x",
      expression: {
        kind: "number",
        value: 10
      }
    },
    {
      kind: "if",
      test: {
        kind: "boolean",
        value: true
      },
      truePart: [
        {
          kind: "assignment",
          name: "x",
          expression: {
            kind: "boolean",
            value: true
          }
        },
        {
          kind: "let",
          name: "x",
          expression: {
            kind: "number",
            value: 50
          }
        }
      ],
      falsePart: []
    }
  ],
  kind: "ok"
} 