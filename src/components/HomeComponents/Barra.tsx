import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import "./styles.ts"; // Importe o arquivo CSS para estilização
import logo from "../../image/logo.png";

interface BarChartProps {
  value: number;
  maxValue: number;
  width: number;
  height: number;
  borderRadius: number;
  onMaxValueChange: (maxValue: number) => void;
}

export function BarChart({ maxValue, width, onMaxValueChange }: BarChartProps) {
  const color = d3
    .scaleLinear<string>()
    .domain([0, maxValue / 2, maxValue])
    .range(["green", "yellow", "red"])
    .clamp(true);

  const [myValue, setMyValue] = useState("");
  const [currentMaxValue, setCurrentMaxValue] = useState(maxValue);
  const [newMaxValue, setNewMaxValue] = useState(maxValue);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const valor = parseInt(myValue || "0");
  const barWidth = (valor / currentMaxValue) * width;

  useEffect(() => {
    const storedValue = localStorage.getItem("valorTotal");
    if (storedValue) {
      setMyValue(storedValue);
    }
  }, []);

  const handleMaxValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    setNewMaxValue(newValue);
  };

  const handleSaveButtonClick = () => {
    setCurrentMaxValue(newMaxValue);
    onMaxValueChange(newMaxValue);
    setIsPopupOpen(false);
  };

  const handleCancelButtonClick = () => {
    setNewMaxValue(currentMaxValue);
    setIsPopupOpen(false);
  };

  return (
    <div className="bar-chart-container">
      <h1>Meta de Consumo em R$</h1>
      <div className="divBar">
        <div
          className="bar-container"
          style={{
            width: `${width}px`,
            height: `30px`,
            borderRadius: `20px`,
          }}
        >
          <div
            className="bar"
            style={{
              width: `${barWidth}px`,
              backgroundColor: color(parseInt(myValue || "0")),
            }}
          />
        </div>
      </div>
      <img src={logo} className="logo" alt="Descrição da imagem" />

      <div className="value-container">
        <div className="label-container">
          <label className="label">
            Meta atual: <strong>{"R$" + currentMaxValue}</strong>
          </label>
        </div>
        <button className="input" onClick={() => setIsPopupOpen(true)}>
          Atualizar Meta
        </button>
      </div>

      {isPopupOpen && (
        <div className="popup-container">
            <div className="backgroundpop">
          <h2>Definir Novo Valor</h2>
          <input
            type="number"
            value={newMaxValue}
            onChange={handleMaxValueChange}
          />
          <button onClick={handleSaveButtonClick}>Salvar</button>
          <button onClick={handleCancelButtonClick}>Cancelar</button>
        </div>
        </div>
      )}
    </div>
  );
}
