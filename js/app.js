// Cycle through the three reference spreads instead of generating new random positions.
const receiptLayouts = [[[850.65, 153.15, 25], [1084.47, 419.15, -10], [1741.61, 427.21, 30], [1745.64, 890.7, 86], [1935.12, 697.24, -13], [850.65, 705.3, 90], [886.93, 1144.61, 12], [1092.54, 918.91, 18], [1398.93, 1152.67, -26]], [[745.83, 60.45, -45], [636.98, 1205.06, -14], [1314.27, 1096.24, 30], [870.8, 431.24, 12], [1709.35, 447.36, -15], [878.87, 1003.55, 90], [1084.47, 906.82, -28], [1669.04, 926.97, 86], [1358.61, 334.52, 15]], [[1519.87, 1257.45, -40], [1140.91, 673.06, -10], [1455.37, 886.67, 30], [878.87, 987.42, 12], [806.3, 467.52, 40], [1294.11, 149.12, -35], [939.34, 1249.39, -28], [1669.04, 660.97, -18], [1882.71, 108.82, 14]]];
let receiptLayoutIndex = 0;
function applyReceiptLayout(index) {
 document.getElementById('yellow-page').classList.remove('is-stacked');
 document.querySelector('.stack-receipts').setAttribute('aria-pressed', 'false');
 document.getElementById('yellow-page').classList.remove('is-sorted');
 document.querySelector('.sort-receipts').setAttribute('aria-pressed', 'false');
 receiptLayoutIndex = index % receiptLayouts.length;
 document.querySelectorAll('.scattered-receipt').forEach((receipt, i) => {
  const [x, y, angle] = receiptLayouts[receiptLayoutIndex][i];
  receipt.style.width = '';
  receipt.style.zIndex = '';
  receipt.style.left = (x / 2048 * 100) + 'vw';
  receipt.style.top = (y / 1330 * 100) + 'svh';
  receipt.style.setProperty('--receipt-angle', angle + 'deg');
 });
}

// Match the SORT reference: five upright receipts on top, four below.
const sortedReceiptPositions = [[733, 409, 240], [1013, 409, 240], [1285, 412, 240], [1561, 415, 240], [1839, 415, 240], [733, 891, 240], [1013, 892, 240], [1284, 891, 240], [1561, 895, 240]];
function sortReceipts() {
 document.getElementById('yellow-page').classList.remove('is-stacked');
 document.querySelector('.stack-receipts').setAttribute('aria-pressed', 'false');
 document.getElementById('yellow-page').classList.add('is-sorted');
 document.querySelector('.sort-receipts').setAttribute('aria-pressed', 'true');
 const page = document.getElementById('yellow-page');
 const box = page.getBoundingClientRect();
 const gapX = box.width * .02, gapY = box.height * .045;
 const area = {left:box.width*.30, top:box.height*.145, width:box.width*.66, height:box.height*.70};
 const cellW = (area.width - gapX*4)/5;
 const cellH = (area.height - gapY)/2;
 document.querySelectorAll('.scattered-receipt').forEach((receipt, i) => {
  const ratio = receipt.naturalWidth / receipt.naturalHeight || .565;
  const width = Math.min(cellW, cellH*ratio);
  const col = i%5, row = Math.floor(i/5);
  receipt.style.zIndex = '';
  receipt.style.width = width / box.width * 100 + 'vw';
  receipt.style.left = (area.left + col*(cellW+gapX) + cellW/2)/box.width*100 + 'vw';
  receipt.style.top = (area.top + row*(cellH+gapY) + cellH/2)/box.height*100 + 'svh';
  receipt.style.setProperty('--receipt-angle', '0deg');
 });
}
document.querySelector('.sort-receipts').addEventListener('click', sortReceipts);


