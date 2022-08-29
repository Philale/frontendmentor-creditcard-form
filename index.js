//get all elements for visualization

const cardholder_displayed = document.getElementById("card-name-displayed");

const cardnumber_displayed = document.getElementById("card-number-displayed");

const carddate_displayed = document.getElementById("card-date-displayed");

const card_cvc_displayed = document.getElementById("card-cvc-displayed");

function cardholderChange(value){
    var displayValue = "Jane Appleseed";

    if(value != ""){
        displayValue = value;
    }

    cardholder_displayed.textContent = displayValue.toUpperCase();
}

function cardnumberChange(el){
    var displayValue = "0000 0000 0000 0000";

    if(el.value != ""){
        displayValue = el.value;
    }

    cardnumber_displayed.textContent = displayValue;
}


//expDate should keep its value when the month or year is updated, otherwise it would only show the month or the year
var expDate = "00/00";

function expDateChange(value, month_or_year){
    value = value.toString().padStart(2, "0");
    if(month_or_year == 0){
        expDate = value.slice(0, 2) + "/" + expDate.split("/")[1];
    } 
    else if(month_or_year == 1){
        expDate = expDate.split("/")[0] + "/" + value.slice(0, 2);
    }

    carddate_displayed.textContent = expDate;
}

function cvcChange(value){
    var cvc = "000";
    if(value != ""){
        cvc = value.padStart(3, "0");
    }
    card_cvc_displayed.textContent = cvc.slice(0, 3);
}


document.querySelectorAll("form")[0].addEventListener("submit", (e) => validateForm(e));

function validateForm(e){
    e.preventDefault();

    //CARD HOLDER

    const ch_validator = new InputValidation(document.getElementById("cardholder"));

    if(ch_validator.value == "") ch_validator.showErrorMessage("Can't be blank");

    //CARD NUMBER
    const cn_validator = new InputValidation(document.getElementById("cardnumber"));

    if(cn_validator.value == "") cn_validator.showErrorMessage("Can't be blank");
    else{
        var allPassed = true;
        var subStrings = cn_validator.value.split(" ");
        if(subStrings.length != 4) allPassed = false; 
        else{
            for(let i = 0; i < subStrings.length; i++){
                if(subStrings[i].length != 4 || isNaN(subStrings[i]) || isNaN(parseFloat(subStrings[i]))){
                    allPassed = false;
                    break;
                }
            }
        }
        if(!allPassed) cn_validator.showErrorMessage("Wrong format, numbers only");
    }


    //EXPIRE MONTH
    const expm_validator = new InputValidation(document.getElementById("expmonth"));

    if(expm_validator.value == "" ) expm_validator.showErrorMessage("Can't be blank");
    else if(parseFloat(expm_validator.value) < 1 || parseFloat(expm_validator.value) > 12) expm_validator.showErrorMessage("Wrong format");


    //EXPIRE YEAR
    const expy_validator = new InputValidation(document.getElementById("expyear"), false);

    if(expy_validator.value == "" ) expy_validator.showErrorMessage("Can't be blank");
    else if(parseFloat(expy_validator.value) < 0 || parseFloat(expy_validator.value) > 99) expy_validator.showErrorMessage("Wrong format");
    

    //CVC
    const cvc_validator = new InputValidation(document.getElementById("cvc"));

    if(cvc_validator.value == "" ) cvc_validator.showErrorMessage("Can't be blank.");
    else if(cvc_validator.value.length != 3 || isNaN(cvc_validator.value) || isNaN(parseFloat(cvc_validator.value))) cvc_validator.showErrorMessage("Wrong format");


    if(ch_validator.success && cn_validator.success && expm_validator.success && expy_validator.success && cvc_validator.success){
        var forms = document.querySelectorAll("form");
        forms[0].style.visibility = "hidden";
        forms[1].style.visibility = "visible";
    }
}


//class for validating input
class InputValidation{
    inputElement = null;
    value = null;
    parent = null;
    resetMessage = true;
    success = true;

    //set all variables from inputElement
    //reset message: optional
    constructor(inputElement, resetMessage = true){

        this.inputElement = inputElement;
        this.value = inputElement.value;
        this.parent = inputElement.parentElement;
        this.resetMessage = resetMessage;

        this.resetValidationStyle();
    }

    resetValidationStyle(){
        this.inputElement.classList.remove("invalid-input");
        if(this.resetMessage){
            //reset message is for expire-month and expire-year input, because they have the same parent and therefore the error messages would conflict
            this.parent.removeAttribute("error-message");
            this.parent.classList.remove("invalid-container");
        }
    }

    showErrorMessage(message){
        this.inputElement.classList.add("invalid-input");
        this.parent.setAttribute("error-message", message);
        this.parent.classList.add("invalid-container");
        this.success = false;
    }
}