import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './CurrencyConverter.css';

const CurrencyConverter: React.FC = () => {
    const [amount, setAmount] = useState<number>(1);
    const [baseCurrency, setBaseCurrency] = useState<string>('USD');
    const [targetCurrency, setTargetCurrency] = useState<string>('EUR');
    const [conversionResult, setConversionResult] = useState<number | null>(null);
    const [currencies, setCurrencies] = useState<string[]>([]);

    useEffect(() => {
        const userLocale = navigator.language;
        const defaultCurrency = userLocale.startsWith('ru') ? 'RUB' : 'USD';
        setBaseCurrency(defaultCurrency);

        axios.get('https://api.exchangerate-api.com/v4/latest/USD')
            .then(response => {
                setCurrencies(Object.keys(response.data.rates));
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        if (amount && baseCurrency && targetCurrency) {
            axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)
                .then(response => {
                    const rate = response.data.rates[targetCurrency];
                    setConversionResult(amount * rate);
                })
                .catch(error => console.error(error));
        }
    }, [amount, baseCurrency, targetCurrency]);

    return (
        <div className="currency-converter">
            <h2>Currency Converter</h2>
            <div>
                <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(parseFloat(e.target.value))}
                />
                <select
                    value={baseCurrency}
                    onChange={e => setBaseCurrency(e.target.value)}
                >
                    {currencies.map(currency => (
                        <option key={currency} value={currency}>
                            {currency}
                        </option>
                    ))}
                </select>
                <select
                    value={targetCurrency}
                    onChange={e => setTargetCurrency(e.target.value)}
                >
                    {currencies.map(currency => (
                        <option key={currency} value={currency}>
                            {currency}
                        </option>
                    ))}
                </select>
            </div>
            <div className="result">
                {conversionResult !== null ? (
                    <p>{amount} {baseCurrency} = {conversionResult.toFixed(2)} {targetCurrency}</p>
                ) : (
                    <p>Enter an amount to see the conversion.</p>
                )}
            </div>
        </div>
    );
};

export default CurrencyConverter;


