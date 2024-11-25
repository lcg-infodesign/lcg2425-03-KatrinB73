let riversData;
let fishData = [];
let maxLength = 0; 

function preload() {
  riversData = loadTable('Rivers in the world - Data.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  
  for (let i = 0; i < riversData.getRowCount(); i++) {
    let river = {
      name: riversData.getString(i, 'name'),
      length: riversData.getNum(i, 'length'),
      avg_temp: riversData.getNum(i, 'avg_temp'),
    };
    fishData.push(river);
  }

  fishData.sort((a, b) => b.length - a.length);

  
  maxLength = fishData[0].length;

  background(255, 255, 240); 
  textFont("Georgia"); 
}

function draw() {
  background(255, 255, 240); 

  
  let titleHeight = height * 0.1; 
  let glifiStartY = titleHeight + 50; 
  let glifiHeight = height * 0.8; 
  let legendX = 100; 

  
  textAlign(CENTER, CENTER);
  fill(0);
  noStroke();
  textSize(width * 0.03); 
  text("Rivers in the World", width / 2, titleHeight / 2);

  
  let centerX = width / 2 + width * 0.1; 
  let centerY = glifiStartY + glifiHeight / 2; 

  
  let closestIndex = getClosestRiver(mouseX, mouseY, centerX, centerY);

  for (let i = 0; i < 100; i++) {
    let river = fishData[i];

   
    let lineLength = map(river.length, 0, maxLength, 150, glifiHeight / 2);
    let angle = map(i, 0, 100, PI / 1.4, -PI / 1.4);

    
    let startColor, endColor;
    if (river.avg_temp < 10) {
      startColor = color(200, 225, 255);
      endColor = color(173, 216, 230);
    } else if (river.avg_temp >= 10 && river.avg_temp <= 25) {
      startColor = color(255, 200, 150);
      endColor = color(255, 165, 0);
    } else {
      startColor = color(255, 120, 120);
      endColor = color(255, 69, 0);
    }

   
    let isHovered = i === closestIndex;
    drawGradientLine(centerX, centerY, lineLength, angle, startColor, endColor, isHovered);

    
    if (isHovered) {
      showRiverDetailsSafely(centerX, centerY, lineLength, angle, river);
    }
  }

  
  drawLegend(legendX);
}

function drawGradientLine(x, y, length, angle, startColor, endColor, isHovered) {
  for (let i = 0; i < length; i++) {
    let interColor = lerpColor(startColor, endColor, i / length);
    stroke(interColor);
    strokeWeight(isHovered ? 6 : 3); 
    let xEnd = x + cos(angle) * i;
    let yEnd = y - sin(angle) * i;
    point(xEnd, yEnd);
  }
}

function getClosestRiver(mouseX, mouseY, centerX, centerY) {
  let closestIndex = -1;
  let closestDistance = Infinity;

  for (let i = 0; i < 100; i++) {
    let river = fishData[i];
    let lineLength = map(river.length, 0, maxLength, 150, height * 0.35); // Adattato alla dimensione dei glifi
    let angle = map(i, 0, 100, PI / 1.4, -PI / 1.4);

    let xEnd = centerX + cos(angle) * lineLength;
    let yEnd = centerY - sin(angle) * lineLength;

    let distance = dist(mouseX, mouseY, xEnd, yEnd);
    if (distance < closestDistance && distance < 20) { // Limita la sensibilità
      closestDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
}

function showRiverDetailsSafely(centerX, centerY, lineLength, angle, river) {
  noStroke();
  fill(0);
  textSize(width * 0.015); 

  
  let textX = centerX + cos(angle) * (lineLength + 70);
  let textY = centerY - sin(angle) * (lineLength + 110); 

  if (textX < 50) textX = 50; 
  if (textX > width - 50) textX = width - 50; 
  if (textY < 50) textY = 50; 
  if (textY > height - 50) textY = height - 50; 

  textAlign(CENTER, CENTER);
  text(`${river.name} (${river.length} km)`, textX, textY);
}

function drawLegend(legendX) {
  let legendY = height / 2 - 100; 

  textAlign(CENTER, CENTER);
  textSize(width * 0.015); 

  fill(173, 216, 230);
  noStroke();
  ellipse(legendX, legendY, 30, 30); 
  fill(0);
  text("<10°C", legendX, legendY + 40); 

  
  fill(255, 165, 0);
  ellipse(legendX, legendY + 80, 30, 30); 
  fill(0);
  text("10-25°C", legendX, legendY + 120); 

  fill(255, 69, 0);
  ellipse(legendX, legendY + 160, 30, 30); 
  fill(0);
  text(">25°C", legendX, legendY + 200); 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); 
}