// Upright pile measured from the STACK reference, Plant Shed on top.
const stackedReceiptPositions = [[1235, 617], [1245, 624], [1252, 630], [1240, 636], [1268, 634], [1225, 628], [1248, 638], [1256, 640], [1230, 625]];
function stackReceipts() {
 const page = document.getElementById('yellow-page');
 page.classList.remove('is-sorted');
 page.classList.add('is-stacked');
 document.querySelector('.sort-receipts').setAttribute('aria-pressed', 'false');
 document.querySelector('.stack-receipts').setAttribute('aria-pressed', 'true');
 document.querySelectorAll('.scattered-receipt').forEach((receipt, i) => {
  const [x, y] = stackedReceiptPositions[i];
  receipt.style.width = (240 / 2048 * 100) + 'vw';
  receipt.style.left = (x / 2048 * 100) + 'vw';
  receipt.style.top = (y / 1330 * 100) + 'svh';
  receipt.style.zIndex = String(i === 4 ? 15 : i + 1);
  receipt.style.setProperty('--receipt-angle', '0deg');
 });
}
document.querySelector('.stack-receipts').addEventListener('click', stackReceipts);

document.querySelector('.randomize-receipts').addEventListener('click', () => {
 applyReceiptLayout(receiptLayoutIndex + 1);
});
applyReceiptLayout(0);
let previousPage = '';

const destinations = ['yellow-page', 'pink-page', 'blue-page'];
function renderPage() {
 const page = location.hash.slice(1);
 if (page === 'yellow-page' && previousPage !== 'yellow-page') applyReceiptLayout(0);
 previousPage = page;
 const isDestination = destinations.includes(page);
 document.body.classList.toggle('show-blank', isDestination);
 document.querySelectorAll('.blank-page').forEach(section => {
  section.classList.toggle('active', section.id === page);
 });
 document.title = isDestination ? page.replace('-page', '').toUpperCase() + ' — Yui' : "Yui's Daily Habit Tracker";
 if (isDestination) window.scrollTo({top: 0, behavior: 'instant'});
 else if (page === 'tracker') {
  requestAnimationFrame(() => document.getElementById('tracker').scrollIntoView({behavior: 'instant', block: 'start'}));
 }
}
window.addEventListener('hashchange', renderPage);
renderPage();

const aboutTrigger = document.querySelector('.about-trigger');
const aboutDialog = document.querySelector('.about-dialog');
let savedOverflow = '';
aboutTrigger.addEventListener('click', () => {
 savedOverflow = document.body.style.overflow;
 document.body.style.overflow = 'hidden';
 aboutDialog.showModal();
});
aboutDialog.addEventListener('click', event => {
 // Close on the black space surrounding the artwork, including letterboxing.
 const image = aboutDialog.querySelector('img');
 const box = image.getBoundingClientRect();
 const scale = Math.min(box.width / image.naturalWidth, box.height / image.naturalHeight);
 const width = image.naturalWidth * scale;
 const height = image.naturalHeight * scale;
 const x = (event.clientX - box.left - (box.width - width) / 2) / width;
 const y = (event.clientY - box.top - (box.height - height) / 2) / height;
 if (x < .285 || x > .69 || y < .09 || y > .84) aboutDialog.close();
});
aboutDialog.addEventListener('close', () => {
 document.body.style.overflow = savedOverflow;
 aboutTrigger.focus({preventScroll: true});
});

// Drag only in Randomize mode; layout buttons always restore their reference positions.
let dragZ = 30;
document.querySelectorAll('.scattered-receipt').forEach(receipt => {
 let drag = null;
 receipt.addEventListener('pointerdown', event => {
  const page = document.getElementById('yellow-page');
  if (page.classList.contains('is-sorted') || page.classList.contains('is-stacked') || event.button !== 0) return;
  event.preventDefault();
  const box = page.getBoundingClientRect();
  drag = {id:event.pointerId, x:event.clientX, y:event.clientY, left:parseFloat(receipt.style.left)/100*box.width, top:parseFloat(receipt.style.top)/100*box.height, width:box.width, height:box.height};
  receipt.setPointerCapture(event.pointerId);
  receipt.classList.add('is-dragging');
  receipt.style.zIndex = String(++dragZ);
 });
 receipt.addEventListener('pointermove', event => {
  if (!drag || drag.id !== event.pointerId) return;
  receipt.style.left = ((drag.left + event.clientX - drag.x)/drag.width*100)+'vw';
  receipt.style.top = ((drag.top + event.clientY - drag.y)/drag.height*100)+'svh';
 });
 const finish = event => {
  if (!drag || drag.id !== event.pointerId) return;
  drag = null;
  receipt.classList.remove('is-dragging');
  if (receipt.hasPointerCapture(event.pointerId)) receipt.releasePointerCapture(event.pointerId);
 };
 receipt.addEventListener('pointerup', finish);
 receipt.addEventListener('pointercancel', finish);
 receipt.addEventListener('lostpointercapture', finish);
});

