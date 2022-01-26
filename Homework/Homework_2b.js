let image = lib220.loadImageFromURL('https://people.cs.umass.edu/~joydeepb/robot.jpg');


// imageMapXY
function imageMapXY(img, f) {
  let newImg = img.copy();
  for (let i = 0; i < img.width; ++i) {
    for (let n = 0; n < img.height; ++n) {
        newImg.setPixel(i, n, f(img, i, n));
    }
  }
  return newImg;
}

// imageMap
function imageMap(img, func) {
  let newImg = img.copy();
  for (let i = 0; i < newImg.width; ++i) {
    for (let n = 0; n < newImg.height; ++n) {
      newImg.setPixel(i, n, func(img.getPixel(i, n)));
    }
  }
  return newImg;
}

// blurPixel
function blurPixel(img, x, y) {
  let red = [];
  let green = []
  let blue = [];

  let redMean = 0;
  let greenMean = 0;
  let blueMean = 0;

  let topLeft = [x - 1, y - 1];
  let top = [x, y - 1];
  let topRight = [x + 1, y - 1];
  let left = [x - 1, y];
  let right = [x + 1, y];
  let bottomLeft = [x - 1, y + 1];
  let bottom = [x, y + 1];
  let bottomRight = [x + 1, y + 1];

  red.push(img.getPixel(x, y)[0]);
  green.push(img.getPixel(x, y)[1]);
  blue.push(img.getPixel(x, y)[2]);

  if ((topLeft[0] >= 0 && topLeft[0] < img.width) && (topLeft[1] >= 0 && topLeft[1] < img.height)) {
    red.push(img.getPixel(topLeft[0], topLeft[1])[0]);
    green.push(img.getPixel(topLeft[0], topLeft[1])[1]);
    blue.push(img.getPixel(topLeft[0], topLeft[1])[2]);
  }
  if ((top[0] >= 0 && top[0] < img.width) && (top[1] >= 0 && top[1] < img.height)) {
    red.push(img.getPixel(top[0], top[1])[0]);
    green.push(img.getPixel(top[0], top[1])[1]);
    blue.push(img.getPixel(top[0], top[1])[2]);
  }
  if ((topRight[0] >= 0 && topRight[0] < img.width) && (topRight[1] >= 0 && topRight[1] < img.height)) {
    red.push(img.getPixel(topRight[0], topRight[1])[0]);
    green.push(img.getPixel(topRight[0], topRight[1])[1]);
    blue.push(img.getPixel(topRight[0], topRight[1])[2]);
  }
  if ((left[0] >= 0 && left[0] < img.width) && (left[1] >= 0 && left[1] < img.height)) {
    red.push(img.getPixel(left[0], left[1])[0]);
    green.push(img.getPixel(left[0], left[1])[1]);
    blue.push(img.getPixel(left[0], left[1])[2]);
  }
  if ((right[0] >= 0 && right[0] < img.width) && (right[1] >= 0 && right[1] < img.height)) {
    red.push(img.getPixel(right[0], right[1])[0]);
    green.push(img.getPixel(right[0], right[1])[1]);
    blue.push(img.getPixel(right[0], right[1])[2]);
  }
  if ((bottomLeft[0] >= 0 && bottomLeft[0] < img.width) && (bottomLeft[1] >= 0 && bottomLeft[1] < img.height)) {
    red.push(img.getPixel(bottomLeft[0], bottomLeft[1])[0]);
    green.push(img.getPixel(bottomLeft[0], bottomLeft[1])[1]);
    blue.push(img.getPixel(bottomLeft[0], bottomLeft[1])[2]);
  }
  if ((bottom[0] >= 0 && bottom[0] < img.width) && (bottom[1] >= 0 && bottom[1] < img.height)) {
    red.push(img.getPixel(bottom[0], bottom[1])[0]);
    green.push(img.getPixel(bottom[0], bottom[1])[1]);
    blue.push(img.getPixel(bottom[0], bottom[1])[2]);
  }
  if ((bottomRight[0] >= 0 && bottomRight[0] < img.width) && (bottomRight[1] >= 0 && bottomRight[1] < img.height)) {
    red.push(img.getPixel(bottomRight[0], bottomRight[1])[0]);
    green.push(img.getPixel(bottomRight[0], bottomRight[1])[1]);
    blue.push(img.getPixel(bottomRight[0], bottomRight[1])[2]);
  }

  for (let i = 0; i < red.length; ++i) {
    redMean += red[i];
  }
  if (red.length > 0) {
    redMean /= red.length;
  }
  for (let n = 0; n < green.length; ++n) {
    greenMean += green[n];
  }
  if (green.length > 0) {
    greenMean /= green.length;
  }
  for (let m = 0; m < blue.length; ++m) {
    blueMean += blue[m];
  }
  if (blue.length > 0) {
    blueMean /= blue.length;
  }

  return [redMean, greenMean, blueMean];
}

