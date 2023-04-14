'use strict';

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2023-03-10T21:31:17.178Z',
    '2023-03-30T07:42:02.383Z',
    '2023-03-30T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-04-08T14:11:59.604Z',
    '2023-04-13T17:01:17.194Z',
    '2023-04-14T23:36:17.929Z',
    '2023-04-14T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2023-03-01T13:15:33.035Z',
    '2023-03-30T09:48:16.867Z',
    '2023-03-25T06:04:23.907Z',
    '2023-04-10T14:18:46.235Z',
    '2023-04-11T16:33:06.386Z',
    '2023-04-12T14:43:26.374Z',
    '2023-04-13T18:49:59.371Z',
    '2023-04-14T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2023-03-01T13:15:33.035Z',
    '2023-03-30T09:48:16.867Z',
    '2023-04-02T06:04:23.907Z',
    '2023-04-02T14:18:46.235Z',
    '2023-04-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-04-12T18:49:59.371Z',
    '2023-04-14T12:01:20.894Z',
  ],
  currency: 'WON',
  locale: 'ko-KR',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, -80,  50, 90, -60, 20],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2023-01-01T13:15:33.035Z',
    '2023-01-30T09:48:16.867Z',
    '2023-03-08T06:04:23.907Z',
    '2023-03-09T14:18:46.235Z',
    '2023-04-10T16:33:06.386Z',
    '2023-04-12T14:43:26.374Z',
    '2023-04-14T18:49:59.371Z',
    '2023-04-14T12:01:20.894Z',
  ],
  currency: 'SYP',
  locale: 'ar-SY',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const movementDate = document.querySelector('.movements__date');
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

  let interval;
  //////// LOGIN
  const login = (event) => {
    let time = 4 * 60 + 59;
    console.log("matchPin", matchPin)

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
    
    const date = new Date()
    const now = new Intl.DateTimeFormat(`${matchPin.locale}`, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date)

    labelDate.textContent = `${now}`

    
    /*     const daysTillNow = function(str) {
      let today = new Date();
      //time stamp is taken for testing
      let course_time = new Date(str);
      //difference in mili seconds
      let diff = today.getTime() - course_time.getTime();
      //round off mili-sec to days
      diff = Math.round(diff / (1000 * 60 * 60 * 24));
      return diff + " day(s)";
    }; */


    let movDateArr = matchPin.movementsDates.map((arrDate) => {
      console.log(new Date(arrDate).toLocaleDateString())

      
      let today = new Date()
      let courseTime = new Date(arrDate)
      let difff = today.getTime() - courseTime.getTime()
      let diffDay = Math.round(difff / (1000 * 60 * 60 * 24))

      console.log("diffDay", diffDay)

      if (diffDay === 0) movementDate.textContent = "Today"
      if (diffDay === 1) movementDate.textContent = "Yesterday"
      if (diffDay > 1 && diffDay < 7) movementDate.textContent = "This Week"
      if (diffDay > 7 && diffDay < 14) movementDate.textContent = "Last Week"
      if (diffDay > 14 && diffDay < 21) movementDate.textContent = "two weeks ago"
      if (diffDay > 21) movementDate.textContent = courseTime.toLocaleDateString()
      console.log("movementDate", movementDate.textContent)
      let movDate = movementDate.textContent
      
      return movDate
      
    })


    console.log(movDateArr)
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
            <div class="movements__date">${movDateArr.toReversed()[i]}</div>
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