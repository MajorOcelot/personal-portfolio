window.addEventListener('DOMContentLoaded', () => {
    let level = 1;
    let garbage = 0;
    let money = 0;
    let burnRate = 1;
    let burnerLevel = 1;
    let xp = 0;

    const garbageEl = document.getElementById('garbage');
    const moneyEl = document.getElementById('money');
    const burnRateEl = document.getElementById('burnRate');
    const logEl = document.getElementById('log');
    const levelEl = document.getElementById('level');
    const burnerLevelEl = document.getElementById('burnerLevel');
    const upgradeBurnerBtn = document.getElementById('upgradeBurner');

    function updateUI() {
        levelEl.textContent = level;
        garbageEl.textContent = garbage.toFixed(1);
        moneyEl.textContent = money.toFixed(2);
        burnRateEl.textContent = burnRate.toFixed(1);
        burnerLevelEl.textContent = burnerLevel;

        // Level XP bar
        const nextLevelXP = level * 100;
        const xpProgress = (xp / nextLevelXP) * 100;
        document.getElementById('xpBar').style.width = `${xpProgress}%`;

        // Burner cost progress bar
        const nextCost = 50 * burnerLevel;
        const burnerProgress = Math.min((money / nextCost) * 100, 100);
        document.getElementById('burnerBar').style.width = `${burnerProgress}%`;

        // Update burner upgrade button
        upgradeBurnerBtn.textContent = `Upgrade Burner ($${nextCost})`;

      
        // Disable the upgrade button if not enough money
        if (money < nextCost) {
          upgradeBurnerBtn.disabled = true;
          upgradeBurnerBtn.classList.add('disabled');
        } else {
          upgradeBurnerBtn.disabled = false;
          upgradeBurnerBtn.classList.remove('disabled');
        }
    }

    function burnGarbage() {
      garbage += burnRate;
      money += burnRate * 0.5;
      log(`Burned ${burnRate.toFixed(1)} lbs of garbage!`);
      gainXP(burnRate * 2); // Or however you earn XP
      updateUI();
    }

    document.getElementById('burn').addEventListener('click', burnGarbage);

    setInterval(() => {
      burnGarbage();
    }, 1000);

    document.getElementById('upgradeBurner').addEventListener('click', () => {
      const cost = 50 * burnerLevel;
      if (money >= cost) {
        money -= cost;
        burnerLevel++;
        burnRate += 0.5;
        log(`Upgraded burner to level ${burnerLevel}!`);
        showBurnerLevelUp(burnerLevel); // 👈 right here!
        updateUI();
      } else {
        log("Not enough money to upgrade!");
      }
    });

    function log(msg) {
      const entry = document.createElement('p');
      entry.textContent = msg;
      entry.classList.add('flash');
      logEl.prepend(entry);

      // Remove green flash after short time
      setTimeout(() => {
        entry.classList.remove('flash');
      }, 200);

      // Clean up excess log entries
      trimLogToMax(15);

      // Limit to 15 entries with a fade-out for the bottom one
      if (logEl.children.length > 15) {
        const lastEntry = logEl.lastChild;
        lastEntry.classList.add('fade-out');
        setTimeout(() => {
          lastEntry.remove();
        }, 450); // Wait for the fade-out animation to finish
      }
    }

    function trimLogToMax(maxEntries) {
      while (logEl.children.length > maxEntries) {
        const lastEntry = logEl.lastChild;

        if (!lastEntry.classList.contains('fade-out')) {
          lastEntry.classList.add('fade-out');
          setTimeout(() => {
            if (lastEntry.parentElement) {
              lastEntry.remove();
            }
          }, 50); // faster fade-out
        } else {
          break;
        }
      }
    }

    function gainXP(amount) {
        xp += amount;
        console.log(`XP: ${xp} / ${level * 100}`); // Debugging line to track XP
      
        if (xp >= level * 100) {
          xp -= level * 100;  // Reset XP once you level up
          level++;  // Level up
          log(`You leveled up to level ${level}!`);
          showLevelUp(level);  // Show level-up message
          updateUI();  // Update stats and XP bar
        }
    }

    function showLevelUp(level) {
        const msgEl = document.getElementById('levelUpInlineMessage');
        msgEl.textContent = `+1!`; // You can use `Level ${level}` if you prefer
        msgEl.classList.add('show');
      
        setTimeout(() => {
          msgEl.classList.remove('show');
        }, 1500);
    }

    function showBurnerLevelUp(level) {
        const msgEl = document.getElementById('burnerLevelUpMessage');
        msgEl.textContent = `+1`;
        msgEl.classList.add('show');

        setTimeout(() => {
          msgEl.classList.remove('show');
        }, 1500);
    }

    updateUI();
});