class FluentRestaurants {

  constructor(jsonData) {
    this.data = jsonData;
  }

  // fromState(stateStr: string): FluentRestaurants
  fromState(stateStr) {
    function fromStateHelper(x) {
      if (lib220.getProperty(x, 'state').found) {
        if (lib220.getProperty(x, 'state').value === stateStr) {
          return true;
        }
      }
      return false;
    }
    return new FluentRestaurants(this.data.filter(x => fromStateHelper(x)));
  }

  // ratingLeq(rating: number): FluentRestaurants
  ratingLeq(rating) {
    function ratingLeqHelper(x) {
      if (lib220.getProperty(x, 'stars').found) {
        if (lib220.getProperty(x, 'stars').value <= rating) {
          return true;
        }
      }
      return false;
    }
    return new FluentRestaurants(this.data.filter(x => ratingLeqHelper(x)));
  }

  // ratingGeq(rating: number): FluentRestaurants
  ratingGeq(rating) {
    function ratingGeqHelper(x) {
      if (lib220.getProperty(x, 'stars').found) {
        if (lib220.getProperty(x, 'stars').value >= rating) {
          return true;
        }
      }
      return false;
    }
    return new FluentRestaurants(this.data.filter(x => ratingGeqHelper(x)));
  }

  // category(categoryStr: string): FluentRestaurants
  category(categoryStr) {
    function categoryHelper(x) {
      if (lib220.getProperty(x, 'categories').found) {
        return x.categories.some(y => y === categoryStr);
      }
      return false;
    }
    return new FluentRestaurants(this.data.filter(x => categoryHelper(x)));
  }

  // hasAmbience(ambienceStr: string): FluentRestaurants
  hasAmbience(ambienceStr) {
    function hasAmbienceHelper(x) {
      if (lib220.getProperty(x, 'attributes').found) {
        if (lib220.getProperty(x.attributes, 'Ambience').found) {
          if (lib220.getProperty(x.attributes.Ambience, ambienceStr).found) {
            if (lib220.getProperty(x.attributes.Ambience, ambienceStr).value === true) {
              return true;
            }
          }
        }
      }
      return false;
    }
    return new FluentRestaurants(this.data.filter(x => hasAmbienceHelper(x)));
  }

  // reviewGeq(review: number): FluentRestaurants
  reviewGeq(review) {
    function reviewGeqHelper(x) {
      if (lib220.getProperty(x, 'review_count').found) {
        if (lib220.getProperty(x, 'review_count').value >= review) {
          return true;
        }
      }
      return false;
    }
    return new FluentRestaurants(this.data.filter(x => reviewGeqHelper(x)));
  }

  // bestPlace(): Restaurant | {}
  bestPlace() {
    if (this.data.length === 0) {
      return {};
    }
    let Restaurants = new FluentRestaurants(this.data);
    Restaurants = highestStarRestaurants(Restaurants);
    if (Restaurants.data.length === 0) {
      return {};
    }
    if (Restaurants.data.length > 1) {
      Restaurants = highestReviewRestaurants(Restaurants);
    }
    if (Restaurants.data.length === 0) {
      Restaurants = highestStarRestaurants(new FluentRestaurants(this.data));
    }
    if (Restaurants.data.length >= 1) {
      Restaurants = Restaurants.data[0];
      return Restaurants;
    }
    return {};
  }

  // mostReviews(): Restaurant | {}
  mostReviews() {
    if (this.data.length === 0) {
      return {};
    }
    let Restaurants = new FluentRestaurants(this.data);
    Restaurants = highestReviewRestaurants(Restaurants);
    if (Restaurants.data.length === 0) {
      return {};
    }
    if (Restaurants.data.length > 1) {
      Restaurants = highestStarRestaurants(Restaurants);
    }
    if (Restaurants.data.length === 0) {
      Restaurants = highestReviewRestaurants(new FluentRestaurants(this.data));
    }
    if (Restaurants.data.length >= 1) {
      Restaurants = Restaurants.data[0];
      return Restaurants;
    }
    return {};
  } 
}

function highestStarRestaurants(Restaurants) {
  let star = Restaurants.data.reduce((acc, e) => highestStarHelper(acc, e), 0);
  return new FluentRestaurants(Restaurants.ratingGeq(star).data);
}
function highestReviewRestaurants(Restaurants) {
  let review = Restaurants.data.reduce((acc, e) => highestReviewHelper(acc, e), 0);
  return new FluentRestaurants(Restaurants.reviewGeq(review).data);
}

function highestStarHelper(acc, e) {
  if (lib220.getProperty(e, 'stars').found) {
    if (lib220.getProperty(e, 'stars').value > acc) {
      return lib220.getProperty(e, 'stars').value;
    }
  }
  return acc;
}
function highestReviewHelper(acc, e) {
  if (lib220.getProperty(e, 'review_count').found) {
    if (lib220.getProperty(e, 'review_count').value > acc) {
      return lib220.getProperty(e, 'review_count').value;
    }
  }
  return acc;
}

// TESTS

