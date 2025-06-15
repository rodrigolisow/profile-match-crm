import React from 'react';

const Resultados = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 p-4 sm:p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Meus Resultados</h1>
          <p className="text-sm text-slate-500">Visualize os resultados dos seus testes</p>
        </div>
      </header>
      
      <main className="p-4 sm:p-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Em Desenvolvimento</h2>
          <p className="text-slate-600">
            Esta página está sendo desenvolvida. Em breve você poderá visualizar todos os seus resultados aqui.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Resultados;