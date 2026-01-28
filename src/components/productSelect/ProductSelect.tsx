import { useEffect, useRef, useState } from 'react';
import styles from './ProductSelect.module.css';
import { products } from '../../products';

interface ProductSelectProps {
  value: string;
  onChange: (code: string) => void;
}

export default function ProductSelect({ value, onChange }: ProductSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = products.find(p => p.code === value);

  // закрытие при клике вне
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={styles.control}
        onClick={() => setOpen(o => !o)}
      >
        {selected ? (
          <>
            <span className={styles.code}>{selected.code}</span>
            <span className={styles.name}>{selected.name}</span>
          </>
        ) : (
          <span className={styles.placeholder}>Код</span>
        )}
      </button>

      {open && (
        <ul className={styles.dropdown}>
          {products.map(product => (
            <li
              key={product.code}
              className={styles.option}
              onClick={() => {
                onChange(product.code);
                setOpen(false);
              }}
            >
              <span className={styles.code}>{product.code}</span>
              <span className={styles.name}>{product.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
