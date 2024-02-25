(() => {
  "use strict";
  window.config = {
    cards: {
      basicInsurance: {
        isAvailable: false,
        name: "Seguro Basic",
        values: {
          yearly: 0,
          monthly: 0,
        },
        rules: {
          birdDate: {
            min: calcAgeDate(18),
            max: calcAgeDate(65),
          },
          monthlyIncome: {
            min: 100000,
          },
          objectAppraisal: {
            min: 500000,
            max: 6000000,
          },
        },
      },
      goldInsurance: {
        isAvailable: false,
        name: "Seguro Gold",
        values: {
          yearly: 0,
          monthly: 0,
        },
        rules: {
          insuranceType: {
            value: ["auto", "moto"],
          },
          birdDate: {
            min: calcAgeDate(18),
            max: calcAgeDate(80),
          },
          occupation: {
            value: ["empleado", "pensionado"],
          },
          monthlyIncome: {
            min: 1000000,
          },
          objectAppraisal: {
            min: 3500000,
            max: 50000000,
          },
        },
      },
      blackInsurance: {
        isAvailable: false,
        name: "Seguro Black",
        values: {
          yearly: 0,
          monthly: 0,
        },
        rules: {
          birdDate: {
            min: calcAgeDate(18),
            max: calcAgeDate(50),
          },
          occupation: {
            value: ["empleado"],
          },
          monthlyIncome: {
            min: 5000000,
          },
          objectAppraisal: {
            min: 5500000,
            max: 500000000,
          },
        },
      },
    },
    form: {
      isValid: true,
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

  extractUrlParams();

  document.querySelector(
    "#clientName"
  ).innerHTML = `${window.config.form.values.firstName} ${window.config.form.values.surName}`;

  findAvailableInsurances();
  buildInsuranceCards();
  console.log("url", window.config);
})();

function extractUrlParams() {
  let url = decodeURI(window.location.href);
  let params = url.substring(url.indexOf("?") + 1, url.length);
  let paramsArray = params.split("&");
  let paramsObject = {};
  paramsArray.forEach((param) => {
    let key = param.split("=")[0];
    let value = param.split("=")[1];
    paramsObject[key] = value;
  });
  window.config.form.values = paramsObject;
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

function findAvailableInsurances() {
  const monthlyIncome = window.config.form.values.monthlyIncome;
  const objectAppraisal = window.config.form.values.objectAppraisal;
  const occupation = window.config.form.values.occupation;
  const insuranceType = window.config.form.values.insuranceType;
  const birdDate = Date.parse(window.config.form.values.birdDate);

  let rules = window.config.cards.basicInsurance.rules;
  if (
    monthlyIncome >= rules.monthlyIncome.min &&
    objectAppraisal >= rules.objectAppraisal.min &&
    objectAppraisal <= rules.objectAppraisal.max &&
    birdDate <= Date.parse(rules.birdDate.min) &&
    birdDate >= Date.parse(rules.birdDate.max)
  ) {
    window.config.cards.basicInsurance.isAvailable = true;
    calculateInsurancePrice(0.3, "basicInsurance");
  }

  rules = window.config.cards.goldInsurance.rules;
  if (
    rules.insuranceType.value.includes(insuranceType) &&
    monthlyIncome >= rules.monthlyIncome.min &&
    objectAppraisal >= rules.objectAppraisal.min &&
    objectAppraisal <= rules.objectAppraisal.max &&
    birdDate <= Date.parse(rules.birdDate.min) &&
    birdDate >= Date.parse(rules.birdDate.max) &&
    rules.occupation.value.includes(occupation)
  ) {
    window.config.cards.goldInsurance.isAvailable = true;
    calculateInsurancePrice(0.6, "goldInsurance");
  }

  rules = window.config.cards.blackInsurance.rules;
  if (
    monthlyIncome >= rules.monthlyIncome.min &&
    objectAppraisal >= rules.objectAppraisal.min &&
    objectAppraisal <= rules.objectAppraisal.max &&
    birdDate <= Date.parse(rules.birdDate.min) &&
    birdDate >= Date.parse(rules.birdDate.max) &&
    rules.occupation.value.includes(occupation)
  ) {
    window.config.cards.blackInsurance.isAvailable = true;
    calculateInsurancePrice(0.9, "blackInsurance");
  }
}

function calculateInsurancePrice(coverageRage, insurance) {
  const coverage =
    coverageRage * Number(window.config.form.values.objectAppraisal);
  const commission = 0.05 * Number(window.config.form.values.monthlyIncome);
  const yearly = coverage + commission;
  window.config.cards[insurance].values.yearly = yearly / 2;
  const monthly = coverage / 12 + commission;
  window.config.cards[insurance].values.monthly = monthly / 2;
}

function buildInsuranceCards() {
  let isSomeInsuranceAvailable = false;
  Object.keys(window.config.cards).forEach((insurance) => {
    const cardConfig = window.config.cards[insurance];
    if (cardConfig.isAvailable) {
      let card = document.createElement("div");
      card.className = `card ${insurance
        .replace("Insurance", "")
        .toLowerCase()}`;
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${cardConfig.name}</h5>
          <p class="card-text">
            <b>Costo Anual:</b>
            $${cardConfig.values.yearly}
          </p>
          <p class="card-text">
            <b>Costo Mensual:</b>
            $${cardConfig.values.monthly}
          </p>
          <button class="btn btn-primary" onclick="selectInsurance('${insurance
            .replace("Insurance", "")
            .toLowerCase()}')">Lo quiero</button>
        </div>
      `;

      document.querySelector("#cardsContainer").append(card);
      isSomeInsuranceAvailable = true;
    }
  });

  if (!isSomeInsuranceAvailable) {
    document.querySelector(".sub-title").style.display = "none";
    document.querySelector("#cardsContainer").innerHTML = `
      <div class="alert alert-secondary" role="alert">
        En este momento no tenemos seguros disponibles para ti
      </div>
    `;
  }
}

function selectInsurance(message) {
  console.log("selectInsurance", message);
  window.parent.postMessage(message, "*");
}
