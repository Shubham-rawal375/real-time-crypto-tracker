// Target Dom Node Elements
const cryptoGrid = document.getElementById('crypto-grid');
const refreshBtn = document.getElementById('refresh-btn');

// Setup targeted tickers for identification tracking
const targetCryptos = ['bitcoin', 'ethereum', 'solana', 'cardano'];

/**
 * Pulls asynchronous ticker metrics via the CoinGecko public access node API
 */
async function fetchCryptoMetrics() {
    const ids = targetCryptos.join(',');
    const url = `https://coingecko.com{ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network limits hit or configuration failure');
        const data = await response.json();
        renderCryptoGrid(data);
    } catch (error) {
        cryptoGrid.innerHTML = `<div class="loading-state" style="color: var(--trend-down)">Error updating markets: Too many requests. Please try again later.</div>`;
    }
}

/**
 * Loops and transforms payload objects into layout component blocks
 * @param {Array} cryptoDataArray - Normalized arrays from data servers
 */
function renderCryptoGrid(cryptoDataArray) {
    cryptoGrid.innerHTML = ''; // Wipe loading placeholder structures cleanly
    
    cryptoDataArray.forEach(coin => {
        const isPositive = coin.price_change_percentage_24h >= 0;
        const changeClass = isPositive ? 'positive' : 'negative';
        const directionalIndicator = isPositive ? '+' : '';

        const card = document.createElement('div');
        card.className = 'crypto-card';
        card.innerHTML = `
            <div class="crypto-card-header">
                <span class="crypto-name">${coin.name}</span>
                <span class="crypto-symbol">${coin.symbol}</span>
            </div>
            <div class="crypto-price">$${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div class="crypto-change ${changeClass}">
                ${directionalIndicator}${coin.price_change_percentage_24h.toFixed(2)}% (24h)
            </div>
        `;
        cryptoGrid.appendChild(card);
    });
}

// Attach operational interaction handlers
refreshBtn.addEventListener('click', fetchCryptoMetrics);

// Auto initialize operational poll patterns
fetchCryptoMetrics();
setInterval(fetchCryptoMetrics, 60000); // Pool fresh metrics incrementally each minute
