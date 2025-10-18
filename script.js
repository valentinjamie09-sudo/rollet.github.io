body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: radial-gradient(circle, #0b0b0b, #000);
  color: #fff;
  text-align: center;
  margin: 0;
  padding: 0;
}

.container {
  margin-top: 40px;
}

.roulette-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 30px auto;
  perspective: 1000px;
}

.roulette-wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 8px solid #c8aa6e;
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
  box-shadow: 0 0 30px #c8aa6e;
}

.marker {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 20px solid white;
}

.controls {
  margin-top: 20px;
}

input[type="number"] {
  width: 80px;
  padding: 5px;
}

button {
  padding: 10px;
  margin: 5px;
  font-size: 16px;
  cursor: pointer;
  background: #222;
  color: white;
  border: 2px solid #555;
  border-radius: 5px;
}

button:hover {
  background: #444;
}

.number-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 360px;
  margin: 10px auto;
}

.number-grid button {
  width: 40px;
  height: 40px;
  margin: 2px;
  font-weight: bold;
  border-radius: 50%;
}
