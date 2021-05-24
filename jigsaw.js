const input = require("./input");

// extract individual tiles from input
const regex = /Tile \d{4}:\n[#\.\n]{109}/g;
const tiles = input.match(regex);

// util to reverse a string
const reverse = (string) => string.split('').reverse().join('');

/*
 * some data manipulation to get data in the format:
 * {
 *  id: string
 *  edges: Array<String>;
 * }
 * where id is the tile id and edges is an array of 8 strings
 * which contains all the 4 edges and the reverse of the edges
*/
const formattedTiles = tiles.map((tile) => {
  const id = tile.slice(5, 9);
  let img = [];

  for(i=1;i<11;i++) {
    img[i-1] = tile.slice(i*11, i*11 + 10 );
  }

  const topEdge = img[0];
  const bottomEdge = img[9];
  const leftEdge = img.map(r => r[0]).join('');
  const rightEdge = img.map(r => r[9]).join('');
  
  const topEdgeReversed = reverse(topEdge);
  const bottomEdgeReversed = reverse(bottomEdge);
  const leftEdgeReversed = reverse(leftEdge);
  const rightEdgeReversed = reverse(rightEdge);

  return {
    id,
    edges: [
      topEdge,
      bottomEdge,
      rightEdge,
      leftEdge,
      topEdgeReversed,
      bottomEdgeReversed,
      rightEdgeReversed,
      leftEdgeReversed
    ]
  };
})

/*
 * get a collection of all edges in the format:
 * {
 *  id: string
 *  value: string;
 * }
 * where id is the tile id and value is an edge (normal or reversed) of the tile
 */
const allEdges = formattedTiles.reduce((accumulator, tile) => {
  tile.edges.forEach(edge => accumulator.push({id: tile.id, value: edge}));
  return accumulator;
}, []);

// Corner tiles are going to be the only ones that have 2 unattached edges
const cornerTiles = [];
formattedTiles.forEach(tile => {
  // numEdgesWithNoAttach stores how many edges in the tile do not match any other edge
  let numEdgesWithNoAttach = 0;
  tile.edges.forEach(edge => {
    // numAttachedEdges stores how many edges in the list matched this edge
    let numAttachedEdges = 0;
    allEdges.forEach(innerEdge => {
      // since all edges are in the allEdges collection we need to ensure it's not an edge from the same tile
      if(edge === innerEdge.value && innerEdge.id !== tile.id) {
        numAttachedEdges++;
      }
    })
    
    // if none did then we increment numEdgesWithNoAttach
    if(numAttachedEdges === 0) {
      numEdgesWithNoAttach++;
    }
  })
  
  // 4 instead of 2 here because top and top reverse are ultimately the same edge
  if(numEdgesWithNoAttach == 4) {
    cornerTiles.push(tile);
  }
})

// the ids are strings so we typecast and multiply to get the answer
const answer = cornerTiles.reduce((acc, tile) => acc *= Number(tile.id), 1);

console.log(answer)