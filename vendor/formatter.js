$.get(`${"/* @echo API_URL */"}projects/${"/* @echo PROJECT_ID */"}`).then((data) => {
  this.elements = JSON.parse(data).elements;
  this.baseColors = JSON.parse(data).baseColors;
  getChromosome();
});

const getChromosome = () => {
  this.trackingId = getCookie('tracking_id');
  if (this.trackingId) {
    $.get(`${"/* @echo API_URL */"}chromosomes/${this.trackingId}`).then((data) => {
      applyChromosome(data);
    });
  } else {
    // TODO: SPECIFY PROJECT ID IN CHROMOSOME REQUEST.
    $.get(`${"/* @echo API_URL */"}chromosomes/request?project_id=${"/* @echo PROJECT_ID */"}`).then((data) => {
      setCookie('tracking_id', JSON.parse(data).trackingId);
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
      const replaced = replaceInFile(response, [...this.baseColors], [...this.chromosome.palette.colors]);
      const body = $('body');
      const style = document.createElement('style');

      body.append(style);
      style.type = 'text/css';
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
  const cssFiles = ['guideline.css', 'base.css'];
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
