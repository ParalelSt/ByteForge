import { useEffect, useRef, useState } from "react";

const useDropdown = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = setIsOpen((prev) => !prev);
  const openDropdown = setIsOpen(true);
  const closeDropdown = setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return [
    toggleDropdown,
    openDropdown,
    closeDropdown,
    dropDownRef,
    isOpen,
  ] as const;
};

export default useDropdown;
