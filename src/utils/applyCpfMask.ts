import IMask from "imask";

export function applyCpfMask(input: HTMLInputElement) {
  if (!input) return;

  const maskInstance = IMask(input, {
    mask: "000.000.000-00",
  });

  return () => {
    maskInstance.destroy();
  };
}