// Refit the sorted grid after a viewport change or image decoding.
window.addEventListener('resize', () => {
 if (document.getElementById('yellow-page').classList.contains('is-sorted')) sortReceipts();
});
document.querySelectorAll('.scattered-receipt').forEach(receipt => receipt.addEventListener('load', () => {
 if (document.getElementById('yellow-page').classList.contains('is-sorted')) sortReceipts();
}));

// Only the YUI ticket can be moved, with mouse, pen or touch.
const yuiTicket = document.querySelector('.ticket-yui');
const pinkRefresh = document.querySelector('.pink-refresh');
const yuiInitialStyle = {left:yuiTicket.style.left, top:yuiTicket.style.top, width:yuiTicket.style.width};
let yuiDrag = null;
yuiTicket.addEventListener('pointerdown', event => {
 if (event.button !== 0 || yuiTicket.classList.contains('is-placed')) return;
 event.preventDefault();
 const pageBox = document.getElementById('pink-page').getBoundingClientRect();
 yuiDrag = {id:event.pointerId,x:event.clientX,y:event.clientY,left:parseFloat(yuiTicket.style.left)/100*pageBox.width,top:parseFloat(yuiTicket.style.top)/100*pageBox.height,width:pageBox.width,height:pageBox.height};
 yuiTicket.setPointerCapture(event.pointerId);
 yuiTicket.classList.add('is-dragging');
 yuiTicket.style.zIndex = '10';
});
yuiTicket.addEventListener('pointermove', event => {
 if (!yuiDrag || event.pointerId !== yuiDrag.id) return;
 yuiTicket.style.left = (yuiDrag.left+event.clientX-yuiDrag.x)/yuiDrag.width*100+'vw';
 yuiTicket.style.top = (yuiDrag.top+event.clientY-yuiDrag.y)/yuiDrag.height*100+'svh';
});
function finishYuiDrag(event) {
 if (!yuiDrag || event.pointerId !== yuiDrag.id) return;
 if (event.type === 'pointerup') {
  const cards = document.querySelector('.pink-cards').getBoundingClientRect();
  const ticket = yuiTicket.getBoundingClientRect();
  const cx = ticket.left + ticket.width/2, cy = ticket.top + ticket.height/2;
  if (cx >= cards.left && cx <= cards.right && cy >= cards.top + cards.height*.67 && cy <= cards.bottom) {
   yuiTicket.classList.add('is-placed');
   pinkRefresh.hidden = false;
   yuiTicket.setAttribute('aria-label', 'YUI ticket placed on the card');
   positionPlacedYui();
  }
 }
 yuiDrag = null;
 yuiTicket.classList.remove('is-dragging');
 if (yuiTicket.hasPointerCapture(event.pointerId)) yuiTicket.releasePointerCapture(event.pointerId);
}
['pointerup','pointercancel','lostpointercapture'].forEach(name => yuiTicket.addEventListener(name, finishYuiDrag));

