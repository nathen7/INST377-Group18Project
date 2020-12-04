function displayProfile(profile) {
  // display profile information
  const currentRole = profile.roles[0];// role is an array, we only take the first element to get the latest role

  let termsServed = ''
  for (let i = 0; i < profile.roles.length; i++) {
    if (i != 0) termsServed += ', '
    termsServed += `${profile.roles[i].start_date.substring(0,4)}-${profile.roles[i].end_date.substring(0,4)}`
  }

  let committees = ''
  for (let i = 0; i < currentRole.committees.length; i++) {
    if (i != 0) committees += ', '
    committees += `${currentRole.committees[i].name}`
  }

  const profileNameCtrl = document.querySelector("#profileName");
  profileNameCtrl.innerHTML = `${profile.first_name} ${profile.last_name}`;
  
  const profileImgCtrl = document.querySelector("#profileImg");
  profileImgCtrl.setAttribute('src', 
      'https://github.com/unitedstates/images/raw/gh-pages/congress/225x275/'+profile.id+'.jpg');

  const profileFullNameCtrl = document.querySelector("#profileFullName");
  profileFullNameCtrl.innerHTML = `${profile.first_name} <span class="text-primary">${profile.last_name}</span>`;

  console.log(currentRole)

  const profileInfoCtrl = document.querySelector('#profileInfo');
  profileInfoCtrl.innerHTML = `
    <div class="subheading mb-2">
      Office: ${currentRole.office} · Phone: ${currentRole.phone}
    </div>
    <div class=" row">
      <label class="col-sm-4 col-form-label">Chamber</label>
      <div class="col-sm-8">
        ${currentRole.chamber}
      </div>
    </div>
    <div class=" row">
      <label class="col-sm-4 col-form-label">Title</label>
      <div class="col-sm-8">
        ${currentRole.title}
      </div>
    </div>
    <div class=" row">
      <label class="col-sm-4 col-form-label">State</label>
      <div class="col-sm-8">
        ${currentRole.state}
      </div>
    </div>
    <div class=" row">
      <label class="col-sm-4 col-form-label">Party</label>
      <div class="col-sm-8">
        ${currentRole.party}
      </div>
    </div>
    <div class=" row">
      <label class="col-sm-4 col-form-label">Committees</label>
      <div class="col-sm-8">
        ${committees}
      </div>
    </div>
    <div class=" row">
      <label class="col-sm-4 col-form-label">Year Served</label>
      <div class="col-sm-8">
        ${termsServed}
      </div>
    </div>
    <div class=" row">
      <label class="col-sm-4 col-form-label">Contact Form</label>
      <div class="col-sm-8">
        <a href="${currentRole.contact_form}" target="_blank">${currentRole.contact_form}</a>
      </div>
    </div>
    `;
}

function displayBills(bills) {
    const billCountCtrl = document.querySelector('#billCount');
    billCountCtrl.innerHTML = bills.length;

    const billListCtrl = document.querySelector('#billList');
    const items = bills.map((bill, index) => {
        return `
            <!-- Button trigger modal -->
            <a href="javascript:;" 
              class="list-group-item list-group-item-action my-2 border"
              data-toggle="modal" data-target="#bill${index}"
            >
                ${bill.short_title} <span class="badge badge-primary">Learn More</span>
            </a>
            <!-- Modal -->
            <div class="modal fade" id="bill${index}" data-backdrop="static" 
              data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" 
              aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Bill Details</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                  <div class=" row">
                    <label class="col-sm-4 col-form-label">Title</label>
                    <div class="col-sm-8">
                      <a href="${bill.congressdotgov_url}" target="_blank">${bill.title}</a>
                    </div>
                  </div>
                  <div class=" row">
                    <label class="col-sm-4 col-form-label">Introduced Date</label>
                    <div class="col-sm-8">
                      <label class="form-control-plaintext">${bill.introduced_date}</label>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-4 col-form-label">Status</label>
                    <div class="col-sm-8">
                      <label class="form-control-plaintext">${bill.active ? 'Active' : 'Inactive'}</label>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-4 col-form-label">Committees</label>
                    <div class="col-sm-8">
                      <label class="form-control-plaintext">${bill.committees}</label>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-4 col-form-label">Primary Subject</label>
                    <div class="col-sm-8">
                      <label class="form-control-plaintext">${bill.primary_subject}</label>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-4 col-form-label">Summary</label>
                    <div class="col-sm-8">
                      <label class="form-control-plaintext">${bill.summary}</label>
                    </div>
                  </div>
                  
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>
        `
    });
    billListCtrl.innerHTML = items.join('');
    $('.collapse').collapse();
}

function getBills(memberId) {
    // call profile API in server.js
    fetch('/memberBills?memberId=' + memberId, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    })
    // execute after server completes and returns result.
    // server return result in string format and then this translates string to json object
    .then((fromServer) => fromServer.json())
    //output of fromServer.json becomes input of jsonFromServer
    .then((jsonFromServer) => { 
        let bills = jsonFromServer.bills;//->clone data to new variable = memberProfile
        displayBills(bills);
    })
    .catch((err) => {
        console.log(err);
    });
}

// execute when page loading
// get member id in parameter of URL.
const url = new URL(window.location.href);
const memberId = url.searchParams.get("memberId");

let memberProfile = {};

// call profile API in server.js
fetch('/profile?memberId=' + memberId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  // execute after server completes and returns result.
  // server return result in string format and then this translates string to json object
  .then((fromServer) => fromServer.json())
  //output of fromServer.json becomes input of jsonFromServer
  .then((jsonFromServer) => { 
    memberProfile = {...jsonFromServer};//->clone data to new variable = memberProfile
    console.log("memberProfile=", memberProfile);
    displayProfile(memberProfile);
    getBills(memberId);
  })
  .catch((err) => {
    console.log(err);
  });



