
export function App() {
  return (
    <div className="flex items-center justify-center bg-tijolos h-screen bg-no-repeat bg-cover">

    {/* parte informativa tela salas */}
    <div className="relative bg-white w-[60%] min-w-[600px] rounded-3xl px-6 py-6">

      {/* cabeçalho tela salas */}
       <div className="flex w-full gap-8">
        <a href="#" className="flex gap-2 justify-start items-center font-medium text-lg text-sky-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#082f49" className="bi bi-chevron-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
          </svg>
          VOLTAR
        </a>
        <h1 className="flex flex-1 justify-center pr-24 text-sky-900 text-2xl font-semibold">BLOCO X</h1>
       </div>
        {/* fim cabeçalho tela salas */}


        {/* conteudo central tela salas */}
       <div className="flex flex-col px-8 py-4 w-full justify-center gap-3">

          {/* adicionar sala + pesquisa */}
          <div className="flex justify-between items-center">

            <button className="px-4 py-1.5 bg-[#18C64F] text-white font-medium flex gap-2 justify-center items-center hover:bg-[#56ab71] rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" className="bi bi-plus-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
              </svg>
              ADICIONAR SALA
            </button>

            {/* input de pesquisa */}
            <form action="" className="h-fit items-center">
              <div className="flex justify-between items-center px-2 py-1 border-solid border-[1px] border-slate-500 rounded-md">

              <input type="text" name="pesquisa-sala" placeholder="Pesquisar..." className="placeholder-sky-900 text-xs font-medium outline-none"/>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#64748b" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
              </svg>
              </div>
            </form>
            {/* fim input de pesquisa */}

          </div>
          {/* fim adicionar sala + pesquisa */}


          {/* conteudo central tabela*/}
          <div>

            {/* botões editar e excluir */}
            <div className="flex gap-4 justify-end">
            <a href="#" className="flex gap-1 justify-start items-center font-medium text-sm text-[#646999] underline">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#646999" className="bi bi-pen" viewBox="0 0 16 16">
              <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
            </svg>
              Editar
            </a>           
          <a href="#" className="flex gap-1 justify-start items-center font-medium text-sm text-rose-600 underline">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#e11d48" className="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
          </svg>
            Excluir
          </a>
            </div>
            {/* fim botões editar e excluir */}

            {/* tabela com todas as salas */}
            <div>
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="text-left text-[10px] font-medium text-sky-900 w-1/4">Nome da sala</th>
                  <th className="text-left text-[10px] font-medium text-sky-900 flex-1">Descrição da sala</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-[#d5d8f1]">
                  <td className="w-1/4 px-2 py-2 max-w-16 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] text-center">
                    Sala A01
                  </td>
                  <td className="flex-1 px-2 py-2 max-w-16 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] text-center">
                    Laboratório
                  </td>
                </tr>
                <tr className="hover:bg-[#d5d8f1]">
                  <td className="w-1/4 px-2 py-2 max-w-16 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] text-center">
                    Sala A02
                  </td>
                  <td className="flex-1 px-2 py-2 max-w-16 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] text-center">
                    Laboratório
                  </td>
                </tr>
                <tr className="hover:bg-[#d5d8f1]">
                  <td className="w-1/4 px-2 py-2 max-w-16 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] text-center">
                    Sala A02
                  </td>
                  <td className="flex-1 px-2 py-2 max-w-16 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] text-center">
                    Laboratório
                  </td>
                </tr>
                <tr className="hover:bg-[#d5d8f1]">
                  <td className="w-1/4 px-2 py-2 max-w-16 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] text-center">
                    Sala A02
                  </td>
                  <td className="flex-1 px-2 py-2 max-w-16 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] text-center">
                    Laboratório
                  </td>
                </tr>
                <tr className="hover:bg-[#d5d8f1]">
                  <td className="w-1/4 px-2 py-2 max-w-16 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] text-center">
                    Sala A02
                  </td>
                  <td className="flex-1 px-2 py-2 max-w-16 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] text-center">
                    Laboratório
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
            {/* fim tabela com todas as salas */}

            {/* passador de página */}
            <div className=" mt-2 flex justify-end items-center">

            <button className="size-[22px] rounded-sm text-white text-sm flex items-center justify-center font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#075985" className="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
          </svg>
            </button>

            <div className="w-24 gap-1.5 px-2 py-1 flex items-center justify-center">
                <div className="size-[28px] rounded-full bg-[#8d93c9] text-white text-sm flex items-center justify-center font-semibold">1</div>
                <div className="text-base text-sky-800 font-semibold">de <strong className="font-bold">10</strong></div>
            </div>

            <button className="size-[22px] rounded-sm text-white text-sm flex items-center justify-center font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#075985" className="bi bi-chevron-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
            </svg>
            </button>

            </div>
            {/* fim passador de página */}

          </div>
          {/* fim conteudo central tabela*/}
       </div>
        {/* fim conteudo central tela salas */}

        {/* logo chameco lateral */}
          <div className="flex justify-start">
            <img width={200} src="\public\logo_lateral.png" alt="logo chameco" />
          </div>
        {/* fim logo chameco lateral */}

    </div>
    {/* fim parte informativa tela salas */}

  </div>
  )
}

