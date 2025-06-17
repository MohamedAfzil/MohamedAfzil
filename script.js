// Selectors
const totalIncomeEl = document.getElementById('total-income');
const remainingBalanceEl = document.getElementById('remaining-balance');
const incomeForm = document.getElementById('income-form');
const expenseForm = document.getElementById('expense-form');
const transactionList = document.getElementById('transaction-list');
const resetButton = document.getElementById('reset-button'); // Reset button
const themeToggle = document.getElementById('theme-toggle'); // Theme toggle button
const themeLabel = document.getElementById('theme-label'); // Label for theme
const titleEl = document.querySelector('h1'); // Title element

// State
let totalIncome = 0;
let remainingBalance = 0;
let transactions = [];

// Load Data from localStorage
function loadData() {
  totalIncome = parseFloat(localStorage.getItem('totalIncome')) || 0;
  remainingBalance = parseFloat(localStorage.getItem('remainingBalance')) || 0;
  transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  updateBalance();
  renderTransactions();
  loadTheme();
}

// Save Data to localStorage
function saveData() {
  localStorage.setItem('totalIncome', totalIncome);
  localStorage.setItem('remainingBalance', remainingBalance);
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Update Displayed Income and Balance
function updateBalance() {
  totalIncomeEl.textContent = `₹${totalIncome.toLocaleString('en-IN')}`;
  remainingBalanceEl.textContent = `₹${remainingBalance.toLocaleString('en-IN')}`;
}

// Handle Income Addition or Subtraction
incomeForm.addEventListener('submit', event => {
  event.preventDefault();
  const adjustAmount = parseFloat(document.getElementById('adjust-amount').value);
  const adjustType = document.getElementById('adjust-type').value;

  if (!isNaN(adjustAmount) && adjustAmount > 0) {
    if (adjustType === 'add') {
      totalIncome += adjustAmount;
      remainingBalance += adjustAmount;
    } else if (adjustType === 'subtract') {
      if (adjustAmount <= remainingBalance) {
        totalIncome -= adjustAmount;
        remainingBalance -= adjustAmount;
      } else {
        alert('Cannot subtract more than the remaining balance.');
        return;
      }
    }
    saveData();
    updateBalance();
    incomeForm.reset();
  } else {
    alert('Please enter a valid positive amount.');
  }
});

// Handle Adding an Expense
expenseForm.addEventListener('submit', event => {
  event.preventDefault();
  const expenseDescription = document.getElementById('expense-description').value.trim();
  const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
  const dateTime = new Date().toLocaleString('en-IN');

  if (!/^[A-Za-z]+$/.test(expenseDescription)) {
    alert('Expense description must contain only letters with no spaces or symbols.');
    return;
  }

  if (!isNaN(expenseAmount) && expenseAmount > 0 && expenseAmount <= remainingBalance) {
    remainingBalance -= expenseAmount;

    const transaction = { id: Date.now(), description: expenseDescription, amount: expenseAmount, dateTime: dateTime };
    transactions.push(transaction);

    saveData();
    renderTransactions();
    updateBalance();
    expenseForm.reset();
  } else {
    alert('Invalid input or insufficient balance.');
  }
});

// Render Transaction History
function renderTransactions() {
  transactionList.innerHTML = ''; // Clear the current list
  transactions.slice().reverse().forEach(transaction => {
    const li = document.createElement('li');
    li.classList.add('expense');
    li.innerHTML = `
      <span>${transaction.description}</span>
      <span>- ₹${transaction.amount.toLocaleString('en-IN')}</span>
      <span>${transaction.dateTime}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
    transactionList.appendChild(li);
  });
}

// Reset Everything
resetButton.addEventListener('click', () => {
  localStorage.clear();
  location.reload();
});

// Toggle Dark/Light Theme
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', themeToggle.checked);
  localStorage.setItem('theme', themeToggle.checked ? 'dark' : 'light');
  titleEl.style.color = themeToggle.checked ? 'white' : 'black';
  themeLabel.textContent = themeToggle.checked ? 'Dark Theme: ON' : 'Dark Theme: OFF';
});

// Load Theme Preference
function loadTheme() {
  const isDarkMode = localStorage.getItem('theme') === 'dark';
  document.body.classList.toggle('dark-mode', isDarkMode);
  themeToggle.checked = isDarkMode;
  titleEl.style.color = isDarkMode ? 'white' : 'black';
  themeLabel.textContent = isDarkMode ? 'Dark Theme: ON' : 'Dark Theme: OFF';
}

// Initialize
loadData();
