import './App.css';

import { useEffect, useState } from 'react';
import InputForm from './components/inputForm/InputForm';
import DatePicker from './components/dataPicker/DatePicker';
import DayTable from './components/table/DayTable';

import MonthlySummary from './components/table/MonthlySummary';
import MonthNavigator from './components/monthNavigator/MonthNavigator';

import { calculateMonthlyTotals } from './helpers/production';
import { addProductionByDate, removeProductionRow } from './helpers/production';

import type { FormData, ProductionByDate } from './types';

function App() {
  // 👉 месяц, который ПОКАЗЫВАЕМ
  const [displayMonth, setDisplayMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  // 👉 дата, на которую ВВОДИМ данные
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 👉 основные данные
  const [productionByDate, setProductionByDate] = useState<ProductionByDate>(
    () => {
      const saved = localStorage.getItem('production');
      return saved ? JSON.parse(saved) : {};
    },
  );

  // ✅ СЧИТАЕМ totals ПОСЛЕ того, как есть productionByDate
  const monthlyTotals = calculateMonthlyTotals(productionByDate);

  const monthKey = `${displayMonth.getFullYear()}-${String(
    displayMonth.getMonth() + 1,
  ).padStart(2, '0')}`;

  const currentMonthSum = monthlyTotals[monthKey] ?? 0;

  const monthLabel = displayMonth.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  });

  const filteredByMonth = Object.fromEntries(
    Object.entries(productionByDate).filter(([dateKey]) =>
      dateKey.startsWith(monthKey),
    ),
  );

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
      <div className="main-input-container">
        <DatePicker
          className="datePicker"
          withInput
          onChange={date => setSelectedDate(date)}
        />

        <InputForm onSubmit={handleFormSubmit} />

        <MonthNavigator month={displayMonth} onChange={setDisplayMonth} />
      </div>

      <MonthlySummary monthLabel={monthLabel} sum={currentMonthSum} />

      {Object.entries(filteredByMonth)
        .sort()
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
