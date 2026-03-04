const passForm = document.getElementById('passForm');
const errorText = document.getElementById('error-text');
const credentialsForm = document.getElementById('credentials-form');
const securityQuestionForm = document.getElementById('security-question-form');
const newPasswordForm = document.getElementById('new-password-form');

    passForm.addEventListener('submit', function(event) {
    event.preventDefault();


    if(!credentialsForm.classList.contains('hidden')) {
        //credentials logic
        credentialsLogic();
    }
    else if(!securityQuestionForm.classList.contains('hidden')) {
        //security question logic
        securityQuestionLogic();
    }
    else{
        //new password logic
        const newPassword = document.getElementById('new-password').value;

        const result = checkPassword(newPassword);

        if(result.isValid) {
            console.log("Password Valid");
            //API call for password change
            errorText.classList.add('hidden');
            window.location.replace("index.html");

        }
        else{
            console.log("Password Invalid");

            errorText.innerText = "Password does not meet criteria."
            errorText.classList.remove('hidden');
            document.getElementById("new-password").value = '';

        }


    }






});

    function credentialsLogic(){

        const userData = {
            email: document.getElementById('forgotEmail').value,
            userID: document.getElementById('userID').value
        };

        //This is where the fetch() will be when the back end is ready. For now there's a hardcoded test case. Conditions will be replaced with a boolean value given by the API


        if(userData.email === 'tester@gmail.com' && userData.userID === 'testerC') {

            errorText.classList.add('hidden');
            console.log("Success");


            credentialsForm.classList.add('hidden');
            securityQuestionForm.classList.remove('hidden');

            const questions = ["What city were you born in", "Name of first pet", "Mothers maiden name"]; //This will later use a fetch() instead
            populateSecurityQuestions(questions);
        }

        else {

            errorText.innerHTML = "Email or UserID is incorrect.";
            errorText.classList.remove('hidden');
            console.log("Error");
            passForm.reset();
            document.getElementById("forgotEmail").focus();
        }

    }

    function populateSecurityQuestions(questions){

        const questionList = document.getElementById("security-question-list");

        questions.forEach((questionText, index) => {
            const option = document.createElement('option');

            option.text = questionText;
            option.value = index; //returns the index as a string instead of the question string
            questionList.appendChild(option);
        })

    }

    function securityQuestionLogic(){

        const securityQuestion = {
            question: document.getElementById('security-question-list').value,
            answer: document.getElementById('security-question-answer').value
        };

        //Temp hardcode
        let valid = false;
        if(securityQuestion.question === "0" && securityQuestion.answer === 'city'){
            valid = true;
        }
        else if(securityQuestion.question === "1" && securityQuestion.answer === 'pet'){
            valid = true;
        }
        else if(securityQuestion.question === "2" && securityQuestion.answer === 'maiden'){
            valid = true;
        }


        //API call to check if answer is true or false
        if(valid){
            console.log("Security question correct");

            errorText.classList.add('hidden');
            securityQuestionForm.classList.add('hidden');
            newPasswordForm.classList.remove('hidden');
            document.getElementById('password-criteria').classList.remove('hidden');
        }
        else{
            console.log("Security question wrong");

            errorText.innerHTML = "Incorrect answer.";
            errorText.classList.remove('hidden');
            document.getElementById("security-question-answer").value = "";

        }


    }

    function checkPassword(password){

        const startsWithLetter = /^[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 8;
        //API call to check if password has already been used
        //const uniquePassword =

        return{
            isValid: startsWithLetter && hasNumber && hasSpecialChar && isLongEnough,
            checks: {startsWithLetter, hasNumber, hasSpecialChar, isLongEnough}
        };

    }