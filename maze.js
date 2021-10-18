const fs = require("fs");

function openChestSync(chestPath) {
  //Open chest
  return JSON.parse(fs.readFileSync(chestPath));
}

function checkTreasure(chestPath) {
  //Return true if the chest contain the treasure else return false
  const chest = openChestSync(chestPath);
  if (chest.hasOwnProperty("treasure") && chest["treasure"]) return true;
  return false;
}

function checkDecoy(chestPath) {
  //return if there is a decoy
  return !openChestSync(chestPath);
}

function checkClue(chestPath) {
  //Return the clue if it's a real clue
  const res = openChestSync(chestPath);
  if (res["clue"].includes("/room")) return res["clue"];
}

function checkType(roomOrChest) {
  //check if it's a room or a chest
  if (roomOrChest.includes("chest")) return "chest";
  else return "room";
}
function findTreasureSync(roomPath) {
  let filsArray = fs.readdirSync(roomPath);
  for (let i = 0; i < filsArray.length; i++) {
    const currentPath = `${roomPath}/${filsArray[i]}`;
    drawMapSync(currentPath);
    console.log(`${currentPath} ${i}`);
    if (checkType(currentPath) === "room") findTreasureSync(currentPath);
    else if (checkType(currentPath) === "chest")
      if (checkTreasure(currentPath)) {
        console.log("Treasure found 💰💰💰");
        process.exit(0);
      } else if (!checkDecoy(currentPath))
        findTreasureSync(checkClue(currentPath));
  }
}

findTreasureSync("./maze");

function drawMapSync(currentRoomPath) {
  //draw map
  fs.writeFileSync("./map.txt", currentRoomPath + "\n", { flag: "a+" });
}
