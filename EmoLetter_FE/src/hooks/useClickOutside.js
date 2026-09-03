import { useEffect } from 'react';

/** ref 바깥을 클릭하면 handler를 실행한다. */
export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const onMouseDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [ref, handler]);
};

export default useClickOutside;
