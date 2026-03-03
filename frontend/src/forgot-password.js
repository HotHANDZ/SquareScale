const passForm = document.getElementById('passForm');
const emailIdError = document.getElementById('email-ID-Error');
const credentialsForm = document.getElementById('credentials-form');
const securityQuestionForm = document.getElementById('security-question-form');

    passForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const userData = {
        email: document.getElementById('forgotEmail').value,
        userID: document.getElementById('userID').value
    };

    //This is where the fetch() will be when the back end is ready. For now there's a hardcoded test case


    if(userData.email === 'tester@gmail.com' && userData.userID === 'testerC') {
        emailIdError.style.visibility = 'hidden';
        console.log("Success");


        credentialsForm.classList.add('hidden');
        securityQuestionForm.classList.remove('hidden');

        //credentialsForm.classList.replace('child-div', 'hidden');
       //securityQuestionForm.classList.replace('hidden', 'child-div');

    }
    else {
        emailIdError.style.visibility = 'visible';
        console.log("Error");
        passForm.reset();
        document.getElementById("forgotEmail").focus();
    }

});