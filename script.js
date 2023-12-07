const participantList = document.getElementById('participants');
const participantNameInput = document.getElementById('participantName');
const participantGroupInput = document.getElementById('participantGroup');
const addParticipantBtn = document.getElementById('addParticipantBtn');
const startSecretSantaBtn = document.getElementById('startSecretSantaBtn');

// Add participant when user hits enter on the name input fields
participantNameInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    addParticipantBtn.click();
  }
});

addParticipantBtn.addEventListener('click', function () {
  const participantName = participantNameInput.value.trim();
  const participantGroup = participantGroupInput.value.trim();

  if (participantName) {
    // Create a new list item for the participant
    const participantListItem = document.createElement('li');
    participantListItem.textContent = participantName;

    // Store the group name in a data attribute
    participantListItem.dataset.group = participantGroup;

    participantList.appendChild(participantListItem);

    // Clear the input fields
    participantNameInput.value = '';
    participantGroupInput.value = '';
  }

  // set focus to the name input fields
  participantNameInput.focus();
});

startSecretSantaBtn.addEventListener('click', function () {
  // 1. Get all participant names and groups
  let participantsRaw = [];
  for (const participantListItem of participantList.querySelectorAll('li')) {
    participantsRaw.push({
      name: participantListItem.textContent.trim(),
      group: participantListItem.dataset.group,
      match: null,
      link: null,
    });
  }

  // 2. Shuffle the participants while considering groups
  const participants = shuffle(participantsRaw);

  // 3. Generate links for each participant
  for (let i = 0; i < participants.length; i++) {
    participants[i].match = participants[(i + 1) % participants.length].name;

    const encodedMatch = btoa(participants[i].match); // Encode matched person name in base64
    // make sure it's url-encoded
    const encodedMatchUrl = encodeURIComponent(encodedMatch);
    participants[i].link = `reveal.html?match=${encodedMatchUrl}`; // Replace with your actual website URL
  }

  //sort participants by names for displaying
  participants.sort((a, b) => a.name.localeCompare(b.name));

  // 4. Display participant links
  for (let i = 0; i < participants.length; i++) {
    const participantListItem = participantList.querySelectorAll('li')[i];
    const participantLink = participants[i].link;
    participantListItem.innerHTML = `<a href="${participantLink}">${participants[i].name}</a>`; //- ${participants[i].match}`;
  }
});

function removeElement(groups, element) {
  const index = groups[element.group].indexOf(element);
  if (index > -1) {
    groups[element.group].splice(index, 1);
  }

  if (groups[element.group].length === 0) {
    delete groups[element.group];
  }
}

function popBiggestGroup(groups) {
  const el = Object.values(groups).reduce((biggest, group) => {
    return biggest.length > group.length ? biggest : group;
  }, [])[0];
  console.debug("Popping: ", el);

  removeElement(groups, el);
  return el;
}

function groupFlatten(groups) {
  return Object.values(groups).reduce((acc, val) => acc.concat(val), []);
}

function shuffleBasic(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function shuffle(array) {
  let tries = 100;
  let shuffled;

  do {
    shuffled = [];
  const groups = Object.groupBy(array, ({ group }) => group);
  //shuffle entries from each group
  Object.values(groups).forEach(group => {
    shuffleBasic(group);
  });

  console.debug("Groups: ", groups);

  //select the first element from the first group, and remove it from the groups
  while (groupFlatten(groups).length > 1) {
    console.debug("Groups at start of iteration: ", groups);
    const element = popBiggestGroup(groups);
    const group = element.group;

    console.log(`\tPicked ${element.name} from group ${group}`)
    shuffled.push(element);

    //find another element from a different group to go after this one
    const remainingEl = Object.values(groups).reduce((acc, val) => {
      //add unassigned groups and empty ones
      if (val[0].group != group || val[0].group == '') {
        return acc.concat(val);
      }
      return acc;
    }, []);

    console.log(`\tPaired with ${remainingEl[0].name} from group ${remainingEl[0].group}`);
    //push its pair to the list
    shuffled.push(remainingEl[0]);
    
    //remove the element from the original groups
    removeElement(groups, remainingEl[0]);

    console.debug("Groups at end of iteration: ", groups);
  }

  if (Object.keys(groups).length > 0) {
    const el = popBiggestGroup(groups);
    shuffled.push(el);
    console.log("Adding leftover element", el.name);
  }

    tries = tries - 1;
  } while (shuffled[0].group == shuffled[shuffled.length-1] && shuffled[0].group != '' && shuffled[shuffled.length-1].group != '' && tries > 0);

  console.log("Tries: ", tries);
  return shuffled;
}


