function play(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const compChoice = choices[Math.floor(Math.random() * choices.length)];

    let result = '';

    if (playerChoice === compChoice) {
        result = "It's a draw";
    } else if (
        (playerChoice === 'rock' && compChoice === 'scissors') ||
        (playerChoice === 'paper' && compChoice === 'rock') ||
        (playerChoice === 'scissors' && compChoice === 'paper')
    ) {
        result = 'You win!';
    } else {
        result = 'You lose!';
    }

    document.getElementById('result').innerHTML = `
        You chose <strong>${playerChoice}</strong><br>
        Computer chose <strong>${compChoice}</strong><br>
        <strong>${result}</strong>
    `;
}