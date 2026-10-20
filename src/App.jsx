import './App.css'
import { useState } from 'react'

const denominations = [
  { name: "twenties", label: "Twenties", cents: 2000 },
  { name: "tens",     label: "Tens",     cents: 1000 },
  { name: "fives",    label: "Fives",    cents: 500 },
  { name: "ones",     label: "Ones",     cents: 100 },
  { name: "quarters", label: "Quarters", cents: 25 },
  { name: "dimes",    label: "Dimes",    cents: 10 },
  { name: "nickels",  label: "Nickels",  cents: 5 },
  { name: "pennies",  label: "Pennies",  cents: 1 },
];

function App() {
  const [amountDue, setAmountDue] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [message, setMessage] = useState("");
  const [breakdown, setBreakdown] = useState({});
  const [isOwed, setIsOwed] = useState(false);

  const handleCalculate = () => {
    if (!amountDue.trim() || !amountReceived.trim()) {
      setMessage("Please enter both amounts");
      setIsOwed(true);
      setBreakdown({});
      return;
    }

    const due = Number(amountDue);
    const received = Number(amountReceived);
    if (!Number.isFinite(due) || !Number.isFinite(received) || due < 0 || received < 0) {
      setMessage("Please enter valid amounts (numbers only, no $ or commas)");
      setIsOwed(true);
      setBreakdown({});
      return;
    }

    const change = received - due;
    setIsOwed(change < 0);
    if (change >= 0) {
      setMessage(`The total change due is $${change.toFixed(2)}`);
    } else { 
      setMessage(`Additional money owed is $${Math.abs(change).toFixed(2)}`);
      setBreakdown({});
      return;
    }

    let cents = Math.round(change * 100);
    const result = {};
    for (const d of denominations) {
      result[d.name] = Math.floor(cents / d.cents);
      cents = cents % d.cents;
    }
    setBreakdown(result);

  };
  return (
    <div className="app">
      <header className="app-header">
        <h1>Change Calculator</h1>
        <p className="subtitle">Enter the amount due and the amount received to see the change.</p>
      </header>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="panel">
            <label className="field-label" htmlFor="amountDue">Amount due</label>
            <input className="form-control field-input"
              id="amountDue"
              data-testid="amountDue"
              inputMode="decimal"
              placeholder="0.00"
              value={amountDue}
              onChange={(e) => setAmountDue(e.target.value)}></input>

            <label className="field-label" htmlFor="amountReceived">Amount received</label>
            <input className="form-control field-input"
              id="amountReceived"
              data-testid="amountReceived"
              inputMode="decimal"
              placeholder="0.00"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}></input>

            <button data-testid="calculate"
              onClick={handleCalculate}
              className="calc-button">Calculate</button>
          </div>
        </div>

        <div className="col-md-8">
          <div className="panel">
            {message
              ? <div className={`result ${isOwed ? "result-error" : "result-success"}`}>{message}</div>
              : <div className="result result-empty">Your result will appear here.</div>}

            <div className="denoms">
              {denominations.map((d) => (
                <div className="denom" key={d.name}>
                  <span className="denom-count" data-testid={d.name}>{breakdown[d.name] ?? "–"}</span>
                  <span className="denom-label">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
