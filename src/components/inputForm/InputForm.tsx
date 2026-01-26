import styles from './inputForm.module.css';

import { products } from '../../products';
import { useState } from 'react';
import type { FormData } from '../../types';

interface InputFormProps {
  onSubmit: (data: FormData) => void;
}

export default function InputForm({ onSubmit }: InputFormProps) {
  const [code, setCode] = useState(products[0]?.code || '');
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
    setCode(products[0]?.code || '');
    setQuantity(null);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <select
        className={`${styles.input} input`}
        value={code}
        onChange={e => setCode(e.target.value)}
      >
        {products.map(product => (
          <option
            className={styles.selectOption}
            key={product.code}
            value={product.code}
          >
            {product.code} {product.name}
          </option>
        ))}
      </select>

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
