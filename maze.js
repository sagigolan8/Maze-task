const fs = require("fs");

function openChestSync(chestPath) {
  //Open chest
  return JSON.parse(fs.readFileSync(chestPath));
}

function checkTreasure(chestPath) {
  //Return true if the chest contain the treasure else return false
  const chest = openChestSync(chestPath);
  return chest.hasOwnProperty("treasure") && chest["treasure"] ? true : false;
}

function checkDecoy(chestPath) {
  //return if there is a decoy
  return !openChestSync(chestPath);
}

function checkClue(chestPath) {
  //Return the clue if it's a real clue
  const chest = openChestSync(chestPath);
  if (checkType(chestPath) === "chest" || checkType(chestPath) === "room")
    return chest["clue"];
}

function checkType(roomOrChest) {
  //Check if it's a room, chest or decoy and returns answer accordingly
  try {
    if (fs.lstatSync(roomOrChest).isDirectory()) return "room";
    if (fs.lstatSync(roomOrChest).isFile()) return "chest";
  } catch {
    return "decoy";
  }
}
function findTreasureSync(roomPath) {
  //The algorithm that will finds the treasure
  let filsArray = fs.readdirSync(roomPath);
  for (let i = 0; i < filsArray.length; i++) {
    const currentPath = `${roomPath}/${filsArray[i]}`;
    drawMapSync(currentPath);
    console.log(`${currentPath}`);
    if (checkType(currentPath) === "room") findTreasureSync(currentPath);
    else if (checkType(currentPath) === "chest")
      if (checkTreasure(currentPath)) {
        console.log("Treasure found 💰💰💰");
        process.exit(0);
      } else if (!checkDecoy(currentPath))
        findTreasureSync(checkClue(currentPath));
  }
}

function drawMapSync(currentRoomPath) {
  //Draw map
  fs.writeFileSync("./map2.txt", currentRoomPath + "\n", { flag: "a+" });
}
findTreasureSync("./maze"); //Call the function and start the maze