// blurImage
function blurImage(img) {
  return imageMapXY(img, blurPixel);
}

function blurHalfImage(img, left) {
  // Left
  function halfImageLeft(img, x, y) {
    if (x < img.width/2) {
      return blurPixel(img, x, y);
    }
    else {
      return img.getPixel(x, y);
    }
  }
  // Right
  function halfImageRight(img, x, y) {
    if (x >= img.width/2) {
      return blurPixel(img, x, y);
    }
    else {
      return img.getPixel(x, y);
    }
  }
  // Result
  if (left) {
    return imageMapXY(img, halfImageLeft);
  }
  else {
    return imageMapXY(img, halfImageRight);
  }
}
blurHalfImage(image, true).show();
blurHalfImage(image, false).show();

function isGrayish(p) {
  let max = p[0];
  let min = p[0];
  for (let i = 0; i < p.length; ++i) {
    if (p[i] > max) {
      max = p[i];
    }
    if (p[i] < min) {
      min = p[i];
    }
  }
  if (Math.abs(max - min) < 1/3) {
    return true;
  }
  else {
    return false;
  }
}

function makeGrayish(img) {
  function makeGray(img, x, y) {
    if (isGrayish(img.getPixel(x, y))) {
      return img.getPixel(x, y);
    }
    else {
      let pixel = img.getPixel(x, y);
      let grayPixel = (pixel[0] + pixel[1] + pixel[2])/3;
      return [grayPixel, grayPixel, grayPixel];
    }
  }
  return imageMapXY(img, makeGray);
}
makeGrayish(image).show();

function grayHalfImage(img) {
  function topGray(img, x, y) {
    if (y < img.height/2) {
      let pixel = img.getPixel(x, y);
      let grayPixel = (pixel[0] + pixel[1] + pixel[2])/3;
      return [grayPixel, grayPixel, grayPixel];
    }
    else {
      return img.getPixel(x, y);
    }
  }
  return imageMapXY(img, topGray);
}
grayHalfImage(image).show();

function saturateHigh(img) {
  function bright(img, x, y) {
    let pixel = img.getPixel(x, y);
    let resultPixel = [pixel[0], pixel[1], pixel[2]];
    if (pixel[0] > 2/3) {
      resultPixel[0] = 1;
    }
    if (pixel[1] > 2/3) {
      resultPixel[1] = 1;
    }
    if (pixel[2] > 2/3) {
      resultPixel[2] = 1;
    }
    return resultPixel;
  }
  return imageMapXY(img, bright);
}
saturateHigh(image).show();

function blackenLow(img) {
  function blacken(img, x, y) {
    let pixel = img.getPixel(x, y);
    let resultPixel = [pixel[0], pixel[1], pixel[2]];
    if (pixel[0] < 1/3) {
      resultPixel[0] = 0;
    }
    if (pixel[1] < 1/3) {
      resultPixel[1] = 0;
    }
    if (pixel[2] < 1/3) {
      resultPixel[2] = 0;
    }
    return resultPixel;
  }
  return imageMapXY(img, blacken);
}
blackenLow(image).show();

function reduceFunctions(fa) {
  return p => fa.reduce((acc, elem) => elem(p), p);
}