function positionPlacedYui() {
 if (!yuiTicket.classList.contains('is-placed')) return;
 const cards = document.querySelector('.pink-cards').getBoundingClientRect();
 const page = document.getElementById('pink-page').getBoundingClientRect();
 if (!cards.width || !page.width) return;
 yuiTicket.style.left = (cards.left-page.left+cards.width*.136)/page.width*100+'vw';
 yuiTicket.style.top = (cards.top-page.top+cards.height*.743)/page.height*100+'svh';
 yuiTicket.style.width = cards.width*.728/page.width*100+'vw';
}
window.addEventListener('resize', positionPlacedYui);
window.addEventListener('hashchange', () => requestAnimationFrame(positionPlacedYui));

function resetPinkPuzzle() {
 yuiDrag = null;
 yuiTicket.classList.remove('is-placed');
 yuiTicket.classList.remove('is-dragging');
 Object.assign(yuiTicket.style, yuiInitialStyle);
 yuiTicket.style.zIndex = '';
 yuiTicket.setAttribute('aria-label', 'YUI ticket, draggable');
 pinkRefresh.hidden = true;
 yuiTicket.focus({preventScroll:true});
}
pinkRefresh.addEventListener('click', resetPinkPuzzle);

document.querySelector('.about-back').addEventListener('click', event => {
  event.stopPropagation();
  aboutDialog.close();

  requestAnimationFrame(() => {
    location.hash = 'tracker';

    document.getElementById('tracker').scrollIntoView({
      behavior: 'instant',
      block: 'start'
    });
  });
});


const bookImage = document.querySelector('.reading-book-image');
const bookTabs = document.querySelector('.book-tabs');

const bookPages = [
  'pink page.png',
  'green page.png',
  'cream page.png',
  'blue page.png',
  'orange page.png',
  'turqouise page.png',
  'salmon page.png'
];

// Each tab's vertical position, as a percentage of the image.
const tabTops = [8.75, 22.55, 36.53, 49.8, 63.23, 75.5, 88.15];

// Positions for tabs belonging to pages already turned.
const turnedTabs = [
  [19.35, 9.2],
  [24, 7.55],
  [29.25, 8.5],
  [34.25, 11.5],
  [39, 8.2],
  [44, 8.2],
  [91.8, 8.2]
];

// Positions for tabs belonging to pages ahead.
const forwardTabs = [
  [52.2, 11.6],
  [59.3, 9],
  [66, 8.5],
  [72, 11.5],
  [78.55, 8.2],
  [85.3, 8.2],
  [91.8, 8.2]
];

function openBookPage(pageIndex) {
  bookImage.src = 'assets/images/' + bookPages[pageIndex];
  bookImage.alt = `Name and identity book, page ${pageIndex + 1}`;

  bookTabs.querySelectorAll('.book-tab').forEach((button, index) => {
    // Tabs behind the current page move to the left.
    const [left, width] = index < pageIndex
      ? turnedTabs[index]
      : forwardTabs[index];

    button.style.left = left + '%';
    button.style.width = width + '%';
    button.style.top = tabTops[index] + '%';
    button.style.height = '5.9%';

    if (index === pageIndex) {
      button.setAttribute('aria-current', 'page');
    } else {
      button.removeAttribute('aria-current');
    }
  });
}

// Create the seven clickable areas once.
bookPages.forEach((filename, index) => {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = 'book-tab';
  button.setAttribute('aria-label', `Open page ${index + 1}`);

  button.addEventListener('click', () => {
    openBookPage(index);
  });

  bookTabs.appendChild(button);
});

function showBookCover() {
  bookImage.src = 'assets/images/book-cover.png';
  bookImage.alt = 'Name and Identity book cover';

  bookTabs.querySelectorAll('.book-tab').forEach((button, index) => {
    const [left, width] = forwardTabs[index];

    button.style.left = left + '%';
    button.style.width = width + '%';
    button.style.top = tabTops[index] + '%';
    button.style.height = '5.9%';
    button.removeAttribute('aria-current');
  });
}

showBookCover();

window.addEventListener('hashchange', () => {
  if (location.hash === '#blue-page') {
    showBookCover();
  }
});

document.querySelector('.book-cover-tab')
  .addEventListener('click', showBookCover);