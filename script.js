body {
  background-color: #0d0d0d;
  color: white;
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 0;
  padding: 20px;
}

.game-container {
  max-width: 600px;
  margin: auto;
}

h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.balance {
  font-size: 18px;
  margin-bottom: 20px;
}

.roulette {
  position: relative;
  width: 250px;
  height: 250px;
  margin: 20px auto;
}

.wheel {
  width: 100%;
  height: 100%;
  border: 8px solid gold;
  border-radius: 50%;
  background: conic-gradient(
    red 0deg 9.72deg,
    black 9.72deg 19.44deg,
    red 19.44deg 29.16deg,
    black 29.16deg 38.88deg,
    red 38.88deg 48.6deg,
    black 48.6deg 58.32deg,
    red 58.32deg 68.04deg,
    black 68.04deg 77.76deg,
    red 77.76deg 87.48deg,
    black 87.48deg 97.2deg,
    red 97.2deg 106.92deg,
    black 106.92deg 116.64deg,
    red 116.64deg 126.36deg,
    black 126.36deg 136.08deg,
    red 136.08deg 145.8deg,
    black 145.8deg 155.52deg,
    red 155.52deg 165.24deg,
    black 165.24deg 174.96deg,
    red 174.96deg 184.68deg,
    black 184.68deg 194.4deg,
    red 194.4deg 204.12deg,
    black 204.12deg 213.84deg,
    red 213.84deg 223.56deg,
    black 223.56deg 233.28deg,
    red 233.28deg 243deg,
    black 243deg 252.72deg,
    red 252.72deg 262.44deg,
    black 262.44deg 272.16deg,
    red 272.16deg 281.88deg,
    black 281.88deg 291.6deg,
    red 291.6deg 301.32deg,
    black 301.32deg 311.04deg,
    red 311.04deg 320.76deg,
    black 320.76deg 330.48deg,
    green 330.48deg 360deg
  );
  transition: transform 4s ease-out;
}

.pointer {
  position: absolute;
  top: 50%;
  right: -10px;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border: 10px solid white;
  border-left-color: transparent;
  border-top-color: transparent;
  transform: rotate(45deg);
}

.welcome {
  background-color: #2b2b2b;
  padding: 10px;
  margin: 20px 0;
}

.betting {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

input[type="number"] {
  width: 60px;
  padding: 5px;
  font-size: 16px;
}

.color-btn {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.red {
  background-color: #c0392b;
  color: white;
}

.black {
  background-color: #1c1c1c;
  color: white;
}

.number-pick {
  margin: 20px 0;
}

.number-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  justify-content: center;
}

.number-grid button {
  width: 40px;
  height: 40px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.number-grid button.red {
  background-color: red;
}

.number-grid button.black {
  background-color: black;
}

.number-grid button.green {
  background-color: green;
}

.number-grid button.selected {
  outline: 3px solid yellow;
}

.spin-btn {
  margin-top: 10px;
  padding: 15px 30px;
  background-color: #2c3e50;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.spin-btn:disabled {
  background-color: #555;
  cursor: not-allowed;
}

.result-msg {
  margin-top: 20px;
  font-size: 18px;
}
