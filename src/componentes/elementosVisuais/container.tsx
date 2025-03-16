import React from 'react';

interface ContainerProps {
  title?: string; // Título opcional
  children: React.ReactNode; // Conteúdo interno
}

export function MainContainer({ title, children }: ContainerProps) {
  return (
    <div className="relative bg-white w-full max-w-[960px] rounded-3xl px-6 py-2 tablet:py-3 desktop:py-6 m-12 top-8 tablet:top-6 tablet:h-[480px] h-[90%]">
      {/* Cabeçalho */}
      {title && (
        <div className="flex w-full gap-2">
          <h1 className="flex w-full justify-center text-sky-900 text-2xl font-semibold">
            {title}
          </h1>
        </div>
      )}

      {/* Conteúdo personalizado */}
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}