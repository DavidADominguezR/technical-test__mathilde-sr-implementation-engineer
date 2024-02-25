(() => {
  "use strict";
  document.querySelectorAll("[data-validation-state]").forEach((el) => {
    el.dataset.validationState = "valid";
  });

  document.querySelectorAll("[name=insuranceType]").forEach((el) => {
    el.checked = false;
  });

  const formattedToday = calcAgeDate(18);

  document.querySelector("#birdDate").setAttribute("max", formattedToday);

  window.config = {
    form: {
      isValid: false,
      values: {
        insuranceType: "",
        firstName: "",
        surName: "",
        phoneNumber: "",
        email: "",
        birdDate: "",
        occupation: "",
        monthlyIncome: "",
        objectAppraisal: "",
      },
    },
  };

  const form = document.querySelector(".needs-validation");

  let isChangeListenerAdded = false;

  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      window.config.form.isValid = true;
      document.querySelectorAll("[data-validation-state]").forEach((el) => {
        el.dataset.validationState = "valid";
      });

      form.checkValidity();

      if (isChangeListenerAdded === false) {
        isChangeListenerAdded = true;

        document.querySelectorAll("input, select").forEach((el) => {
          el.addEventListener("input", () => {
            form.checkValidity();
            validateInput(el.name);
            birdDate18Validate(el);
            emailFormatValidate(el);
          });
        });
      }

      Object.keys(window.config.form.values).forEach((key) => {
        validateInput(key);
        birdDate18Validate(document.querySelector(`[name=${key}]`));
        emailFormatValidate(document.querySelector(`[name=${key}]`));
      });

      form.classList.add("was-validated");

      if (window.config.form.isValid) {
        let iframeURL =
          "https://davidadominguezr.github.io/technical-test__mathilde-sr-implementation-engineer/availabe-insurance.html?";
        Object.keys(window.config.form.values).forEach((key) => {
          iframeURL += `${key}=${window.config.form.values[key]}&`;
        });
        iframeURL = encodeURI(iframeURL.substring(0, iframeURL.length - 1));

        let iframe = document.createElement("iframe");
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.setAttribute("src", iframeURL);
        let iframeContainer = document.getElementById("page-ads");
        iframeContainer.innerHTML = "";
        iframeContainer.appendChild(iframe);
        iframeContainer.style.display = "block";

        document.getElementById("page-form").style.display = "none";
        receiveMessage();
      }
    },
    false
  );
})();

function formValidationOnInputChange(name, selector = null) {
  const el = document.querySelector(selector ? selector : `[name=${name}]`);
  const invalidFeedback = document.querySelector(
    `[data-form-field-name=${name}][data-invalid-type=required]`
  );
  if (!el?.value) {
    invalidFeedback.dataset.validationState = "invalid";
    invalidFeedback.classList.add("invalid-feedback");

    return null;
  } else {
    invalidFeedback.dataset.validationState = "valid";
    invalidFeedback.classList.remove("invalid-feedback");
    return el.value;
  }
}

function validateInput(name) {
  let value = null;
  if (name === "insuranceType") {
    value = formValidationOnInputChange(name, "[name=insuranceType]:checked");
  } else {
    value = formValidationOnInputChange(name);
  }
  window.config.form.values[name] = value;

  if (!value) {
    window.config.form.isValid = false;
  }
}

function calcAgeDate(age) {
  const today = new Date();
  const yyyy = today.getFullYear() - age;
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return yyyy + "-" + mm + "-" + dd;
}

function receiveMessage() {
  window.addEventListener(
    "message",
    (event) => {
      console.log("event", event);
      document.getElementById("page-ads").style.display = "none";
      document.getElementById("insuranceName").innerText = event.data;
      document.getElementById("page-thank-you").style.display = "flex";
    },
    false
  );
}

function birdDate18Validate(el) {
  if (el.name === "birdDate") {
    const formattedToday = calcAgeDate(18);
    const age18 = Date.parse(formattedToday);
    const currentAge = Date.parse(el.value);

    if (currentAge > age18) {
      const invalidFeedback = document.querySelector(
        `[data-form-field-name=${el.name}][data-invalid-type=max]`
      );
      invalidFeedback.dataset.validationState = "invalid";
      invalidFeedback.classList.add("invalid-feedback");
      window.config.form.isValid = false;
      window.config.form.values[el.name] = null;
      el.setCustomValidity("Invalid field.");
    } else {
      const invalidFeedback = document.querySelector(
        `[data-form-field-name=${el.name}][data-invalid-type=max]`
      );
      invalidFeedback.dataset.validationState = "valid";
      invalidFeedback.classList.remove("invalid-feedback");
      window.config.form.values[el.name] = el.value;
      el.setCustomValidity("");
    }
  }
}

function emailFormatValidate(el) {
  if (el.name === "email") {
    let regExp = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

    if (!regExp.test(el.value)) {
      const invalidFeedback = document.querySelector(
        `[data-form-field-name=${el.name}][data-invalid-type=format]`
      );
      invalidFeedback.dataset.validationState = "invalid";
      invalidFeedback.classList.add("invalid-feedback");
      window.config.form.isValid = false;
      window.config.form.values[el.name] = null;
      el.setCustomValidity("Invalid field.");
    } else {
      const invalidFeedback = document.querySelector(
        `[data-form-field-name=${el.name}][data-invalid-type=format]`
      );
      invalidFeedback.dataset.validationState = "valid";
      invalidFeedback.classList.remove("invalid-feedback");
      window.config.form.values[el.name] = el.value;
      el.setCustomValidity("");
    }
  }
}

function onlyNumberKey(evt) {
  let ASCIICode = evt.which ? evt.which : evt.keyCode;
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
  return true;
}
