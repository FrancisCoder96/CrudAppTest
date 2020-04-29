const contents = document.getElementById('contents');
const homeBtns = document.querySelectorAll('.homeBtns');

if(homeBtns) {
   
   for(let btn in [...homeBtns]) {
      homeBtns[btn].addEventListener('click', () => {
         window.location = document.URL
      })
   }
} 


async function showPersonList() {
   try {
      const getPersons = await fetch('https://thawing-basin-25180.herokuapp.com/person');
      const persons = await getPersons.json();

      if(!persons) {
         console.log('No data response from the data base')
      } else {
         let tempContent = '';
         persons.map(person => tempContent += `<li class="list-group-item personsList" id="${person._id}">${person.username}</li>`);
         contents.innerHTML = `<ul class="list-group">${tempContent}</ul>`;

         const personsList = document.getElementsByClassName('personsList');
         onClickPerson(personsList);
         
      }
   } catch (error) {
      console.log(error)
   }
}

showPersonList();


const addPersonBtn = document.getElementById('addPersonBtn');
addPersonBtn.addEventListener('click', addPersonPage);

async function addPersonPage() {
   let tempContent = `
      <form id="addPersonForm">
         <div id="errorMsgArea"></div>
         <div class="form-group">
            <label for="username">Name:</label>
            <input type="text" class="form-control" id="username" name="username">
         </div>
         <div class="form-group">
            <label for="age">Age:</label>
            <input type="number" class="form-control" id="age" name="age">
         </div>
         <div class="form-group">
            <label for="gender">Gender:</label>
            <input type="text" class="form-control" id="gender" name="gender">
         </div>
         <input type="submit" class="btn btn-primary" value="Submit">
      </form>
   `;

   contents.innerHTML = tempContent;
   const addPersonForm = document.getElementById('addPersonForm');
   addPersonMethod(addPersonForm);
}




function addPersonMethod(addPersonForm) {
   if(!addPersonForm) {
      ''
   } else {
      let tempObjectStore = {};
      addPersonForm.addEventListener('input', e => {
         e.preventDefault();
         const { name, value } = e.target;
         tempObjectStore = {
            ...tempObjectStore,
            [name]: value
         }
      });
   
      addPersonForm.addEventListener('submit', async(e) => {
         e.preventDefault();
         let errors = [];
         try {
            const createPerson = await fetch('https://thawing-basin-25180.herokuapp.com/person/addPerson', {
               method: 'post',
               headers: { "Content-Type": "application/json; charset=utf-8"},
               body: JSON.stringify(tempObjectStore)
            });
   
            const newlyCreatedPerson = await createPerson.json();

            if(!newlyCreatedPerson.errorMsg) {             
               window.location = document.URL;     
            } else {
               errors = [...newlyCreatedPerson.errors]
               throw new Error(newlyCreatedPerson.errorMsg)
            }

         } catch (error) {
            console.log(error);
            const errorMsgArea = document.getElementById('errorMsgArea');
            
            let tempErrorContents = '';
            errors.map(errMsg => {
               tempErrorContents += `
               <div class="alert alert-danger alert-dismissible fade show" role="alert">
                  ${errMsg}
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                  </button>
               </div>
               `;
            });

            errorMsgArea.innerHTML = tempErrorContents;
         }
      })
   }
}


function onClickPerson(personsList) {
   let list = [...personsList];
   for(let item in list) {
      list[item].addEventListener('click', e => {
         let _id = e.target.id;
         viewPerson(_id);
      })
   }
}


async function viewPerson(_id) {
   try {
      const getPerson = await fetch(`https://thawing-basin-25180.herokuapp.com/person/findOne/${_id}`);
      const respnse = await getPerson.json();
      const { username, age, gender } = respnse[0];
      let innerContent = `
         <ul class="list-group mt-4">
            <li class="list-group-item">Name: ${username}</li>
            <li class="list-group-item">Age: ${age}</li>
            <li class="list-group-item">Gender: ${gender}</li>
            <br />
         </ul>
         <button class="btn btn-primary" id="editBtn">Edit</button>
         <button class="btn btn-danger" id="deleteBtn">Delete</button>
      `;

      contents.innerHTML = innerContent;
      
      const deleteBtn = document.getElementById('deleteBtn');
      deleteBtn.addEventListener('click', () => deletePerson(_id));

      const editBtn = document.getElementById('editBtn');
      editBtn.addEventListener('click', () => editPersonPage(_id, username, age, gender));

   } catch (error) {
      console.log(error)
   }
}

async function deletePerson(_id) {
   try {
      const personToDelete = await fetch(`https://thawing-basin-25180.herokuapp.com/person/deletePerson/${_id}`, { method: 'delete'});
      const deletedPerson = await personToDelete.json();
      if(deletedPerson.status === "deleted") {
         console.log(deletedPerson);
         window.location = document.URL;
      } else { 
         throw new Error('Something went wrong');
      }  
   } catch (error) {
      console.log(error);
   }
}

function editPersonPage(_id, username, age, gender) {
   let editPersonPageContent = `
      <form id="editPersonForm">
         <div id="errorMsgArea"></div>
         <div class="form-group">
            <label for="username">Name:</label>
            <input type="text" class="form-control" id="username" name="username" value="${username}">
         </div>
         <div class="form-group">
            <label for="age">Age:</label>
            <input type="number" class="form-control" id="age" name="age" value="${age}">
         </div>
         <div class="form-group">
            <label for="gender">Gender:</label>
            <input type="text" class="form-control" id="gender" name="gender" value="${gender}">
         </div>
         <input type="submit" class="btn btn-primary" value="Save Changes">
      </form>
   `;

   contents.innerHTML = editPersonPageContent;
   
   const editPersonForm = document.getElementById('editPersonForm');
   let editFormBody = {};
   editPersonForm.addEventListener('input',  e => {
      const { name, value } = e.target;
      editFormBody = {
         ...editFormBody,
         [name]: value
      }
   })

   editPersonForm.addEventListener('submit', async e => {
      e.preventDefault();
      try {
         const editPerson = await fetch(`https://thawing-basin-25180.herokuapp.com/person/updatePerson/${_id}`, { 
            method: 'put',
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(editFormBody)
         });

         const newlyUpdatedPerson = await editPerson.json();
         console.log(newlyUpdatedPerson);
         viewPerson(_id)
      } catch (error) {
         console.log(error)
      }
   });   
}