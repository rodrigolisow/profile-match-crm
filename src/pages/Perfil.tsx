import React from 'react';

const Perfil = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 p-4 sm:p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Meu Perfil</h1>
          <p className="text-sm text-slate-500">Gerencie suas informações pessoais</p>
        </div>
      </header>
      
      <main className="p-4 sm:p-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Em Desenvolvimento</h2>
          <p className="text-slate-600">
            Esta página está sendo desenvolvida. Em breve você poderá editar suas informações pessoais aqui.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Perfil;