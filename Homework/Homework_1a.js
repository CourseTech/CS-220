let robot = lib220.loadImageFromURL('http://people.cs.umass.edu/~joydeepb/robot.jpg');

let copyOne = robot.copy();
//removeBlueAndGreen(image: Image): Image
function removeBlueAndGreen(image) {
  let newImg = image.copy();
  for (let i = 0; i < image.width; ++i) {
    for (let n = 0; n < image.height; ++n) {
      let r = image.getPixel(i, n)[0];
      newImg.setPixel(i, n, [r, 0, 0]);
    }
  }
  return newImg;
}
removeBlueAndGreen(copyOne).show();

let copyTwo = robot.copy();
//makeGrayscale(image: Image): Image
function makeGrayscale(image) {
  let newImg = image.copy();
  for (let i = 0; i < image.width; ++i) {
    for (let n = 0; n < image.height; ++n) {
      let m = (image.getPixel(i, n)[0] + image.getPixel(i, n)[1] + image.getPixel(i, n)[2]) / 3;
      newImg.setPixel(i, n, [m, m, m]);
    }
  }
  return newImg;
}
makeGrayscale(copyTwo).show();

// imageMap(img: Image, func:(p: Pixel) => Pixel):Image
function imageMap(img, func) {
  let newImg = img.copy();
  for (let i = 0; i < newImg.width; ++i) {
    for (let n = 0; n < newImg.height; ++n) {
      let arr = img.getPixel(i, n);
      newImg.setPixel(i, n, func(arr));
    }
  }
  return newImg;
}

function mapToRed(img) {
  function mapPixelToRed(p) {
    let r = p[0];
    return [r, 0, 0];
  }
  return imageMap(img, mapPixelToRed);
}
function mapToGrayscale(img) {
    function mapPixelToGray(p) {
      let m = (p[0] + p[1] + p[2]) / 3;
      return [m, m, m];
    }
  return imageMap(img, mapPixelToGray);
}

test ('removeBlueAndGreen function definition is correct', function () { 
  const white = lib220.createImage(10, 10, [1, 1, 1]); 
  removeBlueAndGreen(white).getPixel(0 ,0); 
  // no assertion, just checks that the code runs to completion 
});

test ('No blue or green in removeBlueAndGreen result', function () { 
  // Create a test image , of size 10 pixels x 10 pixels , and set it to all white. 
  const white = lib220.createImage(10, 10, [1, 1, 1]); 
  // Get the result of the function . 
  const shouldBeRed = removeBlueAndGreen(white); 
  // Read the center pixel . 
  const pixelValue = shouldBeRed.getPixel(5, 5); 
  // The red channel should be unchanged . 
  assert(pixelValue [0] === 1); 
  // The green channel should be 0. 
  assert(pixelValue [1] === 0); 
  // The blue channel should be 0. 
  assert(pixelValue [2] === 0); 
});

function pixelEq(p1, p2) { 
  const epsilon = 0.002; 
  for (let i = 0; i < 3; ++ i) { 
    if (Math.abs(p1[i] - p2[i]) > epsilon) { 
      return false; 
    } 
  } 
  return true; 
};

test ('Check pixel equality ', function () { 
  const inputPixel = [0.5, 0.5, 0.5] 
  // Create a test image , of size 10 pixels x 10 pixels , and set it to the inputPixel 
  const image = lib220.createImage(10, 10, inputPixel); 
  // Process the image. 
  const outputImage = removeBlueAndGreen(image); 
  // Check the center pixel. 
  const centerPixel = outputImage.getPixel(5, 5); 
  assert(pixelEq(centerPixel, [0.5, 0, 0])); 
  // Check the top - left corner pixel. 
  const cornerPixel = outputImage.getPixel(0, 0); 
  assert(pixelEq(cornerPixel, [0.5, 0, 0])); 
});

test ('Only red pixels', function() {
  const image = lib220.createImage (100, 100, [1, 1, 1]);
  const postImage = mapToRed(image);
  const pixelValue = postImage.getPixel(50, 50);
  assert (pixelValue[0] === 1);
  assert (pixelValue[1] === 0);
  assert (pixelValue[2] === 0);
});

test ('Only gray pixels', function() {
  const image = lib220.createImage (100, 100, [0.3, 0.6, 0.9]);
  const postImage = mapToGrayscale(image);
  const pixelValue = postImage.getPixel(50, 50);
  assert (pixelValue[0] === 0.6);
  assert (pixelValue[1] === 0.6);
  assert (pixelValue[2] === 0.6);
});

test ('Only gray pixels', function() {
  const image = lib220.createImage (100, 100, [0.7, 0.8, 0.9]);
  const postImage = makeGrayscale(image);
  const pixelValue = postImage.getPixel(50, 50);
  assert (pixelValue[0] === 0.8);
  assert (pixelValue[1] === 0.8);
  assert (pixelValue[2] === 0.8);
});