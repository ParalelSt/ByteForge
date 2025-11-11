import { useEffect, useRef, useState } from "react";

const useDropdown = (externalOpen?: boolean) => {
  const [isOpen, setIsOpen] = useState<boolean>(externalOpen ?? false);
  const dropDownRef = useRef(null);

  useEffect(() => {
    if (externalOpen !== null) {
      setIsOpen(externalOpen);
    }
  }, [externalOpen]);

  const toggleDropdown = setIsOpen((prev) => !prev);
  const openDropdown = setIsOpen(true);
  const closeDropdown = setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
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
