const API_KEY = 'I7fA07cvUGTI03v8'; // Replace with your API key
const USER_API = `https://api.torn.com/user/?selections=stocks&key=${API_KEY}`;
const STOCK_API = `https://api.torn.com/torn/?selections=stocks&key=${API_KEY}`;
const STORAGE_KEY = 'torn_stock_prices';

async function fetchAllData() {
  try {
    const [userRes, stockRes] = await Promise.all([
      fetch(USER_API),
      fetch(STOCK_API),
    ]);

    const userData = await userRes.json();
    const stockData = await stockRes.json();

    if (userData.error || stockData.error) {
      throw new Error('API Error: check your key and selections');
    }

    const ownedStocks = userData.stocks || {};
    const stocks = stockData.stocks;

    const previousPrices = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const currentPrices = {};

    const stockArray = Object.entries(stocks).map(([id, stock]) => {
        const userStock = ownedStocks[id];
        const quantity = userStock?.total_shares || 0;
        
        let avgBuyPrice = 0;
        let invested = 0;
        if (userStock?.transactions) {
          let totalCost = 0;
          let totalShares = 0;
          Object.values(userStock.transactions).forEach(tx => {
            totalCost += tx.shares * tx.bought_price;
            totalShares += tx.shares;
          });
          avgBuyPrice = totalShares > 0 ? totalCost / totalShares : 0;
          invested = totalCost;
        }
        
        const valueOwned = quantity * stock.current_price;
        const profitLoss = valueOwned - invested;

        const prevPrice = previousPrices[id];
        const change = prevPrice
            ? (((stock.current_price - prevPrice) / prevPrice) * 100).toFixed(2)
            : 'N/A';

        currentPrices[id] = stock.current_price;

        return {
            id,
            name: stock.name,
            price: stock.current_price,
            change,
            quantity,
            valueOwned,
            avgBuyPrice,
            profitLoss
        };
    });

    // Sort by valueOwned descending
    stockArray.sort((a, b) => b.valueOwned - a.valueOwned);

    renderTable(stockArray);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPrices));
  } catch (error) {
    console.error('Error loading data:', error.message);
  }
}

function renderTable(stocks) {
    const tbody = document.querySelector('#stock-table tbody');
    tbody.innerHTML = '';
  
    stocks.forEach((stock) => {
      // Determine row class based on profit/loss
      const rowClass = stock.profitLoss > 0
        ? 'profit'  // Green for profit
        : stock.profitLoss < 0
        ? 'loss'    // Red for loss
        : '';       // No specific class if break-even
  
      const row = document.createElement('tr');
      row.classList.add(rowClass); // Apply profit/loss class to entire row
  
      row.innerHTML = `
        <td class="stock-cell">${stock.id}</td>
        <td class="stock-cell">${stock.name}</td>
        <td class="stock-cell">$${stock.price.toLocaleString()}</td>
        <td class="stock-cell" style="color: ${stock.change >= 0 ? 'green' : 'red'}">
          ${stock.change === 'N/A' ? '—' : `${stock.change}%`}
        </td>
        <td class="stock-cell">${stock.quantity}</td>
        <td class="stock-cell">$${stock.valueOwned.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
        <td class="stock-cell">$${stock.avgBuyPrice.toFixed(2)}</td>
        <td class="stock-cell" style="color: ${stock.profitLoss >= 0 ? 'green' : 'red'}">
          $${stock.profitLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </td>
      `;
      tbody.appendChild(row);
    });
  }

fetchAllData();
setInterval(fetchAllData, 60000);