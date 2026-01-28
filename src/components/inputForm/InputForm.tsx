import styles from './inputForm.module.css';

import { useState } from 'react';
import type { FormData } from '../../types';
import ProductSelect from '../productSelect/ProductSelect';

interface InputFormProps {
  onSubmit: (data: FormData) => void;
}

export default function InputForm({ onSubmit }: InputFormProps) {
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState<number | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!code || quantity === null) {
      alert('Заполните все поля');
      return;
    }

    onSubmit({
      code,
      quantity,
    });

    // Сброс формы
    setCode('');
    setQuantity(null);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <ProductSelect value={code} onChange={setCode} />

      <input
        className={`${styles.input} input`}
        type="number"
        // 3. Если quantity null, передаем пустую строку, чтобы не видеть 0
        value={quantity ?? ''}
        onChange={e => {
          const val = e.target.value;
          // 4. Если строка пустая (стерли число), записываем null
          setQuantity(val === '' ? null : Number(val));
        }}
        placeholder="Количество"
      />

      <button className={styles.formButton} type="submit">
        Добавить
      </button>
    </form>
  );
}