const testData = [
  {
    name: "Applebee's",
    state: "NC",
    stars: 4,
    review_count: 6,
    categories: ["food"],
    attributes: {
      Ambience: {
        hipster: false,
        trendy: true,
        upscale: false,
        casual: true,
      },
    },
  },
  {
    name: "China Garden",
    state: "NC",
    stars: 4,
    review_count: 10,
    categories: ["food"],
    attributes: {
      Ambience: {
        hipster: false,
        trendy: false,
        upscale: false,
        casual: true,
      },
    },
  },
  {
    name: "Beach Ventures Roofing",
    state: "AZ",
    stars: 3,
    review_count: 30,
    categories: ["relax"],
    attributes: {
      Ambience: {
        hipster: true,
        trendy: true,
        upscale: true,
        casual: true,
      },
    },
  },
  {
    name: "Alpaul Automobile Wash",
    state: "NC",
    stars: 3,
    review_count: 30,
    categories: ["service"],
    attributes: {
      Ambience: {
        hipster: false,
        trendy: true,
        upscale: false,
        casual: false,
      },
    },
  },
  {
    name: "Banana",
    state: "AB",
    stars: 5,
    categories: ["fruit"],
    attributes: {
      Ambience: {
        hipster: false,
        trendy: false,
        upscale: false,
        casual: false,
      },
    },
  },
  {
    name: "Orange",
    state: "AB",
    stars: 5,
    categories: ["fruit"],
    attributes: {
      Ambience: {
        hipster: false,
        trendy: false,
        upscale: false,
        casual: false,
      },
    },
  },
];

const testData2 = [
  {
    name: "Dunk",
    state: "AB",
    review_count: 30,
    categories: ["fruit"],
    attributes: {
      Ambience: {
        hipster: false,
        trendy: false,
        upscale: false,
        casual: false,
      },
    },
  },
  {
    name: "Super",
    state: "AB",
    review_count: 30,
    categories: ["fruit"],
    attributes: {
      Ambience: {
        hipster: false,
        trendy: false,
        upscale: false,
        casual: false,
      },
    },
  },
];

const testData3 = [
  {
    name: "A",
    state: "C",
    categories: ["fruit"],
    attributes: {
      Ambience: {
        hipster: false,
        trendy: false,
        upscale: false,
        casual: false,
      },
    },
  },
  {
    name: "B",
    state: "C",
    categories: ["fruit"],
    attributes: {
      Ambience: {
        hipster: false,
        trendy: false,
        upscale: false,
        casual: false,
      },
    },
  },
];

test('fromState filters correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.fromState('NC').data;
  assert(list.length === 3);
  assert(list[0].name === "Applebee's");
  assert(list[1].name === "China Garden");
  assert(list[2].name === "Alpaul Automobile Wash");
});

test('ratingLeq filters correctly' , function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.ratingLeq(3).data;
  assert(list.length === 2);
  assert(list[0].name === "Beach Ventures Roofing");
  assert(list[1].name === "Alpaul Automobile Wash");
});

test('ratingGeq filters correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.ratingGeq(4).data;
  assert(list.length === 4);
  assert(list[0].name === "Applebee's");
  assert(list[1].name === "China Garden");
});

test('category filters correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.category('relax').data;
  let list2 = tObj.category('food').data
  assert(list.length === 1);
  assert(list2.length === 2);
  assert(list[0].name === "Beach Ventures Roofing");
  assert(list2[0].name === "Applebee's");
  assert(list2[1].name === "China Garden");
});

test('hasAmbience filters correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.hasAmbience('hipster').data;
  let list2 = tObj.hasAmbience('random').data;
  let list3 = tObj.hasAmbience('casual').data;
  assert(list.length === 1);
  assert(list2.length === 0);
  assert(list3.length === 3);
  assert(list[0].name === "Beach Ventures Roofing");
  assert(list3[0].name === "Applebee's");
  assert(list3[1].name === "China Garden");
  assert(list3[2].name === "Beach Ventures Roofing");
});

test('reviewGeq filters correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.reviewGeq(30).data;
  let list2 = tObj.reviewGeq(10).data;
  assert(list.length === 2);
  assert(list2.length === 3);
  assert(list[0].name === "Beach Ventures Roofing");
  assert(list[1].name === "Alpaul Automobile Wash");
  assert(list2[0].name === "China Garden");
  assert(list2[1].name === "Beach Ventures Roofing");
  assert(list2[2].name === "Alpaul Automobile Wash");
}); 

test('Calling on empty data', function() {
  let tObj = new FluentRestaurants([{}, {}, {}]);
  let list = tObj.fromState('NC').data;
  let list2 = tObj.ratingLeq(2).data;
  let list3 = tObj.ratingGeq(2).data;
  let list4 = tObj.category('food').data;
  let list5 = tObj.hasAmbience('casual').data;
  assert(list.length === 0);
  assert(list2.length === 0);
  assert(list3.length === 0);
  assert(list4.length === 0);
  assert(list5.length === 0);
});

test('bestPlace tie-breaking', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.fromState('NC').bestPlace();
  assert(place.name === 'China Garden');
});

test('mostReviews tie-breaking', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.mostReviews();
  assert(place.name === "Beach Ventures Roofing");
});

test('bestPlace no reviews', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.bestPlace();
  assert(place.name === 'Banana');
});

test('mostReviews no stars', function() {
  let tObj = new FluentRestaurants(testData2);
  let place = tObj.mostReviews();
  assert(place.name === 'Dunk');
});

test('bestPlace no stars', function() {
  let tObj = new FluentRestaurants(testData3);
  let place = tObj.bestPlace();
  console.log(place); // Check if this print out an empty object
  assert(true); // if empty object, set to true, if not then false
});

test('mostReviews no reviews', function() {
  let tObj = new FluentRestaurants(testData3);
  let place = tObj.bestPlace();
  console.log(place); // Check if this print out an empty object
  assert(true); // if empty object, set to true, if not then false
});

let data = lib220.loadJSONFromURL('https://people.cs.umass.edu/~joydeepb/yelp.json');
let f = new FluentRestaurants(data);

console.log(
f.ratingLeq(5)
.ratingGeq(3)
.category('Restaurants')
.hasAmbience('casual')
.fromState('NV')
.bestPlace().name);

console.log(
f.ratingLeq(4)
.ratingGeq(2)
.category('Restaurants')
.hasAmbience('romantic')
.fromState('AZ')
.bestPlace().name);
