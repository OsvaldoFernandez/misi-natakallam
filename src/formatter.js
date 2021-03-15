$.get(`${"/* @echo API_URL */"}projects/${"/* @echo PROJECT_ID */"}`).then((data) => {
  this.elements = JSON.parse(data).elements;
  this.baseColors = JSON.parse(data).baseColors;
  getChromosome();
});

const getCookie = (c_name) => {
  return localStorage.getItem(c_name);
}

const setCookie = (c_name, value) => {
  return localStorage.setItem(c_name, value);
}

const getChromosome = () => {
  this.trackingId = getCookie('tracking_id');
  if (this.trackingId) {
    $.get(`${"/* @echo API_URL */"}chromosomes/UA-158607365-1`).then((data) => {
      applyChromosome(data);
    });
  } else {
    $.get(`${"/* @echo API_URL */"}chromosomes/request?project_id=${"/* @echo PROJECT_ID */"}`).then((data) => {
      //setCookie('tracking_id', JSON.parse(data).trackingId);
      setCookie('tracking_id', 'UA-158607365-1');
      window.trackingID = JSON.parse(data).trackingId;
      setTag();
      applyChromosome(data);
    });
  }
}

const applyChromosome = (data) => {
  this.chromosome = JSON.parse(data);
  swap();
  recolor(this.chromosome);
  recolorMap(this.chromosome.colors);
  initCarousels();
}

const replaceInFile = (file, originalColors, colors) => {
  if (originalColors.length) {
    return replaceInFile(file.split(originalColors.shift()).join(colors.shift()), originalColors, colors)
  } else {
    return file;
  }
}

const addCustomStyle = (cssFile) => {
  $.when($.get(`./css/${cssFile}`))
    .done((response) => {
      let replaced = replaceInFile(response, [...this.baseColors], [...this.chromosome.colors]);
      const body = $('body');
      const style = document.createElement('style');

      body.append(style);
      style.type = 'text/css';
      replaced += `${Object.keys(chromosome.styling)[0]} ${Object.values(chromosome.styling)[0]}`;
      if (style.styleSheet){
        // This is required for IE8 and below.
        style.styleSheet.cssText = replaced;
      } else {
        style.appendChild(document.createTextNode(replaced));
      }
    }
  );
}

const recolor = (chromosome) => {
  const cssFiles = ['guidelines.css', 'base.css'];
  cssFiles.forEach((file) => {
    addCustomStyle(file);
  });
};

const swapDivs = (selector1, selector2, index, j) => {
   // Swapping divs
   const div1 = $(`.${selector1}`);
   const div2 = $(`.${selector2}`);
   const preDiv1 = div1.prev();
   const preDiv2 = div2.prev();
   const parentDiv1 = div1.parent();
   const parentDiv2 = div2.parent();

   // TO SWAP: ATTACH TO PREVIOUS. IF NOT PREVIOUS => ITS THE FIRST ELEMENT =>
   // IF FIRST ELEMENT => PREPEND TO PARENT.

   if (preDiv1.length) {
     preDiv1.after(div2);
   } else {
     parentDiv1.prepend(div2);
   }

   if (preDiv2.length) {
     preDiv2.after(div1);
   } else {
     parentDiv2.prepend(div1);
   }

   // Swapping reference chromosome to obtain indexes
   let tmp = this.elements[index][j];
   this.elements[index][j] = this.elements[index][j + 1];
   this.elements[index][j + 1] = tmp;
 }

let bubbleSort = (candidates, index) => {
  const len = candidates.length;
  for (let i = 0; i < len -1; i++) {
    for (let j = 0; j < len -1 -i; j++) {
      if (isGreater(candidates[j], candidates[j + 1], index)) {
        swapDivs(candidates[j], candidates[j + 1], index, j)
      }
    }
  }
};

const isGreater = (selector1, selector2, index) => {
  const cands = this.chromosome.elements[index];
  const index1 = cands.findIndex((elem) => elem == selector1);
  const index2 = cands.findIndex((elem) => elem == selector2);
  return index1 > index2;
};

const swap = () => {
  this.elements.forEach((candidates, index) => {
   bubbleSort(candidates, index);
  });
}

// TODO: When swapping first div it sticks focus to that one, even if there is other on above.
const focus = () => {
   $(window).scrollTop(0);
};
setTimeout(focus, 10);

function lightenDarkenColor(col, amt) {
  var num = parseInt(col, 16);
  var r = (num >> 16) + amt;
  var b = ((num >> 8) & 0x00FF) + amt;
  var g = (num & 0x0000FF) + amt;
  var newColor = g | (b << 8) | (r << 16);
  return newColor.toString(16);
}

const recolorMap = (colors) => {
  recolorImage('.map-1', colors[1]);
  recolorImage('.map-2', '#'+lightenDarkenColor(colors[2].split('#')[1], -40));
  recolorImage('.map-3', colors[0]);
};

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

function recolorImage(klass, color) {
  const img = $(klass)[0];
  var c = document.createElement('canvas');
  var ctx = c.getContext("2d");
  var w = img.width;
  var h = img.height;

  c.width = w;
  c.height = h;

  // draw the image on the temporary canvas
  ctx.drawImage(img, 0, 0, w, h);

  // pull the entire image into an array of pixel data
  var imageData = ctx.getImageData(0, 0, w, h);

  // examine every pixel,
  // change any old rgb to the new-rgb
  for (var i = 0; i < imageData.data.length; i += 4) {
      // is this pixel the old rgb?
      if (imageData.data[i] > 250 &&  imageData.data[i] <= 255 &&
        imageData.data[i+1] > 250 &&  imageData.data[i+1] <= 255 &&
        imageData.data[i+2] > 250 &&  imageData.data[i+2] <= 255) {
          // change to your new rgb
          imageData.data[i] = hexToRgb(color).r;
          imageData.data[i + 1] = hexToRgb(color).g;
          imageData.data[i + 2] = hexToRgb(color).b;
      }
  }
  // put the altered data back on the canvas
  ctx.putImageData(imageData, 0, 0);
  // put the re-colored image back on the image
  var img1 = $(klass)[0];
  img1.src = c.toDataURL('image/png');

}
