function sortFunction(a, b, key) {
  if (a[key] < b[key]) {
    return -1;
  } if (a[key] > b[key]) {
    return 1;
  }
  return 0;
}

function findMatches(memberList, searchingName, searchingParty, searchingState) {
  // process your restaurants here!
  searchingName = searchingName.trim();
  
  const list = memberList.filter(member => {
    const nameRegex = new RegExp(searchingName, 'gi');
    return (member.first_name.match(nameRegex) || member.last_name.match(nameRegex)) && 
      (searchingParty == 'all' || member.party == searchingParty) &&
      (searchingState == 'all' || member.state == searchingState)
    ;
  });
  return list;
}
  
function displayMatches() {
  const searchingName = searchByNameInput.value;
  const searchingChamber = searchByChamberSelect.value;
  const searchingParty = searchByPartySelect.value;
  const searchingState = searchByStateSelect.value;

  const members = [];
  if (searchingChamber == 'all') {
    members.push(...houseMembers);
    members.push(...senateMembers);
  } else if (searchingChamber == 'house') {
    members.push(...houseMembers);
  } else if (searchingChamber == 'senate') {
    members.push(...senateMembers);
  }

  const matchArray = findMatches(members, searchingName, searchingParty, searchingState);
  const html = matchArray.map(member => {
    return `
    <div class="col-6">
      <div class="card mb-3 party-${member.party} " style="max-width: 540px;">
        <div class="row no-gutters">
          <div class="col-md-4">
            <a href="memberProfile.html?memberId=${member.id}">
              <img src="https://github.com/unitedstates/images/raw/gh-pages/congress/225x275/${member.id}.jpg" 
                  class="card-img" alt="Member Picture">
            </a>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">
                <a href="memberProfile.html?memberId=${member.id}" class="member-name">
                  ${member.first_name} ${member.last_name}
                </a>
              </h5>
              <p class="card-text">Title: ${member.title}</p>
              <p class="card-text">State: ${member.state}</p>
              <p class="card-text">Party: ${member.party}</p>
              <p class="card-text">Leadership Role: ${member.leadership_role ? member.leadership_role : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  }).join('');
  searchResultDiv.innerHTML = html;
}

function displayStates(membersList) {
  // process members list to get the list of states
  const states = membersList.reduce((collection, item, i) => {
    const stateCode = item.state;
    
    const foundState = collection.find( c => {
      return c.code === stateCode;
    })
    if (!foundState) {
      let newState = {'code': stateCode, 'label': stateCode};
      collection.push(newState);
    }

    return collection;
  }, []);

  const sortedStates = states.sort(function(a, b) {
    return sortFunction(a, b, 'label');
  });

  const html = sortedStates.map(state => {
    return `
      <option value="${state.code}">${state.label}</option>
    `;
  }).join('');

  const searchByState = document.querySelector('#searchByState');
  searchByState.innerHTML += html;
}
  
const houseMembers = [];
const senateMembers = [];

fetch('/house/members', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then((fromServer) => fromServer.json())
  .then((jsonFromServer) => { 
    houseMembers.push(...jsonFromServer.members);
  })
  .catch((err) => {
    console.log(err);
  });

fetch('/senate/members', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then((fromServer) => fromServer.json())
  .then((jsonFromServer) => { 
    senateMembers.push(...jsonFromServer.members);
    displayStates(senateMembers);
    // list all when page first load
    displayMatches();
  })
  .catch((err) => {
    console.log(err);
  });

const searchByNameInput = document.querySelector('#searchByName');
const searchByChamberSelect = document.querySelector('#searchByChamber');
const searchByPartySelect = document.querySelector('#searchByParty');
const searchByStateSelect = document.querySelector('#searchByState');

const searchResultDiv = document.querySelector('#searchResultDiv');

searchByNameInput.addEventListener('change', displayMatches);
searchByNameInput.addEventListener('keyup', displayMatches);

searchByChamberSelect.addEventListener('change', displayMatches);
searchByPartySelect.addEventListener('change', displayMatches);
searchByStateSelect.addEventListener('change', displayMatches);

