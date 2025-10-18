body {
  font-family: Arial, sans-serif;
  background: #fafafa;
  text-align: center;
  margin: 0;
  padding: 0;
}

h1 {
  margin-top: 32px;
  color: #1d3557;
}

.roulette-section {
  margin: 32px auto;
  max-width: 480px;
}

#roulette-wheel-container {
  position: relative;
  width: 360px;
  height: 360px;
  margin: 0 auto 24px auto;
}

#roulette-pointer {
  position: absolute;
  left: 50%;
  top: 7px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 40px solid #ffd700;
  z-index: 2;
}

#roulette-svg {
  width: 360px;
  height: 360px;
  display: block;
  margin: 0 auto;
  border-radius: 50%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.22);
  background: #222;
}

#spin-btn {
  padding: 13px 40px;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  background: #1d3557;
  color: #fff;
  cursor: pointer;
  margin-top: 6px;
  transition: background .2s;
}

#spin-btn:disabled {
  background: #aaa;
  cursor: not-allowed;
}

#roulette-result {
  margin-top: 30px;
  font-size: 1.3rem;
  min-height: 2.5em;
  color: #222;
  background: #f4f4f4;
  display: inline-block;
  padding: 0.6em 1.4em;
  border-radius: 12px;
  border: 2px solid #e63946;
}
