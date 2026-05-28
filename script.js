// Diamond packages for each game (amount: price in USD) - Made more affordable
const diamondPackages = {
    mlbb: {
        50: 0.49,
        100: 0.89,
        200: 1.69,
        300: 2.49,
        500: 3.99,
        1000: 7.49,
        2000: 14.49
    },
    freefire: {
        100: 0.49,
        200: 0.89,
        400: 1.69,
        800: 3.19,
        1200: 4.69,
        2000: 7.49
    },
    pubgm: {
        60: 0.49,
        120: 0.89,
        180: 1.29,
        300: 1.99,
        600: 3.99,
        1200: 7.49
    },
    genshin: {
        60: 0.49,
        300: 1.99,
        980: 5.99,
        1980: 11.49,
        3240: 18.99,
        6480: 37.49
    },
    codm: {
        50: 0.49,
        100: 0.89,
        200: 1.69,
        300: 2.49,
        500: 3.99,
        1000: 7.49
    }
};

// DOM Elements
const gameSelect = document.getElementById('gameSelect');
const amountSelect = document.getElementById('amountSelect');
const priceInput = document.getElementById('price');
const topupForm = document.getElementById('topupForm');
const submitBtn = document.getElementById('submitBtn');
const serverGroup = document.getElementById('serverGroup');
const serverIdInput = document.getElementById('serverId');
const qrModal = document.getElementById('qrModal');
const qrImage = document.getElementById('qrImage');
const qrDetails = document.getElementById('qrDetails');
const closeQrBtn = document.getElementById('closeQrBtn');

// Populate diamond amounts when game is selected
gameSelect.addEventListener('change', function() {
    const game = this.value;
    amountSelect.innerHTML = '<option value="">-- Choose amount --</option>';
    priceInput.value = '';
    
    if (game && diamondPackages[game]) {
        const packages = diamondPackages[game];
        // Sort amounts ascending
        const sortedAmounts = Object.keys(packages).sort((a, b) => parseInt(a) - parseInt(b));
        
        sortedAmounts.forEach(amount => {
            const option = document.createElement('option');
            option.value = amount;
            option.textContent = `${amount} Diamonds`;
            amountSelect.appendChild(option);
        });
    }
    // Show server ID field for games that require a server
    const gamesWithServer = ['mlbb', 'pubgm', 'codm'];
    if (gamesWithServer.includes(game)) {
        serverGroup.style.display = 'block';
        serverIdInput.required = true;
    } else {
        serverGroup.style.display = 'none';
        serverIdInput.required = false;
    }
});

// Update price when amount is selected
amountSelect.addEventListener('change', function() {
    const game = gameSelect.value;
    const amount = this.value;
    
    if (game && amount && diamondPackages[game] && diamondPackages[game][amount]) {
        priceInput.value = `${diamondPackages[game][amount].toFixed(2)} chips`;
    } else {
        priceInput.value = '';
    }
});

// Handle form submission
topupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    if (!gameSelect.value || !amountSelect.value || !priceInput.value || !document.getElementById('paymentMethod').value) {
        alert('Please fill in all fields.');
        return;
    }

    const gameName = gameSelect.options[gameSelect.selectedIndex].text;
    const amount = amountSelect.options[amountSelect.selectedIndex].text;
    const price = priceInput.value;
    const paymentMethodValue = document.getElementById('paymentMethod').value;
    const paymentMethod = document.getElementById('paymentMethod').options[document.getElementById('paymentMethod').selectedIndex].text;
    const userId = document.getElementById('userId').value;
    const serverId = serverIdInput.value || '';

    // Build order payload to embed in QR code (simple JSON)
    const order = {
        orderId: 'ORD-' + Date.now(),
        game: gameSelect.value,
        gameName: gameName,
        userId: userId,
        serverId: serverId,
        amount: amountSelect.value,
        amountLabel: amount,
        price: parseFloat(diamondPackages[gameSelect.value][amountSelect.value]),
        paymentMethod: paymentMethodValue
    };

    const payload = JSON.stringify(order);

    // Use a simple public QR generator for demo purposes
    const qrSrc = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(payload);
    qrImage.src = qrSrc;
    qrDetails.innerText = `Order: ${order.orderId}\nGame ID: ${userId}${serverId ? ' | Server: ' + serverId : ''}\nAmount: ${order.amountLabel}\nPrice: ${order.price} chips\nPayment: ${paymentMethod}`;
    qrModal.style.display = 'flex';
});

// Close QR modal and reset form
closeQrBtn.addEventListener('click', function() {
    qrModal.style.display = 'none';
    alert('If you completed the payment, your top-up will be processed shortly.');
    topupForm.reset();
    amountSelect.innerHTML = '<option value="">-- Choose amount --</option>';
    priceInput.value = '';
    serverGroup.style.display = 'none';
});
});