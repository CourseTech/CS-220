class FSA {
  constructor() {

    class State {
      // constructor(name: string)
      constructor(name) {
        let state = name;
        let transition = [];

        this.renameTransition = function(name, newName) {
          let stateToChange;
          let key = [];
          for (let i = 0; i < transition.length; ++i) {
            key = Object.keys(transition[i]);
            stateToChange = lib220.getProperty(transition[i], key[0]).value;
            if (stateToChange.getName() === name) {
              let newTransition = {};
              lib220.setProperty(newTransition, key[0], new State(newName));
              transition[i] = newTransition;
            }
          }
          return this;
        }
        
        // getName(): string
        this.getName = function() {
          return state;
        }

        // setName(s: string): this
        this.setName = function(s) {
          state = s;
          return this; 
        }

        // addTransition(e: string, s: State): this
        this.addTransition = function(e, s) {
          let newTrans = {};
          lib220.setProperty(newTrans, e, s);
          transition.push(newTrans);
          return this;
        }

        // nextState(e: string): State
        this.nextState = function(e) {
          // Returns a random int i where min <= i < max
          function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
          }
          let next = this.nextStates(e);
          let randInt = randomInt(0, next.length);
          if (next.length === 0) {
            return undefined;
          }
          else {
            return next[randInt];
          }
        }

        // nextStates(e: string): State[]
        this.nextStates = function(e) {
          let next = transition.filter(x => lib220.getProperty(x, e).found);
          let result = [];
          next.forEach(x => result.push(lib220.getProperty(x, e).value));
          return result;
        }
      }
    }

    class Memento {
      constructor() {
        let state = undefined;

        // storeState(s: string): void
        this.storeState = function(s) {
          state = s; 
        };

        // getState(): string
        this.getState = function() {
          return state;
        }
      }
    }

    let fsa = []; // Contain all State created
    let curState = undefined; // current state
    let memento = []; // Contain all Memento created
    let curMemento = undefined; // current memento

    // nextState(e: string): this
    this.nextState = function(e) {
      let exist = false;
      if (curState === undefined) {
        return this;
      }
      let next = curState.nextState(e);
      if (next === undefined) {
        curState = next;
        return this;
      }
      for (let i = 0; i < fsa.length; ++i) {
        if (fsa[i].getName() === next.getName()) {
          curState = fsa[i];
          exist = true;
          break;
        }
      }
      if (exist === false) {
        fsa.push(next);
        curState = next;
      }
      return this;
    }

    // createState(s: string, transitions: Transition[]): this
    this.createState = function(s, transitions) {
      let exist = false;
      let newState = new State(s);
      for (let n = 0; n < transitions.length; ++n) {
        let key = Object.keys(transitions[n]);
        let stateToAdd = new State(lib220.getProperty(transitions[n], key[0]).value);
        newState.addTransition(key[0], stateToAdd);
      }
      for (let i = 0; i < fsa.length; ++i) {
        if (fsa[i].getName() === s) {
          if (curState === fsa[i]) {
            curState = newState;
          }
          fsa[i] = newState;
          exist = true;
          break;
        }
      }
      if (exist === false) {
        fsa.push(newState);
      }
      if (curState === undefined) {
        curState = fsa[0];
      }
      return this;
    }

    // addTransition(s: string, t: Transition): this
    this.addTransition = function(s, t) {
      let keys = Object.keys(t);
      let exist = false;
      for (let i = 0; i < fsa.length; ++i) {
        if (fsa[i].getName() === s) {
          exist = true;
          let newState = new State(lib220.getProperty(t, keys[0]).value);
          fsa[i].addTransition(keys[0], newState);
        }
      }
      if (exist === false) {
        let transitions = [];
        transitions.push(t);
        this.createState(s, transitions);
      }
      return this;
    }

    // showState(): string
    this.showState = function() {
      if (curState === undefined) {
        return undefined;
      }
      return curState.getName();
    }

    // renameState(name: string, newName: string): this
    this.renameState = function(name, newName) {
      for (let i = 0; i < fsa.length; ++i) {
        fsa[i].renameTransition(name, newName);
        if (fsa[i].getName() === name) {
          fsa[i].setName(newName);
        }
      }
      return this;
    }

    // createMemento(): Memento
    this.createMemento = function() {
      let newMemento = new Memento();
      if (curState === undefined) {
        newMemento.storeState(undefined);
      }
      else {
        newMemento.storeState(curState.getName());
      }
      memento.push(newMemento);
      curMemento = newMemento;
      return curMemento;
    }

    // restoreMemento(m: Memento): this
    this.restoreMemento = function(m) {
      let exist = memento.some(x => x.getState() === m.getState());
      if (exist) {
        for (let i = 0; i < fsa.length; ++i) {
          if (m.getState() === fsa[i].getName()) {
            curState = fsa[i];
          }
        }
      }
      return this;
    }
  }
}

// TESTS

// let myMachine = new FSA().createState("delicates, low", [{mode: "normal, low"}, {temp: "delicates, medium"}])
//                          .createState("normal, low", [{mode: "delicates, low"}, {temp: "normal, medium"}])
//                          .createState("delicates, medium", [{mode: "normal, medium"}, {temp: "delicates, low"}])
//                          .createState("normal, medium", [{mode: "delicates, medium"}, {temp: "normal, high"}])
//                          .createState("normal, high", [{mode: "delicates, medium"}, {temp: "normal, low"}]);

// myMachine.nextState("temp") // moves the machine to delicates, medium
//          .nextState("mode") // moves the machine to normal, medium
//          .nextState("temp"); // moves the machine to normal, high

// let restoreTo = myMachine.createMemento(); // creates memento from current state

// console.log(restoreTo.getState()); // prints name of state in memento

// myMachine.nextState("mode") // moves the machine to delicates, medium
//          .nextState("temp") // moves the machine to delicates, low
//          .restoreMemento(restoreTo); // restores the machine to normal, high

let machine = new FSA();
machine.createState('a', [{b: 'b'}])
       .createState('b', [{c: 'c'}])
       .createState('c', [{a: 'a'}]);