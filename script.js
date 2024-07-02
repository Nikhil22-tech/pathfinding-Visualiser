const grid = document.getElementById('grid');
let startNode = null;
let endNode = null;
let isMouseDown = false;

// Create grid
for (let i = 0; i < 20; i++) {
  for (let j = 0; j < 20; j++) {
    const node = document.createElement('div');
    node.className = 'node';
    node.setAttribute('id', `${i}-${j}`);
    node.addEventListener('mousedown', () => {
      isMouseDown = true;
      if (!startNode) {
        startNode = node;
        startNode.style.backgroundColor = 'green';
      } else if (!endNode) {
        endNode = node;
        endNode.style.backgroundColor = 'red';
      } else {
        node.style.backgroundColor = 'black';
      }
    });
    node.addEventListener('mouseover', () => {
      if (isMouseDown && node !== startNode && node !== endNode) {
        node.style.backgroundColor = 'black';
      }
    });
    node.addEventListener('mouseup', () => {
      isMouseDown = false;
    });
    grid.appendChild(node);
  }
}

function visualizePathfinding() {
  if (!startNode || !endNode) {
    alert('Please select start and end nodes.');
    return;
  }

  const path = findPath(startNode.id, endNode.id);
  if (path.length === 0) {
    alert('No path found.');
    return;
  }

  path.forEach(nodeId => {
    const [row, col] = nodeId.split('-');
    const node = document.getElementById(nodeId);
    setTimeout(() => {
      node.style.backgroundColor = 'blue';
    }, 50);
  });
}

function findPath(startId, endId) {
  const start = startId.split('-').map(Number);
  const end = endId.split('-').map(Number);

  const openSet = [startId];
  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  gScore[startId] = 0;
  fScore[startId] = heuristicCost(start, end);

  while (openSet.length > 0) {
    let current = getLowestFScoreNode(openSet, fScore);
    if (current === endId) {
      return reconstructPath(cameFrom, current);
    }

    openSet.splice(openSet.indexOf(current), 1);
    const neighbors = getNeighbors(current);

    neighbors.forEach(neighbor => {
      const tentativeGScore = gScore[current] + 1;
      if (tentativeGScore < (gScore[neighbor] || Infinity)) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = tentativeGScore + heuristicCost(neighbor.split('-').map(Number), end);
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    });
  }

  return [];
}

function getLowestFScoreNode(openSet, fScore) {
  let lowestNode = openSet[0];
  let lowestFScore = fScore[lowestNode] || Infinity;

  openSet.forEach(node => {
    const score = fScore[node] || Infinity;
    if (score < lowestFScore) {
      lowestFScore = score;
      lowestNode = node;
    }
  });

  return lowestNode;
}

function getNeighbors(nodeId) {
  const [row, col] = nodeId.split('-').map(Number);
  const neighbors = [];

  if (row > 0) neighbors.push(`${row - 1}-${col}`);
  if (row < 19) neighbors.push(`${row + 1}-${col}`);
  if (col > 0) neighbors.push(`${row}-${col - 1}`);
  if (col < 19) neighbors.push(`${row}-${col + 1}`);

  return neighbors.filter(neighbor => {
    const node = document.getElementById(neighbor);
    return node.style.backgroundColor !== 'black';
  });
}

function heuristicCost(current, target) {
  return Math.abs(current[0] - target[0]) + Math.abs(current[1] - target[1]);
}

function reconstructPath(cameFrom, current) {
  const totalPath = [current];
  while (cameFrom[current]) {
    current = cameFrom[current];
    totalPath.unshift(current);
  }
  return totalPath;
}
