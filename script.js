'use strict';

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
  let matchPin;
  let acronymOwner;
  let ownerBalance;
  let acroUsers = accounts.map(account => account.owner.split(" ").map(word => word[0]).join("").toLowerCase())
  console.log(matchPin)
  console.log(acronymOwner)
  console.log("acroUsers", acroUsers)
  let interval;
  //////// LOGIN
  const login = (event) => {
    let time = 4 * 60 + 59;
    console.log("matchPin", matchPin)
    // Default inital value of timer
    // variable to the time
    let countDownTime = time;
    
    matchPin = accounts.find(account => Number(inputLoginPin.value) === account.pin)
    acronymOwner = matchPin?.owner.split(" ").map(word => word[0]).join("").toLowerCase()
    event.preventDefault()
    
    if (matchPin && acronymOwner === inputLoginUsername.value) containerApp.style.opacity = "100"
    labelWelcome.textContent = `welcome back ${matchPin.owner.split(" ")[0]}`
    ownerBalance = matchPin.movements.reduce((acc, currentValue) => acc + currentValue, 0)
    labelBalance.textContent = `${ownerBalance}€`
    const negativeDeposit = matchPin.movements.filter(value => value < 0).reduce((acc, currentValue) => acc + currentValue, 0)
    const positiveDeposit = matchPin.movements.filter(value => value > 0).reduce((acc, currentValue) => acc + currentValue, 0)
    const interest = (positiveDeposit * matchPin.interestRate).toFixed(2)
    labelSumInterest.textContent = interest /100
    labelSumIn.textContent = positiveDeposit
    labelSumOut.textContent = negativeDeposit
    
    
    clearInterval(interval)
    // Function calculate time string
    const findTimeString = () => {
      let minutes = Math.trunc(countDownTime / 60);
      let seconds = countDownTime % 60;
      if (String(minutes).length === 1) {
        minutes = "0" + minutes;
      }
      if (String(seconds).length === 1) {
        seconds = "0" + seconds;
      };
      countDownTime -= 1
      labelTimer.textContent = `${minutes}:${seconds}`
      if (countDownTime === 0){
        containerApp.style.opacity = "0"
        countDownTime = time
      }
    }
    interval = setInterval(findTimeString, 1000)
      
    containerMovements.innerHTML = ""
    console.log("matchPin.movements to display", matchPin.movements)
    containerMovements.insertAdjacentHTML("afterbegin", `
      ${matchPin.movements.toReversed().map((mov, i) => {
        return `
          <div class="movements__row">
            <div class="movements__type movements__type--${mov < 0 ? "withdrawal" : "deposit"}">${matchPin.movements.length -i} ${mov < 0 ? "withdrawal" : "deposit"}</div>
            <div class="movements__date">3 days ago</div>
            <div class="movements__value">${mov}€</div>
          </div>
          `
        } 
      )}
    `
    )
    inputLoginUsername.value =""
    inputLoginPin.value =""
  }
  let sortDeposits = matchPin?.movements.slice()

  const sortDeposit = () => {  
    
  sortDeposits = sortDeposits?.[0] > 0 ? matchPin.movements.toSorted((a,b) => a-b) : matchPin.movements.toSorted((a,b) => b-a)
  containerMovements.textContent = ""
  containerMovements.insertAdjacentHTML("afterbegin", `
    ${sortDeposits.toReversed().map((mov, i) => {
      return `
        <div class="movements__row">
          <div class="movements__type movements__type--${mov < 0 ? "withdrawal" : "deposit"}">${sortDeposits.length -i} ${mov < 0 ? "withdrawal" : "deposit"}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
        </div>
        `
      } 
    )}
  `)
}

const logout = (event) => {
  event.preventDefault()
  if (Number(inputClosePin.value) === matchPin.pin && acronymOwner === inputCloseUsername.value) containerApp.style.opacity = "0"
  labelWelcome.textContent = `Log in to get started`
  inputCloseUsername.value = ""
  inputClosePin.value = ""
}

const loan = (event) => {
  event.preventDefault()
  if (Number(inputLoanAmount.value) < 0 ) return
  if (Number(inputLoanAmount.value) < (ownerBalance * 0.1)) {
    inputLoanAmount.textContent = ""
    matchPin.movements.push(Number(inputLoanAmount.value))
    ownerBalance = matchPin.movements.reduce((acc, currentValue) => acc + currentValue, 0)
    labelBalance.textContent = `${ownerBalance}€`
    const positiveDeposit = matchPin.movements.filter(value => value > 0).reduce((acc, currentValue) => acc + currentValue, 0)
    const  interest = (positiveDeposit * matchPin.interestRate).toFixed(2)
    labelSumInterest.textContent = interest /100
    labelSumIn.textContent = positiveDeposit

    containerMovements.innerHTML = ""
    containerMovements.insertAdjacentHTML("afterbegin", `
      ${matchPin.movements.toReversed().map((mov, i) => {
        return `
          <div class="movements__row">
            <div class="movements__type movements__type--${mov < 0 ? "withdrawal" : "deposit"}">${matchPin.movements.length -i} ${mov < 0 ? "withdrawal" : "deposit"}</div>
            <div class="movements__date">3 days ago</div>
            <div class="movements__value">${mov}€</div>
          </div>
          `
        } 
      )}
    `
    )
  } else {
    console.log("no")
  }
}
const transfer = (event) => {
  event.preventDefault()
  const whoIsAcro = acroUsers.findIndex((element) => element === inputTransferTo.value);
  if (Number(inputTransferAmount.value) < 0 || whoIsAcro === -1 || (ownerBalance - inputTransferAmount.value)  < 0 ) return
  matchPin.movements.push(Number(-inputTransferAmount.value))
  ownerBalance = matchPin.movements.reduce((acc, currentValue) => acc + currentValue, 0)
  labelBalance.textContent = `${ownerBalance}€`
  const negativeDeposit = matchPin.movements.filter(value => value < 0).reduce((acc, currentValue) => acc + currentValue, 0)
  labelSumOut.textContent = negativeDeposit

  accounts[whoIsAcro].movements.push(Number(inputTransferAmount.value))
  inputTransferAmount.value = ""
  inputTransferTo.value = ""
  
  containerMovements.innerHTML = ""
  containerMovements.insertAdjacentHTML("afterbegin", `
    ${matchPin.movements.toReversed().map((mov, i) => {
      return `
        <div class="movements__row">
          <div class="movements__type movements__type--${mov < 0 ? "withdrawal" : "deposit"}">${matchPin.movements.length -i} ${mov < 0 ? "withdrawal" : "deposit"}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
        </div>
        `
      } 
    )}
  `
  )
}
//////// events
btnTransfer.addEventListener('click', transfer)
btnLoan.addEventListener('click', loan)
btnClose.addEventListener('click', logout)
btnLogin.addEventListener('click', login)
btnSort.addEventListener("click", sortDeposit)