
//get search results on the home page
async function apiGetAll (company) {
    try {
        
            const searchResults = document.getElementById('companies');
            const resp = await fetch(`http://localhost:3050/api/companys/${company}`);
            const data = await resp.json();

            data.forEach(function(item) {
                searchResults.innerHTML = 
                `<table class="table table-striped">
                    <tbody>
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.email}</td>
                            <td>${item.phone}</td>
                            <td>${item.website}</td>
                            

                        </tr>
                    </tbody>
                
                </table>`;
            });

          
         if(data.length < 1 ){
            showAlert('No record found', 'alert alert-danger')
         }
      
    } catch (err) {
         console.log(err)
      }
 }
 

const input = document.getElementById('searchText');
input.addEventListener('keyup', (e) => {
    const inputText = e.target.value;
    if( inputText !== ''){
        apiGetAll(inputText);
        
    }else{
        clearResult();
    }
});


//clear results if input field is empty
function clearResult(){
    const searchResults = document.getElementById('companies');
    searchResults.innerHTML = '';
    
}

//alerts
// Show alert message
function showAlert(message, className) {
    // Clear any remaining alerts
    clearAlert();
    // Create div
    const div  =  document.createElement('div');
    // Add classes
    div.className = className;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container =  document.querySelector('.searchContainer');
    // Get search box
    const search = document.querySelector('.search');
    // Insert alert
    container.insertBefore(div, search);

    // Timeout after 3 sec
    setTimeout(() => {
      this.clearAlert();
    }, 3000);
  }

  // Clear alert message
  function clearAlert() {
    const currentAlert = document.querySelector('.alert');

    if(currentAlert){
      currentAlert.remove();
    }
  }