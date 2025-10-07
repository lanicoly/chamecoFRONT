
export function limparCPF(cpf: string) {
  // Regex que valida o padrão de CPF: com ou sem pontuação 
  const regexCPF = /^(\d{3}\.?\d{3}\.?\d{3}-?\d{2})$/; 
  
  if (regexCPF.test(cpf)) { 
    return cpf.replace(/\D/g, ""); 
  } 
  
  // Se não bater com o padrão, retorna como veio (matricula em texto livre);
  return cpf;
}
