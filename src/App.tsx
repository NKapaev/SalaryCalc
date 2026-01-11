import './App.css';

import { useEffect, useState } from 'react';
import InputForm from './components/inputForm/InputForm';
import DatePicker from './components/dataPicker/DatePicker';
import DayTable from './components/table/DayTable';

import MonthlySummary from './components/table/MonthlySummary';
import { calculateMonthlyTotals } from './helpers/production';

import type { FormData, ProductionByDate } from './types';
import { removeProductionRow } from './helpers/production';
import { addProductionByDate } from './helpers/production';

function App() {
  const [productionByDate, setProductionByDate] = useState<ProductionByDate>(
    () => {
      const saved = localStorage.getItem('production');
      return saved ? JSON.parse(saved) : {};
    },
  );
  const monthlyTotals = calculateMonthlyTotals(productionByDate);

  const [selectedDate, setSelectedDate] = useState(new Date());

  function handleFormSubmit(formData: FormData) {
    setProductionByDate(prev =>
      addProductionByDate(prev, selectedDate, formData),
    );
  }

  useEffect(() => {
    localStorage.setItem('production', JSON.stringify(productionByDate));
  }, [productionByDate]);

  return (
    <div className="container">
      <DatePicker
        className="datePicker"
        withInput
        onChange={date => setSelectedDate(date)}
      />
      <InputForm onSubmit={handleFormSubmit} />
      <MonthlySummary totals={monthlyTotals} />
      {Object.entries(productionByDate)
        .reverse()
        .map(([date, rows]) => (
          <DayTable
            key={date}
            date={date}
            rows={rows}
            onDeleteRow={index =>
              setProductionByDate(prev =>
                removeProductionRow(prev, date, index),
              )
            }
          />
        ))}
    </div>
  );
}

export default App;
