import './dataPicker.css';

import { useState, useMemo, useCallback, useEffect } from 'react';

interface DateObject {
  year: number;
  month: number;
  day: number;
}

interface DatePickerProps {
  className?: string;
  onChange?: (value: Date) => void;
  withInput?: boolean;
  value?: Date;
}

const getCalendarDays = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  let firstDayOfMonth = date.getDay(); // 0 (Вс) ... 6 (Сб)

  // Превращаем: Пн=0, Вт=1, ..., Сб=5, Вс=6
  const shift = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const days = [];

  // Заполняем дни предыдущего месяца
  for (let i = shift - 1; i >= 0; i -= 1) {
    days.push({
      day: daysInPrevMonth - i,
      month: month - 1,
      year,
      isCurrentMonth: false,
    });
  }

  // Заполняем дни текущего месяца
  for (let i = 1; i <= daysInCurrentMonth; i += 1) {
    days.push({ day: i, month, year, isCurrentMonth: true });
  }

  // Заполняем дни следующего месяца до полной сетки (42 дня)
  while (days.length < 42) {
    const nextMonthDay: number = days.length - daysInCurrentMonth - shift + 1;
    days.push({
      day: nextMonthDay,
      month: month + 1,
      year,
      isCurrentMonth: false,
    });
  }

  return days;
};

function getTodayDate() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

export default function DatePicker({
  className = '',
  onChange = (): void => {},
  withInput = false,
  value = getTodayDate(),
}: DatePickerProps) {
  const initialDate =
    value instanceof Date
      ? new Date(value.getFullYear(), value.getMonth(), value.getDate())
      : getTodayDate();

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [currentDate, setCurrentDate] = useState<Date>(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );
  const [isOpen, setIsOpen] = useState(!withInput);

  useEffect(() => {
    if (value instanceof Date && selectedDate.getTime() !== value.getTime()) {
      const normalize = new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate(),
      );
      setSelectedDate(normalize);
      setCurrentDate(
        new Date(normalize.getFullYear(), normalize.getMonth(), 1),
      );
    }
  }, [value]);

  const calendarDays = useMemo(
    () => getCalendarDays(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate],
  );

  const handleSelectDate = (dateObj: DateObject): void => {
    const newDate = new Date(dateObj.year, dateObj.month, dateObj.day);
    setSelectedDate(newDate);
    setCurrentDate(new Date(dateObj.year, dateObj.month, 1));
    onChange?.(newDate);
  };

  const changeMonth = useCallback((offset: number) => {
    setCurrentDate(
      prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1),
    );
  }, []);

  return (
    <div className={`datepicker ${className}`}>
      {withInput && (
        <input
          className="datepicker-input"
          onClick={() => setIsOpen(!isOpen)}
          readOnly
          value={
            'Выбрать дату ' +
            selectedDate.toLocaleDateString('ru-RU', {
              weekday: 'long',
              month: 'long',
              day: '2-digit',
            })
          }
        />
      )}

      {isOpen && (
        <div
          className="datepicker-dropdown"
          style={
            withInput
              ? { position: 'absolute', zIndex: 5, top: '110%' }
              : undefined
          }
        >
          <div className="datepicker-header">
            <p className="datepicker-header-title">
              {currentDate.toLocaleString('ru-RU', { month: 'long' })}
              {currentDate.getFullYear()}
            </p>
            <div className="month-controllers-container">
              <button type="button" onClick={() => changeMonth(-1)}>
                &lt;
              </button>
              <button type="button" onClick={() => changeMonth(1)}>
                &gt;
              </button>
            </div>
          </div>

          <div className="datepicker-grid">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
              <div key={day} className="datepicker-dayname">
                {day}
              </div>
            ))}

            {calendarDays.map((dateObj, index) => {
              const currentDate = new Date(
                dateObj.year,
                dateObj.month,
                dateObj.day,
              );
              const isSelected =
                selectedDate.getTime() === currentDate.getTime();

              return (
                <div
                  key={index}
                  className={`datepicker-day ${
                    dateObj.isCurrentMonth ? 'current' : 'other-month'
                  } ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectDate(dateObj)}
                >
                  {dateObj.day}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
