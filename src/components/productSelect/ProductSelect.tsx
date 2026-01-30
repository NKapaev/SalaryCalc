import { useEffect, useRef, useState } from 'react';
import styles from './ProductSelect.module.css';
import { allProducts } from '../../dataStorage/allProducts';
import { carriageLiner } from '../../dataStorage/carriageLiner';
import { liner } from '../../dataStorage/liner';
import { products } from '../../dataStorage/products';

const pages = [
  { id: 'products', items: products },
  { id: 'carriage', items: carriageLiner },
  { id: 'liner', items: liner },
];

interface ProductSelectProps {
  value: string;
  onChange: (code: string) => void;
}

function getPageByCode(code: string) {
  if (products.some(p => p.code === code)) return 0;
  if (carriageLiner.some(p => p.code === code)) return 1;
  if (liner.some(p => p.code === code)) return 2;
  return 0;
}

export default function ProductSelect({ value, onChange }: ProductSelectProps) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);

  const [dragX, setDragX] = useState(0);
  const startX = useRef(0);

  const ref = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);

  const selected = allProducts.find(p => p.code === value);

  const translateX = -page * pageWidth + dragX;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      const page = value ? getPageByCode(value) : 0;
      setPage(page);
      setDragX(0);
    }
  }, [open, value]);

  useEffect(() => {
    if (open && pageRef.current) {
      setPageWidth(pageRef.current.offsetWidth);
    }
  }, [open]);

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
        <div className={styles.dropdown}>
          <div
            className={styles.carousel}
            style={{
              transform: `translateX(${translateX}px)`,
              transition: dragX === 0 ? 'transform 0.3s ease' : 'none',
            }}
            onTouchStart={e => {
              startX.current = e.touches[0].clientX;
            }}
            onTouchMove={e => {
              setDragX(e.touches[0].clientX - startX.current);
            }}
            onTouchEnd={() => {
              if (dragX < -60 && page < pages.length - 1) {
                setPage(p => p + 1);
              }
              if (dragX > 60 && page > 0) {
                setPage(p => p - 1);
              }
              setDragX(0);
            }}
          >
            {pages.map((p, i) => (
              <div
                key={p.id}
                className={styles.page}
                ref={i === 0 ? pageRef : null}
              >
                {p.items.map(product => (
                  <div
                    key={product.code}
                    className={styles.option}
                    onClick={() => {
                      onChange(product.code);
                      setOpen(false);
                    }}
                  >
                    <span className={styles.code}>{product.code}</span>
                    <span className={styles.name}>{product.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
