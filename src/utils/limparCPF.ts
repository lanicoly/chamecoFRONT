
export function limparCPF(cpf: string) {
    return cpf.replace(/\D/g, "");
}