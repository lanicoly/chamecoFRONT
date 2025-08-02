
export const tiposUsuarios: Array<string> = ["Admin", "TI", "Aluno", "Motorista", "Professor", "Diretor.Geral", "Diretor.Ensino", "Coordenador", "Tec.Administrativo",
    "Servi.Terceirizado", "Engenheiro", "Enfermeiro", "Medico", "Psicologo", "Nutricionista", "Odontologo", "Pedagogo", "Vigilante"
];

// redirectUserTo.ts
export const redirectUserTo = (tipoUsuario: string): string => {
  switch (tipoUsuario) {
    case tiposUsuarios[0].toLowerCase():
    case tiposUsuarios[1].toLowerCase():
    case tiposUsuarios[5].toLowerCase():
      return "/menu";

    case tiposUsuarios[17].toLowerCase():
      return "/emprestimos";

    default:
      return "/login";
  }
};

