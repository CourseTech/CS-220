function imageMapXY(img, f) {
  let newImg = img.copy();
  for (let i = 0; i < img.width; ++i) {
    for (let n = 0; n < img.height; ++n) {
        newImg.setPixel(i, n, f(img, i, n));
    }
  }
  return newImg;
}
let url = 'https://people.cs.umass.edu/~joydeepb/robot.jpg';
let robot = lib220.loadImageFromURL(url);
imageMapXY(robot, function(img, x, y) {
return [img.getPixel(x, y)[0], 0, 0];
}).show();

function imageMask(img, cond, maskValue) {
  function newFunc(img, x, y) {
    if (cond(img, x, y) === true) {
      return maskValue;
    }
    else {
      return img.getPixel(x, y);
    }
  }
  return imageMapXY(img, newFunc);
}
let urlTwo = 'https://people.cs.umass.edu/~joydeepb/robot.jpg';
let robotTwo = lib220.loadImageFromURL(urlTwo);
imageMask(robotTwo, function(img,x,y){ return (y % 10 === 0); }, [1, 0,
0]).show();

function imageMapCond(img, cond, func) {
  function innerFunc(img, x, y) {
    if (cond(img, x, y)) {
      return func(img.getPixel(x, y));
    }
    else {
      return img.getPixel(x, y);
    }
  }
  return imageMapXY(img, innerFunc);
}

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

function blurImage(img) {
  return imageMapXY(img, blurPixel);
}

let urlThree = 'https://people.cs.umass.edu/~joydeepb/robot.jpg';
let robotThree = lib220.loadImageFromURL(urlThree);
blurImage(robotThree).show();

// TESTS

test('imageMapXY function definition is correct', function() {
  function identity(image, x, y) { return image.getPixel(x, y); }
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

test("blue image", function() {
  const image = lib220.createImage(100, 100, [0.2, 0.4, 0.8]);
  let newImg = imageMapXY(image, function(img, x, y) {
    return [0, 0, img.getPixel(x, y)[2]];
  });
  assert(newImg.getPixel(10,10) === [0, 0, image.getPixel(0,0)[2]]); //They are equal but it failed...
});

test("blur corner", function() {
  let image = lib220.loadImageFromURL('https://people.cs.umass.edu/~joydeepb/robot.jpg');
  let newImg = blurImage(image);
  let newPixel = newImg.getPixel(0, 0);
  assert(newPixel[0] === 0.3235294117647059);
  assert(newPixel[1] === 0.2607843137254902);
  assert(newPixel[2] === 0.16666666666666669);
  //Numbers got distored??
});