function contrastGray(img) {
  function functionOne(pixel) {
    let resultPixel = [pixel[0], pixel[1], pixel[2]];
    if (pixel[0] > 2/3) {
      resultPixel[0] = 1;
    }
    if (pixel[1] > 2/3) {
      resultPixel[1] = 1;
    }
    if (pixel[2] > 2/3) {
      resultPixel[2] = 1;
    }
    return resultPixel;
  }
  function functionTwo(pixel) {
    let resultPixel = [pixel[0], pixel[1], pixel[2]];
    if (pixel[0] < 1/3) {
      resultPixel[0] = 0;
    }
    if (pixel[1] < 1/3) {
      resultPixel[1] = 0;
    }
    if (pixel[2] < 1/3) {
      resultPixel[2] = 0;
    }
    return resultPixel;
  }
  function functionThree(pixel) {
    if (isGrayish(pixel)) {
      return pixel;
    }
    else {
      let grayPixel = (pixel[0] + pixel[1] + pixel[2])/3;
      return [grayPixel, grayPixel, grayPixel];
    }
  }
  const funcArray = [functionOne, functionTwo, functionThree];
  return imageMap(img, reduceFunctions(funcArray));
}
contrastGray(image).show();

// TEST

test('imageMapXY function definition is correct', function() {
  function identity(image, x, y) { 
    return image.getPixel(x, y); 
  }
  let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
  let outputImage = imageMapXY(inputImage, identity);
  let p = outputImage.getPixel(0, 0); // output should be an image, getPixel works
  assert(p[0] === 0);
  assert(p[1] === 0);
  assert(p[2] === 0);
  assert(inputImage !== outputImage); // output should be a different image object
});

function pixelEq (p1, p2) {
  const epsilon = 0.002;
  for (let i = 0; i < 3; ++i) {
    if (Math.abs(p1[i] - p2[i]) > epsilon) { 
      return false; 
    }
  }
  return true;
};


test('identity function with imageMapXY', function() {
  let identityFunction = function(image, x, y ) {
    return image.getPixel(x, y);
  };
  let inputImage = lib220.createImage(10, 10, [0.2, 0.2, 0.2]);
  inputImage.setPixel(0, 0, [0.5, 0.5, 0.5]);
  inputImage.setPixel(5, 5, [0.1, 0.2, 0.3]);
  inputImage.setPixel(2, 8, [0.9, 0.7, 0.8]);
  let outputImage = imageMapXY(inputImage, identityFunction);
  assert(pixelEq(outputImage.getPixel(0, 0), [0.5, 0.5, 0.5]));
  assert(pixelEq(outputImage.getPixel(5, 5), [0.1, 0.2, 0.3]));
  assert(pixelEq(outputImage.getPixel(2, 8), [0.9, 0.7, 0.8]));
  assert(pixelEq(outputImage.getPixel(9, 9), [0.2, 0.2, 0.2]));
});

test("Bright Image", function() {
  const image = lib220.createImage(10, 10, [0.8, 0.8, 0.8]); 
  const postImage = saturateHigh(image);
  let pixel = postImage.getPixel(5, 5);
  assert(pixel[0] === 1);
  assert(pixel[1] === 1);
  assert(pixel[2] === 1);
});

test("Black Image", function() {
  const image = lib220.createImage(10, 10, [0.2, 0.2, 0.2]);
  const postImage = blackenLow(image);
  let pixel = postImage.getPixel(5, 5);
  assert(pixel[0] === 0);
  assert(pixel[1] === 0);
  assert(pixel[2] === 0);
});

test("Function Array With 1 Element", function() {
  const image = lib220.createImage(10, 10, [0.2, 0.2, 0.2]);
  const funcArray = [x => x.map(e => e * 2)];
  const postImage = imageMap(image, reduceFunctions(funcArray));
  let pixel = postImage.getPixel(5, 5);
  assert(pixel[0] === 0.4);
  assert(pixel[1] === 0.4);
  assert(pixel[2] === 0.4);
});

test("Function Array With 0 Element", function() {
  const image = lib220.createImage(10, 10, [1, 1, 1]);
  const funcArray = [];
  const postImage = imageMap(image, reduceFunctions(funcArray));
  let pixel = postImage.getPixel(5, 5);
  console.log(pixel);
  assert(pixel[0] === 1);
  assert(pixel[1] === 1);
  assert(pixel[2] === 1);
});