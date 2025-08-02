import IMask, { InputMask } from "imask";

export function applyCpfMask(input: HTMLInputElement) {
  if (!input) return;

  let maskInstance: InputMask<any> | null = null;

  const handleInput = () => {
    const value = input.value.replace(/\D/g, ""); // Apenas números

    if (value.length !== 11) {
      maskInstance?.destroy();
      maskInstance = null;
      return;
    }

    if (!maskInstance) {
      maskInstance = IMask(input, {
        mask: "000.000.000-00",
      });
    }
  };

  input.addEventListener("input", handleInput);

  return () => {
    input.removeEventListener("input", handleInput);
    maskInstance?.destroy();
  };
}
