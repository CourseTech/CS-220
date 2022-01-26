let robot = lib220.loadImageFromURL('http://people.cs.umass.edu/~joydeepb/robot.jpg');

//highlightEdges(img: Image): Image
function highlightEdges(img) {
  let newImg = img.copy();
  for (let i = 0; i < img.width; ++i) {
    for (let n = 0; n < img.height - 1; ++n) {
      let arr1 = newImg.getPixel(i, n);
      let m1 = Math.abs((arr1[0] + arr1[1] + arr1[2]) / 3);
      let arr2 = newImg.getPixel(i, n + 1);
      let m2 = Math.abs((arr2[0] + arr2[1] + arr2[2]) / 3);
      let pixelM = m1 - m2;
      if (pixelM > 1) {
        pixelM = 1;
      }
      else if(pixelM < 0) {
        pixelM = 0;
      }
      newImg.setPixel(i, n, [pixelM, pixelM, pixelM]);
    }
  }
  return newImg;
}
highlightEdges(robot).show();

function blur(img) {
  let newImg = img.copy();
  for (let i = 0; i < img.width; ++i) {
    for (let n = 0; n < img.height; ++n) {

      let r = [];
      let g = [];
      let b = [];
      let meanRed = 0;
      let meanGreen = 0;
      let meanBlue = 0;

      let topLeft = [i - 1, n - 1];
      let top = [i, n - 1];
      let topRight = [i + 1, n - 1];
      let left = [i - 1, n];
      let center = [i, n];
      let right = [i + 1, n];
      let bottomLeft = [i - 1, n + 1];
      let bottom = [i, n + 1];
      let bottomRight = [i + 1, n + 1];

      if ((topLeft[0] >= 0 && topLeft[0] < img.width) && (topLeft[1] >= 0 && topLeft[1] < img.height)) {
        r.push(img.getPixel(topLeft[0], topLeft[1])[0]);
        g.push(img.getPixel(topLeft[0], topLeft[1])[1]);
        b.push(img.getPixel(topLeft[0], topLeft[1])[2]);
      }
      if ((top[0] >= 0 && top[0] < img.width) && (top[1] >= 0 && top[1] < img.height)) {
        r.push(img.getPixel(top[0], top[1])[0]);
        g.push(img.getPixel(top[0], top[1])[1]);
        b.push(img.getPixel(top[0], top[1])[2]);
      }
      if ((topRight[0] >= 0 && topRight[0] < img.width) && (topRight[1] >= 0 && topRight[1] < img.height)) {
        r.push(img.getPixel(topRight[0], topRight[1])[0]);
        g.push(img.getPixel(topRight[0], topRight[1])[1]);
        b.push(img.getPixel(topRight[0], topRight[1])[2]);
      }
      if ((left[0] >= 0 && left[0] < img.width) && (left[1] >= 0 && left[1] < img.height)) {
        r.push(img.getPixel(left[0], left[1])[0]);
        g.push(img.getPixel(left[0], left[1])[1]);
        b.push(img.getPixel(left[0], left[1])[2]);
      }

      r.push(img.getPixel(center[0], center[1])[0]);
      g.push(img.getPixel(center[0], center[1])[1]);
      b.push(img.getPixel(center[0], center[1])[2]);
      
      if ((right[0] >= 0 && right[0] < img.width) && (right[1] >= 0 && right[1] < img.height)) {
        r.push(img.getPixel(right[0], right[1])[0]);
        g.push(img.getPixel(right[0], right[1])[1]);
        b.push(img.getPixel(right[0], right[1])[2]);
      }
      if ((bottomLeft[0] >= 0 && bottomLeft[0] < img.width) && (bottomLeft[1] >= 0 && bottomLeft[1] < img.height)) {
        r.push(img.getPixel(bottomLeft[0], bottomLeft[1])[0]);
        g.push(img.getPixel(bottomLeft[0], bottomLeft[1])[1]);
        b.push(img.getPixel(bottomLeft[0], bottomLeft[1])[2]);
      }
      if ((bottom[0] >= 0 && bottom[0] < img.width) && (bottom[1] >= 0 && bottom[1] < img.height)) {
        r.push(img.getPixel(bottom[0], bottom[1])[0]);
        g.push(img.getPixel(bottom[0], bottom[1])[1]);
        b.push(img.getPixel(bottom[0], bottom[1])[2]);
      }
      if ((bottomRight[0] >= 0 && bottomRight[0] < img.width) && (bottomRight[1] >= 0 && bottomRight[1] < img.height)) {
        r.push(img.getPixel(bottomRight[0], bottomRight[1])[0]);
        g.push(img.getPixel(bottomRight[0], bottomRight[1])[1]);
        b.push(img.getPixel(bottomRight[0], bottomRight[1])[2]);
      }
      
      for (let x = 0; x < r.length; ++x) {
        meanRed += r[x];
      }
      meanRed /= r.length;
      for (let y = 0; y < g.length; ++y) {
        meanGreen += g[y];
      }
      meanGreen /= g.length;
      for (let z = 0; z < b.length; ++z) {
        meanBlue += b[z];
      }
      meanBlue /= b.length;

      newImg.setPixel(i, n, [meanRed, meanGreen, meanBlue]);
    }
  }
  
  return newImg;
}
blur(robot).show();

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

function swapGB(img) {
  function swapColor(arr) {
    return [arr[0], arr[2], arr[1]];
  }
  return imageMap(img, swapColor);
}
swapGB(robot).show();

function shiftRGB(img) {
  function shiftColor(arr) {
    let r = arr[0];
    let g = arr[1];
    let b = arr[2];
    return [b, r, g];
  }
  return imageMap(img, shiftColor);
}
shiftRGB(robot).show();

test ('blur image', function() {
  const image = lib220.createImage(100, 100, [0.2, 0.4, 0.8]);
  const postImage = blur(image);
  const center = postImage.getPixel(50, 50);
  assert(center[0] === 0.2);
  assert(center[1] === 0.4);
  assert(center[2] === 0.8);
});

test ('swap green and blue', function() {
  const image = lib220.createImage(100, 100, [0.2, 0.4, 0.8]);
  const postImage = swapGB(image);
  const center = postImage.getPixel(50, 50);
  assert(center[1] === 0.8);
  assert(center[2] === 0.4);
});

test ('shift red, blue, and green', function() {
  const image = lib220.createImage(100, 100, [0.2, 0.4, 0.8]);
  const postImage = shiftRGB(image);
  const center = postImage.getPixel(50, 50);
  assert(center[0] === 0.8);
  assert(center[1] === 0.2);
  assert(center[2] === 0.4);
});